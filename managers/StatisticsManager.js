'use strict';

const BaseManager = require('./BaseManager');

class StatisticsManager extends BaseManager {
  constructor(api) {
    super(api, 'StatisticsManager');
  }
}

module.exports = StatisticsManager;
module.exports.StatisticsManager = StatisticsManager;
module.exports.default = StatisticsManager;
