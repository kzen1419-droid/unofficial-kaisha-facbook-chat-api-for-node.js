'use strict';

const BaseManager = require('./BaseManager');
const { cloneDeep } = require('../utils/internal');
const { ValidationError } = require('../config/errors');

class LoginManager extends BaseManager {
  constructor(api) {
    super(api, 'LoginManager');
    this._authenticated = false;
    this._credentials = null;
  }

  async authenticate(credentials = null) {
    const session = this.api?.sessionManager?.getAppState?.();
    const source = credentials || session;

    if (!source || (typeof source !== 'object' && !Array.isArray(source))) {
      throw new ValidationError('Session data or credentials are required before authentication');
    }

    this._credentials = cloneDeep(source);
    this._authenticated = true;
    this._ready = true;
    this.emit('authenticated', this._credentials);
    return {
      ok: true,
      authenticatedAt: new Date().toISOString()
    };
  }

  isAuthenticated() {
    return this._authenticated;
  }

  getCredentials() {
    return this._credentials ? cloneDeep(this._credentials) : null;
  }

  async shutdown() {
    this._authenticated = false;
    this._credentials = null;
    await super.shutdown();
  }
}

module.exports = LoginManager;
module.exports.LoginManager = LoginManager;
module.exports.default = LoginManager;
