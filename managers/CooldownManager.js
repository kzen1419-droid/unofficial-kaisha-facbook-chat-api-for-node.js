'use strict';

const BaseManager = require('./BaseManager');

class CooldownManager extends BaseManager {
  constructor(api) {
    super(api, 'CooldownManager');
    this._entries = new Map();
    this._defaultCooldownMs = Number(api?.options?.cooldown?.defaultMs || 1000);
  }

  _key(command, senderId) {
    return `${String(command?.name || command)}:${String(senderId || 'unknown')}`;
  }

  check(command, ctx = {}) {
    const cooldownMs = Number(command?.cooldown || this._defaultCooldownMs || 0);
    if (!cooldownMs) return true;

    const key = this._key(command, ctx.senderId);
    const entry = this._entries.get(key);
    const now = Date.now();
    if (entry && entry.expiresAt > now) return false;

    this._entries.set(key, { expiresAt: now + cooldownMs });
    return true;
  }

  remaining(command, senderId) {
    const key = this._key(command, senderId);
    const entry = this._entries.get(key);
    return entry ? Math.max(0, entry.expiresAt - Date.now()) : 0;
  }

  clear(command, senderId) {
    return this._entries.delete(this._key(command, senderId));
  }

  reset() {
    this._entries.clear();
  }

  async shutdown() {
    this.reset();
    await super.shutdown();
  }
}

module.exports = CooldownManager;
module.exports.CooldownManager = CooldownManager;
module.exports.default = CooldownManager;
