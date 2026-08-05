'use strict';

const BaseManager = require('./BaseManager');

class RecoveryManager extends BaseManager {
  constructor(api) {
    super(api, 'RecoveryManager');
  }
}

module.exports = RecoveryManager;
module.exports.RecoveryManager = RecoveryManager;
module.exports.default = RecoveryManager;
