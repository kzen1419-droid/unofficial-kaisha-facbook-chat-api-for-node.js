'use strict';

const fs = require('fs/promises');
const path = require('path');
const BaseManager = require('./BaseManager');
const { ValidationError } = require('../config/errors');
const { cloneDeep } = require('../utils/internal');

function safeLabel(label) {
  return String(label || 'manual').replace(/[^a-z0-9._-]/gi, '_');
}

class BackupManager extends BaseManager {
  constructor(api) {
    super(api, 'BackupManager');
    this._dir = path.resolve(api?.options?.backupDir || path.join(__dirname, '..', 'temp', 'backups'));
  }

  async create(label = 'manual', data = null) {
    await fs.mkdir(this._dir, { recursive: true });
    const file = path.join(this._dir, `${Date.now()}-${safeLabel(label)}.json`);
    await fs.writeFile(file, JSON.stringify({
      label: String(label || 'manual'),
      timestamp: new Date().toISOString(),
      data: cloneDeep(data)
    }, null, 2));
    return file;
  }

  async list() {
    try {
      const entries = await fs.readdir(this._dir, { withFileTypes: true });
      return entries.filter(entry => entry.isFile() && entry.name.endsWith('.json')).map(entry => entry.name).sort();
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw new ValidationError(`Unable to list backups: ${this._dir}`, error.message);
    }
  }

  async shutdown() {
    await super.shutdown();
  }
}

module.exports = BackupManager;
module.exports.BackupManager = BackupManager;
module.exports.default = BackupManager;
