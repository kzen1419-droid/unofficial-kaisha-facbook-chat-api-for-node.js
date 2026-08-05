'use strict';

const BaseManager = require('./BaseManager');

class UpdateManager extends BaseManager {
  constructor(api) {
    super(api, 'UpdateManager');
  }
}

module.exports = UpdateManager;
module.exports.UpdateManager = UpdateManager;
module.exports.default = UpdateManager;
