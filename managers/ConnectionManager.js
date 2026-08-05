'use strict';

const BaseManager = require('./BaseManager');

class ConnectionManager extends BaseManager {
  constructor(api) {
    super(api, 'ConnectionManager');
    this._connected = false;
    this._details = null;
  }

  async connect(details = {}) {
    this._connected = true;
    this._details = { ...details, connectedAt: new Date().toISOString() };
    this._ready = true;
    this.emit('connected', this._details);
    return this.getDetails();
  }

  async disconnect(reason = 'shutdown') {
    this._connected = false;
    this._details = { ...(this._details || {}), disconnectedAt: new Date().toISOString(), reason };
    this._ready = false;
    this.emit('disconnected', this._details);
    return this.getDetails();
  }

  async shutdown() {
    if (this._connected) await this.disconnect('shutdown');
    await super.shutdown();
  }

  isConnected() {
    return this._connected;
  }

  getDetails() {
    return this._details ? { ...this._details } : null;
  }
}

module.exports = ConnectionManager;
module.exports.ConnectionManager = ConnectionManager;
module.exports.default = ConnectionManager;
