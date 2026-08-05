'use strict';

const fs = require('fs');
const path = require('path');
const BaseManager = require('./BaseManager');
const { CommandError, ValidationError } = require('../config/errors');

function normalizeCommand(command) {
  if (!command || typeof command !== 'object') throw new ValidationError('command must be an object');
  if (!command.name) throw new ValidationError('command.name is required');
  if (typeof command.run !== 'function') throw new ValidationError(`Command ${command.name} must define run(ctx, api)`);

  const aliases = Array.isArray(command.aliases) ? command.aliases.map(alias => String(alias).trim()).filter(Boolean) : [];
  const permissions = Array.isArray(command.permissions) ? command.permissions.map(permission => String(permission).trim()).filter(Boolean) : [];

  return {
    ...command,
    name: String(command.name).trim(),
    aliases,
    category: command.category || 'general',
    cooldown: Number(command.cooldown || 0),
    description: String(command.description || ''),
    permissions
  };
}

function copyCommand(command, source) {
  return {
    ...command,
    aliases: Array.isArray(command.aliases) ? command.aliases.slice() : [],
    permissions: Array.isArray(command.permissions) ? command.permissions.slice() : [],
    source
  };
}

class CommandManager extends BaseManager {
  constructor(api) {
    super(api, 'CommandManager');
    this._commands = new Map();
    this._aliases = new Map();
  }

  register(command, source = 'runtime') {
    const normalized = normalizeCommand(command);
    const name = normalized.name;

    if (this._commands.has(name)) {
      this.unregister(name);
    }

    const record = copyCommand(normalized, source);
    this._commands.set(name, record);
    for (const alias of record.aliases) this._aliases.set(alias, name);
    return copyCommand(record, source);
  }

  resolve(name) {
    return this.get(name);
  }

  unregister(name) {
    const key = String(name);
    const command = this._commands.get(key);
    if (!command) return false;

    for (const alias of command.aliases || []) {
      if (this._aliases.get(alias) === key) this._aliases.delete(alias);
    }

    return this._commands.delete(key);
  }

  unregisterBySource(source) {
    const removed = [];
    for (const [name, command] of [...this._commands.entries()]) {
      if (command.source === source) {
        removed.push(name);
        this.unregister(name);
      }
    }
    return removed;
  }

  clear() {
    this._commands.clear();
    this._aliases.clear();
  }

  get(name) {
    const key = String(name);
    const resolved = this._commands.get(key) || this._commands.get(this._aliases.get(key));
    return resolved ? copyCommand(resolved, resolved.source) : null;
  }

  list() {
    return [...this._commands.values()].map(command => copyCommand(command, command.source));
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
        const command = typeof exported === 'function' ? exported(this.api) : exported;
        const registered = this.register(command, full);
        loaded.push(registered.name);
      } catch (error) {
        throw new CommandError(`Failed to load command: ${entry}`, error.message);
      }
    }

    this.emit('loaded', loaded);
    return loaded;
  }

  async run(name, ctx = {}) {
    return this.runCommand(name, ctx);
  }

  async runCommand(name, ctx = {}) {
    const command = this.get(name);
    if (!command) throw new CommandError(`Unknown command: ${name}`);
    try {
      return await command.run({ ...ctx, command, api: this.api }, this.api);
    } catch (error) {
      throw new CommandError(`Command ${command.name} failed`, error.message);
    }
  }

  async shutdown() {
    this.clear();
    await super.shutdown();
  }
}

module.exports = CommandManager;
module.exports.CommandManager = CommandManager;
module.exports.default = CommandManager;
