'use strict';

const BaseManager = require('./BaseManager');

class QueueManager extends BaseManager {
  constructor(api) {
    super(api, 'QueueManager');
  }
}

module.exports = QueueManager;
module.exports.QueueManager = QueueManager;
module.exports.default = QueueManager;
