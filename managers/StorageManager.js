'use strict';

const BaseManager = require('./BaseManager');

class StorageManager extends BaseManager {
  constructor(api) {
    super(api, 'StorageManager');
  }
}

module.exports = StorageManager;
module.exports.StorageManager = StorageManager;
module.exports.default = StorageManager;
