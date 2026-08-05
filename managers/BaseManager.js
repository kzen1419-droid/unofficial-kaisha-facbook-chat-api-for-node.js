'use strict';

const { EventEmitter } = require('events');
const { cloneDeep } = require('../utils/internal');
const { ManagerError } = require('../config/errors');

class BaseManager extends EventEmitter {
  constructor(api, name) {
    super();
    this.api = api || null;
    this.name = name || this.constructor.name;
    this.options = api?.options || {};
    this.logger = api?.loggerManager || api?.logger || null;
    this._ready = false;
    this._state = Object.create(null);
    this._cleanup = [];
    this._metrics = api?.metricsManager || api?.metrics || null;
  }

  /**
   * Initialize the manager.
   * @returns {Promise<this>}
   */
  async init() {
    this._ready = true;
    this.emit('ready', this);
    return this;
  }

  /**
   * Register a cleanup callback to run during shutdown.
   * @param {Function} fn
   * @returns {this}
   */
  registerCleanup(fn) {
    if (typeof fn === 'function') this._cleanup.push(fn);
    return this;
  }

  /**
   * Resolve a dependent manager by property name.
   * @param {string} property
   * @returns {*}
   */
  requireManager(property) {
    const manager = this.api?.[property];
    if (!manager) {
      throw new ManagerError(`Missing required manager: ${property}`, { manager: this.name });
    }
    return manager;
  }

  /**
   * Log through the centralized logger when available.
   * @param {'debug'|'info'|'warn'|'error'|'fatal'} level
   * @param {string} message
   * @param {object} meta
   */
  _log(level, message, meta = {}) {
    const logger = this.api?.loggerManager || this.api?.logger || this.logger;
    const fn = logger && typeof logger[level] === 'function' ? logger[level] : logger?.info;
    if (typeof fn === 'function') {
      fn.call(logger, message, { module: this.name, ...meta });
      return;
    }

    const line = `[${level.toUpperCase()}] ${this.name}: ${message}`;
    if (level === 'error' || level === 'fatal') {
      process.stderr.write(line + '\n');
    } else {
      process.stdout.write(line + '\n');
    }
  }

  /**
   * Shut down the manager and run registered cleanup callbacks.
   * @returns {Promise<void>}
   */
  async shutdown() {
    while (this._cleanup.length) {
      const fn = this._cleanup.pop();
      try {
        await Promise.resolve(fn());
      } catch (error) {
        this._log('warn', `cleanup failed in ${this.name}`, {
          error: error?.message || String(error)
        });
      }
    }

    this._ready = false;
    this.removeAllListeners();
  }

  /**
   * Check whether the manager is ready.
   * @returns {boolean}
   */
  isReady() {
    return this._ready;
  }

  /**
   * Update internal state.
   * @param {object} patch
   * @returns {object}
   */
  setState(patch) {
    if (!patch || typeof patch !== 'object') return this.getState();
    Object.assign(this._state, cloneDeep(patch));
    return this.getState();
  }

  /**
   * Read internal state.
   * @returns {object}
   */
  getState() {
    return cloneDeep(this._state);
  }

  /**
   * Basic health snapshot.
   * @returns {{name:string, ready:boolean}}
   */
  health() {
    return { name: this.name, ready: this._ready };
  }
}

module.exports = BaseManager;
module.exports.clone = cloneDeep;
