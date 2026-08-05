'use strict';

const BaseManager = require('./BaseManager');
const { cloneDeep, toFiniteNumber } = require('../utils/internal');

function now() {
  return Date.now();
}

class CacheManager extends BaseManager {
  constructor(api) {
    super(api, 'CacheManager');
    this._cache = new Map();
    this._cleanupTimer = null;
    this._ttlMs = Math.max(0, toFiniteNumber(api?.options?.cache?.ttlMs, 300000));
    this._maxEntries = Math.max(1, toFiniteNumber(api?.options?.cache?.maxEntries, 5000));
  }

  async init() {
    this._setupCleanupTimer();
    this._ready = true;
    return this;
  }

  _setupCleanupTimer() {
    if (this._cleanupTimer) clearInterval(this._cleanupTimer);
    const interval = Math.max(10_000, Math.min(this._ttlMs || 60_000, 60_000));
    this._cleanupTimer = setInterval(() => this.cleanup(), interval);
    this._cleanupTimer.unref?.();
    this.registerCleanup(() => {
      if (this._cleanupTimer) clearInterval(this._cleanupTimer);
      this._cleanupTimer = null;
    });
  }

  set(key, value, ttlMs = this._ttlMs) {
    const expiresAt = Number(ttlMs) > 0 ? now() + Number(ttlMs) : null;
    if (this._cache.size >= this._maxEntries) this.cleanup(true);
    this._cache.set(String(key), {
      value: cloneDeep(value),
      expiresAt
    });
    return value;
  }

  get(key, fallback = undefined) {
    const entry = this._cache.get(String(key));
    if (!entry) return fallback;
    if (entry.expiresAt && entry.expiresAt <= now()) {
      this._cache.delete(String(key));
      return fallback;
    }
    return cloneDeep(entry.value);
  }

  has(key) {
    return this.get(key, undefined) !== undefined;
  }

  delete(key) {
    return this._cache.delete(String(key));
  }

  del(key) {
    return this.delete(key);
  }

  clear() {
    this._cache.clear();
  }

  cleanup(force = false) {
    const current = now();
    for (const [key, entry] of this._cache.entries()) {
      if (force || (entry.expiresAt && entry.expiresAt <= current)) {
        this._cache.delete(key);
      }
    }
    return this._cache.size;
  }

  getState() {
    return {
      size: this._cache.size,
      ttlMs: this._ttlMs,
      maxEntries: this._maxEntries
    };
  }

  async shutdown() {
    this.clear();
    await super.shutdown();
  }
}

module.exports = CacheManager;
module.exports.CacheManager = CacheManager;
module.exports.default = CacheManager;
