'use strict';

const fs = require('fs');
const path = require('path');
const BaseManager = require('./BaseManager');
const { ValidationError, PluginError } = require('../config/errors');

function normalizePlugin(plugin, source) {
  if (!plugin || typeof plugin !== 'object') throw new ValidationError('plugin must be an object');
  if (!plugin.name) throw new ValidationError('plugin.name is required');

  const commands = Array.isArray(plugin.commands) ? plugin.commands.slice() : [];
  const events = plugin.events && typeof plugin.events === 'object' ? { ...plugin.events } : {};

  return {
    ...plugin,
    name: String(plugin.name).trim(),
    version: plugin.version || '1.0.0',
    category: plugin.category || 'general',
    description: String(plugin.description || ''),
    commands,
    events,
    source
  };
}

function copyPlugin(plugin, source) {
  return {
    ...plugin,
    commands: Array.isArray(plugin.commands) ? plugin.commands.map(command => ({
      ...command,
      aliases: Array.isArray(command.aliases) ? command.aliases.slice() : [],
      permissions: Array.isArray(command.permissions) ? command.permissions.slice() : []
    })) : [],
    events: plugin.events && typeof plugin.events === 'object' ? { ...plugin.events } : {},
    source
  };
}

class PluginManager extends BaseManager {
  constructor(api) {
    super(api, 'PluginManager');
    this._plugins = new Map();
  }

  register(plugin, source = 'runtime') {
    const normalized = normalizePlugin(plugin, source);
    const name = normalized.name;

    if (this._plugins.has(name)) {
      this.unregister(name);
    }

    this._plugins.set(name, normalized);
    return copyPlugin(normalized, source);
  }

  unregister(name) {
    const plugin = this._plugins.get(String(name));
    if (!plugin) return false;
    if (this.api?.commandManager?.unregisterBySource) {
      this.api.commandManager.unregisterBySource(plugin.source || plugin.name);
    }
    return this._plugins.delete(String(name));
  }

  clear() {
    for (const name of [...this._plugins.keys()]) this.unregister(name);
  }

  get(name) {
    const plugin = this._plugins.get(String(name));
    return plugin ? copyPlugin(plugin, plugin.source) : null;
  }

  list() {
    return [...this._plugins.values()].map(plugin => copyPlugin(plugin, plugin.source));
  }

  async loadAll(dir) {
    const baseDir = path.resolve(dir);
    if (!fs.existsSync(baseDir)) return [];

    const loaded = [];
    const entries = fs.readdirSync(baseDir).filter(entry => entry.endsWith('.js')).sort();

    for (const entry of entries) {
      const full = path.join(baseDir, entry);
      try {
        const exported = require(full);
        const pluginDefinition = typeof exported === 'function' ? exported(this.api) : exported;
        const registered = this.register(pluginDefinition, full);

        if (typeof registered.onLoad === 'function') {
          await registered.onLoad(this.api);
        }

        if (Array.isArray(registered.commands)) {
          for (const command of registered.commands) {
            this.api?.commandManager?.register?.(command, registered.source || full);
          }
        }

        loaded.push(registered.name);
      } catch (error) {
        await this.unloadAll();
        throw new PluginError(`Failed to load plugin: ${entry}`, error.message);
      }
    }

    this.emit('loaded', loaded);
    return loaded;
  }

  async unloadAll() {
    for (const plugin of [...this._plugins.values()].reverse()) {
      try {
        if (typeof plugin.onUnload === 'function') await plugin.onUnload(this.api);
      } catch (error) {
        this._log('warn', `plugin unload failed: ${plugin.name}`, { error });
      } finally {
        this.api?.commandManager?.unregisterBySource?.(plugin.source || plugin.name);
      }
    }
    this._plugins.clear();
    this.emit('unloaded');
  }

  async dispatch(eventName, payload) {
    for (const plugin of this._plugins.values()) {
      const handler = plugin.events?.[eventName];
      if (typeof handler === 'function') {
        try {
          await handler(payload, this.api, plugin);
        } catch (error) {
          this._log('warn', `plugin event failed: ${plugin.name}.${eventName}`, { error });
        }
      }
    }
  }

  async shutdown() {
    await this.unloadAll();
    await super.shutdown();
  }
}

module.exports = PluginManager;
module.exports.PluginManager = PluginManager;
module.exports.default = PluginManager;
