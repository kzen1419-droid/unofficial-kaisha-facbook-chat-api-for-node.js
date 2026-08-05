'use strict';

const fs = require('fs/promises');
const path = require('path');
const BaseManager = require('./BaseManager');
const { safeGet, safeSet, safeDelete, cloneDeep } = require('../utils/internal');
const { ValidationError, ConfigurationError } = require('../config/errors');

class DatabaseManager extends BaseManager {
  constructor(api) {
    super(api, 'DatabaseManager');
    this._dbPath = path.resolve(api?.options?.database?.path || path.join(__dirname, '..', 'database', 'db.json'));
    this._store = {};
    this._connected = false;
    this._dirty = false;
  }

  async connect() {
    try {
      await fs.mkdir(path.dirname(this._dbPath), { recursive: true });
      try {
        const raw = await fs.readFile(this._dbPath, 'utf8');
        this._store = raw ? JSON.parse(raw) : {};
      } catch (error) {
        if (error.code === 'ENOENT') {
          this._store = {};
          await this._persist();
        } else if (error instanceof SyntaxError) {
          throw new ConfigurationError(`Invalid JSON in database file: ${this._dbPath}`, error.message);
        } else {
          throw error;
        }
      }

      this._connected = true;
      this._dirty = false;
      this._ready = true;
      return this;
    } catch (error) {
      this._connected = false;
      throw new ConfigurationError(`Failed to connect database: ${this._dbPath}`, error.message);
    }
  }

  async _persist() {
    await fs.mkdir(path.dirname(this._dbPath), { recursive: true });
    await fs.writeFile(this._dbPath, JSON.stringify(this._store, null, 2));
    this._dirty = false;
  }

  async disconnect() {
    if (this._dirty || this._connected) {
      await this._persist();
    }
    this._connected = false;
    this._ready = false;
    return this;
  }

  async shutdown() {
    await this.disconnect();
    await super.shutdown();
  }

  isConnected() {
    return this._connected;
  }

  get(key, fallback = undefined) {
    return safeGet(this._store, key, fallback);
  }

  set(key, value) {
    if (!key) throw new ValidationError('Database key is required');
    safeSet(this._store, key, value);
    this._dirty = true;
    return value;
  }

  update(key, updater) {
    if (typeof updater !== 'function') throw new ValidationError('Database update requires a function');
    const current = this.get(key);
    const next = updater(cloneDeep(current));
    this.set(key, next);
    return next;
  }

  delete(key) {
    const result = safeDelete(this._store, key);
    if (result) this._dirty = true;
    return result;
  }

  del(key) {
    return this.delete(key);
  }

  list(key = null) {
    const data = key ? this.get(key, {}) : this._store;
    return cloneDeep(data);
  }

  query(predicate) {
    if (typeof predicate !== 'function') throw new ValidationError('query predicate must be a function');
    const items = [];

    const walk = (node, prefix = '') => {
      if (!node || typeof node !== 'object') return;
      if (Array.isArray(node)) {
        node.forEach((value, index) => walk(value, prefix ? `${prefix}.${index}` : String(index)));
        return;
      }

      for (const [key, value] of Object.entries(node)) {
        const next = prefix ? `${prefix}.${key}` : key;
        if (predicate(value, next, node)) items.push({ key: next, value: cloneDeep(value) });
        walk(value, next);
      }
    };

    walk(this._store);
    return items;
  }

  snapshot() {
    return cloneDeep(this._store);
  }
}

module.exports = DatabaseManager;
module.exports.DatabaseManager = DatabaseManager;
module.exports.default = DatabaseManager;
