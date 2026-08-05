'use strict';
const path = require('path');
const BaseManager = require('./BaseManager');
const { SecurityError } = require('../config/errors');

class SecurityManager extends BaseManager {
  constructor(api) {
    super(api, 'SecurityManager');
  }

  sanitizeText(input) {
    return String(input ?? '').replace(/[\u0000-\u001f\u007f]/g, '').trim();
  }

  redactSecrets(value) {
    const sensitiveKeys = /token|cookie|secret|password|session/i;
    const walk = (input) => {
      if (!input || typeof input !== 'object') return input;
      if (Array.isArray(input)) return input.map(walk);
      const output = {};
      for (const [key, item] of Object.entries(input)) {
        output[key] = sensitiveKeys.test(key) ? '[REDACTED]' : walk(item);
      }
      return output;
    };
    return walk(value);
  }

  safeJoin(baseDir, targetPath) {
    const resolvedBase = path.resolve(baseDir);
    const resolvedTarget = path.resolve(resolvedBase, String(targetPath || ''));
    if (!resolvedTarget.startsWith(resolvedBase + path.sep) && resolvedTarget !== resolvedBase) {
      throw new SecurityError('Path traversal blocked', { baseDir, targetPath });
    }
    return resolvedTarget;
  }

  assertSafePath(baseDir, targetPath) {
    return this.safeJoin(baseDir, targetPath);
  }

  isSafeUrl(value) {
    try {
      const url = new URL(String(value));
      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  }
}

module.exports = SecurityManager;
