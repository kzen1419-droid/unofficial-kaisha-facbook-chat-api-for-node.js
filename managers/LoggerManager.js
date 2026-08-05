'use strict';

const BaseManager = require('./BaseManager');
const { cloneDeep } = require('../utils/internal');
const { ValidationError } = require('../config/errors');

const LEVELS = Object.freeze({ debug: 10, info: 20, warn: 30, error: 40, fatal: 50 });

function serializeMeta(meta) {
  const safe = {};

  for (const [key, value] of Object.entries(meta || {})) {
    if (value === undefined || typeof value === 'function') continue;

    if (value instanceof Error) {
      safe[key] = {
        name: value.name,
        message: value.message,
        code: value.code,
        stack: value.stack
      };
      continue;
    }

    safe[key] = cloneDeep(value);
  }

  return safe;
}

class LoggerManager extends BaseManager {
  constructor(api) {
    super(api, 'LoggerManager');
    this._level = String(api?.options?.logger?.level || 'info').toLowerCase();
    this._buffer = [];
    this._maxBuffer = Number(api?.options?.logger?.maxBuffer || 1000);
  }

  async init() {
    this.setLevel(this._level);
    this._ready = true;
    this.emit('ready', this);
    return this;
  }

  setLevel(level) {
    const normalized = String(level || '').toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(LEVELS, normalized)) {
      throw new ValidationError(`Unsupported log level: ${level}`);
    }

    this._level = normalized;
    return this._level;
  }

  getLevel() {
    return this._level;
  }

  child(moduleName, requestId) {
    const meta = { module: moduleName, requestId: requestId || null };
    return {
      debug: (message, extra) => this.debug(message, { ...meta, ...extra }),
      info: (message, extra) => this.info(message, { ...meta, ...extra }),
      warn: (message, extra) => this.warn(message, { ...meta, ...extra }),
      error: (message, extra) => this.error(message, { ...meta, ...extra }),
      fatal: (message, extra) => this.fatal(message, { ...meta, ...extra })
    };
  }

  _write(level, message, meta = {}) {
    if (!Object.prototype.hasOwnProperty.call(LEVELS, level)) return;
    if (LEVELS[level] < LEVELS[this._level]) return;

    const entry = {
      timestamp: new Date().toISOString(),
      level,
      module: meta.module || 'core',
      message: typeof message === 'string' ? message : String(message),
      requestId: meta.requestId ?? null,
      ...serializeMeta(meta)
    };

    if (meta.error instanceof Error && !entry.stack) {
      entry.stack = meta.error.stack;
    }

    this._buffer.push(entry);
    if (this._buffer.length > this._maxBuffer) this._buffer.shift();

    const stream = level === 'error' || level === 'fatal' ? process.stderr : process.stdout;
    stream.write(JSON.stringify(entry) + '\n');
  }

  debug(message, meta) { this._write('debug', message, meta); }
  info(message, meta) { this._write('info', message, meta); }
  warn(message, meta) { this._write('warn', message, meta); }
  error(message, meta) { this._write('error', message, meta); }
  fatal(message, meta) { this._write('fatal', message, meta); }

  async flush() {
    return this._buffer.slice();
  }

  getBuffer() {
    return this._buffer.slice();
  }

  clear() {
    this._buffer.length = 0;
  }
}

module.exports = LoggerManager;
module.exports.LoggerManager = LoggerManager;
module.exports.default = LoggerManager;
