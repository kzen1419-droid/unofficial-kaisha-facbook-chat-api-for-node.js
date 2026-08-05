'use strict';
const BaseManager = require('./BaseManager');
const { ValidationError } = require('../config/errors');

function fail(message, details) {
  throw new ValidationError(message, details);
}

class ValidationManager extends BaseManager {
  constructor(api) {
    super(api, 'ValidationManager');
  }

  validateString(value, name = 'value', { allowEmpty = false, maxLength = 10_000 } = {}) {
    if (typeof value !== 'string') fail(`${name} must be a string`);
    const trimmed = value.trim();
    if (!allowEmpty && !trimmed) fail(`${name} cannot be empty`);
    if (trimmed.length > maxLength) fail(`${name} exceeds maximum length`);
    return trimmed;
  }

  validateObject(value, name = 'value') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${name} must be an object`);
    return value;
  }

  validateBoolean(value, name = 'value') {
    if (typeof value !== 'boolean') fail(`${name} must be a boolean`);
    return value;
  }

  validateUrl(value, name = 'url') {
    this.validateString(value, name);
    try {
      return new URL(value).toString();
    } catch {
      fail(`${name} must be a valid URL`);
    }
  }

  validateId(value, name = 'id') {
    this.validateString(String(value ?? ''), name);
    if (!/^[A-Za-z0-9._:-]+$/.test(String(value))) fail(`${name} contains invalid characters`);
    return String(value);
  }

  validateJson(value, name = 'json') {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        fail(`${name} must be valid JSON`);
      }
    }
    if (!value || typeof value !== 'object') fail(`${name} must be an object or JSON string`);
    return value;
  }

  validateOptions(value, name = 'options') {
    return this.validateObject(value, name);
  }

  validateAttachment(value, name = 'attachment') {
    const attachment = this.validateObject(value, name);
    if (!attachment.url && !attachment.path && !attachment.buffer) {
      fail(`${name} must include url, path, or buffer`);
    }
    return attachment;
  }
}

module.exports = ValidationManager;
