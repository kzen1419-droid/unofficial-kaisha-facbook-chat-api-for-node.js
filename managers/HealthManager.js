'use strict';

const BaseManager = require('./BaseManager');

class HealthManager extends BaseManager {
  constructor(api) {
    super(api, 'HealthManager');
    this._services = new Map();
  }

  markHealthy(name, details = {}) {
    const key = String(name || 'service');
    this._services.set(key, {
      ok: true,
      updatedAt: new Date().toISOString(),
      details
    });
    return this.status(key);
  }

  markUnhealthy(name, reason = 'unknown') {
    const key = String(name || 'service');
    this._services.set(key, {
      ok: false,
      updatedAt: new Date().toISOString(),
      reason
    });
    return this.status(key);
  }

  status(name = 'core') {
    return this._services.get(String(name)) || {
      ok: this.isReady(),
      updatedAt: new Date().toISOString()
    };
  }

  report() {
    return {
      ok: [...this._services.values()].every(entry => entry.ok !== false),
      services: Object.fromEntries(this._services.entries())
    };
  }

  reset() {
    this._services.clear();
  }

  async shutdown() {
    this.reset();
    await super.shutdown();
  }
}

module.exports = HealthManager;
module.exports.HealthManager = HealthManager;
module.exports.default = HealthManager;
