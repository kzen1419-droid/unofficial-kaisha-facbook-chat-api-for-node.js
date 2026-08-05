'use strict';

const BaseManager = require('./BaseManager');

class EncryptionManager extends BaseManager {
  constructor(api) {
    super(api, 'EncryptionManager');
  }
}

module.exports = EncryptionManager;
module.exports.EncryptionManager = EncryptionManager;
module.exports.default = EncryptionManager;
