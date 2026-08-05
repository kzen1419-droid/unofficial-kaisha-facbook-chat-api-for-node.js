'use strict';

const BaseManager = require('./BaseManager');

class PermissionManager extends BaseManager {
  constructor(api) {
    super(api, 'PermissionManager');
    this._ownerIds = new Set((api?.options?.ownerIds || []).map(String));
  }

  check(command, ctx = {}) {
    const required = Array.isArray(command?.permissions) ? command.permissions : [];
    if (!required.length) return true;

    const senderId = String(ctx.senderId || ctx.userId || '');
    if (this._ownerIds.has(senderId)) return true;

    const granted = new Set([
      ...(Array.isArray(ctx.permissions) ? ctx.permissions : []),
      ...(ctx.role ? [ctx.role] : []),
      ...(ctx.memberRoles ? Array.from(ctx.memberRoles) : [])
    ].map(value => String(value).toUpperCase()));

    for (const permission of required) {
      const normalized = String(permission).toUpperCase();
      if (normalized === 'OWNER') {
        if (!this._ownerIds.has(senderId)) return false;
        continue;
      }
      if (normalized === 'ADMIN') {
        if (ctx.isAdmin !== true && ctx.role !== 'admin' && ctx.memberRole !== 'admin') return false;
        continue;
      }
      if (!granted.has(normalized)) return false;
    }

    return true;
  }
}

module.exports = PermissionManager;
module.exports.PermissionManager = PermissionManager;
module.exports.default = PermissionManager;
