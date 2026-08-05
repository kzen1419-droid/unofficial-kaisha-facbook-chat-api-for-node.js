'use strict';

const BaseManager = require('./BaseManager');

class UtilityManager extends BaseManager {
  constructor(api) {
    super(api, 'UtilityManager');
  }
}

module.exports = UtilityManager;
module.exports.UtilityManager = UtilityManager;
module.exports.default = UtilityManager;
