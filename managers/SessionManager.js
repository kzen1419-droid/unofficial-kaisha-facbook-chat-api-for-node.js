'use strict';

const fs = require('fs/promises');
const path = require('path');
const BaseManager = require('./BaseManager');
const { cloneDeep } = require('../utils/internal');
const { ValidationError, ConfigurationError } = require('../config/errors');

class SessionManager extends BaseManager {
  constructor(api) {
    super(api, 'SessionManager');
    this._appState = null;
    this._sessionPath = path.resolve(api?.options?.sessionPath || path.join(__dirname, '..', 'database', 'session.json'));
  }

  async load(appState) {
    if (typeof appState === 'string') {
      const file = path.resolve(appState);
      try {
        const raw = await fs.readFile(file, 'utf8');
        this._appState = JSON.parse(raw);
        this._sessionPath = file;
        return this.getAppState();
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new ConfigurationError(`Invalid session JSON: ${file}`, error.message);
        }
        throw new ConfigurationError(`Failed to load session file: ${file}`, error.message);
      }
    }

    if (Array.isArray(appState) || (appState && typeof appState === 'object')) {
      this._appState = cloneDeep(appState);
      return this.getAppState();
    }

    throw new ValidationError('appState must be an object, array, or file path');
  }

  async save(filePath = this._sessionPath) {
    if (!this._appState) throw new ValidationError('No session data available to save');
    const target = path.resolve(filePath);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, JSON.stringify(this._appState, null, 2));
    this._sessionPath = target;
    return target;
  }

  async restore(filePath = this._sessionPath) {
    const target = path.resolve(filePath);
    try {
      const raw = await fs.readFile(target, 'utf8');
      this._appState = JSON.parse(raw);
      this._sessionPath = target;
      return this.getAppState();
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new ConfigurationError(`Invalid session JSON: ${target}`, error.message);
      }
      throw new ConfigurationError(`Failed to restore session: ${target}`, error.message);
    }
  }

  getAppState() {
    return this._appState ? cloneDeep(this._appState) : null;
  }

  async shutdown() {
    this._appState = this.getAppState();
    await super.shutdown();
  }
}

module.exports = SessionManager;
module.exports.SessionManager = SessionManager;
module.exports.default = SessionManager;
