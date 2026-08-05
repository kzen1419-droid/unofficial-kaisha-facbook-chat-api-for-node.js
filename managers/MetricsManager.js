'use strict';

const BaseManager = require('./BaseManager');

class MetricsManager extends BaseManager {
  constructor(api) {
    super(api, 'MetricsManager');
    this._counters = new Map();
    this._timings = new Map();
    this._gauges = new Map();
  }

  counter(name, value = 1) {
    const key = String(name || 'metric');
    const next = (this._counters.get(key) || 0) + Number(value || 0);
    this._counters.set(key, next);
    return next;
  }

  increment(name, value = 1) {
    return this.counter(name, value);
  }

  gauge(name, value) {
    const key = String(name || 'gauge');
    this._gauges.set(key, Number(value));
    return Number(value);
  }

  startTimer(name) {
    const key = String(name || 'timer');
    const startedAt = process.hrtime.bigint();
    this._timings.set(key, startedAt);
    return {
      end: () => {
        const endAt = process.hrtime.bigint();
        const ms = Number(endAt - startedAt) / 1e6;
        this._timings.delete(key);
        this.counter(key, ms);
        return ms;
      }
    };
  }

  snapshot() {
    return {
      counters: Object.fromEntries(this._counters.entries()),
      gauges: Object.fromEntries(this._gauges.entries()),
      activeTimers: this._timings.size
    };
  }

  reset() {
    this._counters.clear();
    this._timings.clear();
    this._gauges.clear();
  }

  async shutdown() {
    this.reset();
    await super.shutdown();
  }
}

module.exports = MetricsManager;
module.exports.MetricsManager = MetricsManager;
module.exports.default = MetricsManager;
