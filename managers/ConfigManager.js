'use strict';

const fs = require('fs');
const path = require('path');
const BaseManager = require('./BaseManager');
const { deepMerge, isPlainObject, safeGet, safeSet, cloneDeep } = require('../utils/internal');
const { ConfigurationError, ValidationError } = require('../config/errors');

function parseEnvValue(value) {
  const trimmed = String(value ?? '').trim();
  if (trimmed === '') return '';
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);

  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
}

class ConfigManager extends BaseManager {
  constructor(apiOrOptions = {}) {
    const api = apiOrOptions && apiOrOptions.api ? apiOrOptions.api : apiOrOptions;
    super(api, 'ConfigManager');

    const baseDir = apiOrOptions?.configDir || path.join(__dirname);
    this.rootDir = apiOrOptions?.rootDir || path.join(__dirname, '..');
    this.configPath = apiOrOptions?.configPath || path.join(baseDir, 'default.json');
    this._config = {};
    this._loaded = false;
  }

  async init() {
    this.reload();
    this._ready = true;
    this.emit('ready', this.getAll());
    return this;
  }

  _load() {
    return this.reload();
  }

  reload() {
    let parsed;
    try {
      const raw = fs.readFileSync(this.configPath, 'utf8');
      parsed = raw ? JSON.parse(raw) : {};
    } catch (error) {
      throw new ConfigurationError(`Failed to load config: ${this.configPath}`, error.message);
    }

    if (!isPlainObject(parsed)) {
      throw new ConfigurationError(`Config file must contain a JSON object: ${this.configPath}`);
    }

    const envConfig = {};
    for (const [key, value] of Object.entries(process.env)) {
      if (!key.startsWith('KAISHA_')) continue;
      const pathKey = key
        .slice(8)
        .toLowerCase()
        .replace(/__/g, '.')
        .replace(/_/g, '.');
      try {
        safeSet(envConfig, pathKey, parseEnvValue(value));
      } catch (error) {
        throw new ConfigurationError(`Invalid environment override: ${key}`, error.message);
      }
    }

    this._config = deepMerge(deepMerge({}, parsed), envConfig);
    this._loaded = true;
    return this.getAll();
  }

  get(pathExpression, fallback) {
    return safeGet(this._config, pathExpression, fallback);
  }

  set(pathExpression, value) {
    try {
      safeSet(this._config, pathExpression, value);
      return this.get(pathExpression);
    } catch (error) {
      throw new ValidationError(`Invalid config path: ${pathExpression}`, error.message);
    }
  }

  merge(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new ValidationError('Config merge requires an object');
    }

    deepMerge(this._config, value);
    return this.getAll();
  }

  getAll() {
    return cloneDeep(this._config);
  }

  save(filePath = this.configPath) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(this._config, null, 2));
    return filePath;
  }
}

module.exports = ConfigManager;
module.exports.ConfigManager = ConfigManager;
module.exports.default = ConfigManager;
