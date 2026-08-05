'use strict';

const BaseManager = require('./BaseManager');
const EVENTS = require('../events');
const { ValidationError } = require('../config/errors');

function cloneDefinition(definition) {
  return {
    ...definition,
    schema: Array.isArray(definition.schema) ? definition.schema.slice() : definition.schema
  };
}

class EventManager extends BaseManager {
  constructor(api) {
    super(api, 'EventManager');
    this._events = new Map();
  }

  async start() {
    for (const definition of Object.values(EVENTS)) {
      if (definition && typeof definition === 'object' && definition.name) {
        this.register(definition.name, definition);
      }
    }
    this._ready = true;
    return this;
  }

  async stop() {
    this._events.clear();
    this._ready = false;
  }

  async shutdown() {
    await this.stop();
    await super.shutdown();
  }

  register(name, definition) {
    if (!name) throw new ValidationError('Event name is required');
    if (!definition || typeof definition !== 'object') throw new ValidationError(`Invalid event definition: ${name}`);
    if (definition.handler && typeof definition.handler !== 'function') {
      throw new ValidationError(`Event handler must be a function: ${name}`);
    }

    const record = cloneDefinition(definition);
    this._events.set(String(name), record);
    return this.get(name);
  }

  unregister(name) {
    return this._events.delete(String(name));
  }

  clear() {
    this._events.clear();
  }

  async emitEvent(name, payload) {
    const definition = this._events.get(String(name));
    if (!definition) return false;

    try {
      if (typeof definition.handler === 'function') {
        await definition.handler(payload, this.api);
      }
    } catch (error) {
      this._log('warn', `event handler failed: ${name}`, { error });
      throw error;
    }

    await this.api?.pluginManager?.dispatch?.(name, payload);
    return true;
  }

  get(name) {
    const definition = this._events.get(String(name));
    return definition ? cloneDefinition(definition) : null;
  }

  list() {
    return [...this._events.keys()];
  }
}

module.exports = EventManager;
module.exports.EventManager = EventManager;
module.exports.default = EventManager;
