'use strict';

/**
 * Shared error hierarchy.
 * @module config/errors
 */

class KaishaError extends Error {
  constructor(message, code = 'KAISHA_ERROR', details) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    if (details !== undefined) this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details
    };
  }
}

class ValidationError extends KaishaError {
  constructor(message = 'Invalid input', details) {
    super(message, 'VALIDATION_ERROR', details);
  }
}

class ConfigurationError extends KaishaError {
  constructor(message = 'Invalid configuration', details) {
    super(message, 'CONFIG_ERROR', details);
  }
}

class NotFoundError extends KaishaError {
  constructor(message = 'Resource not found', details) {
    super(message, 'NOT_FOUND', details);
  }
}

class SecurityError extends KaishaError {
  constructor(message = 'Security policy rejected the operation', details) {
    super(message, 'SECURITY_ERROR', details);
  }
}

class PluginError extends KaishaError {
  constructor(message = 'Plugin failure', details) {
    super(message, 'PLUGIN_ERROR', details);
  }
}

class CommandError extends KaishaError {
  constructor(message = 'Command failure', details) {
    super(message, 'COMMAND_ERROR', details);
  }
}

class ManagerError extends KaishaError {
  constructor(message = 'Manager failure', details) {
    super(message, 'MANAGER_ERROR', details);
  }
}

module.exports = {
  KaishaError,
  ValidationError,
  ConfigurationError,
  NotFoundError,
  SecurityError,
  PluginError,
  CommandError,
  ManagerError
};
