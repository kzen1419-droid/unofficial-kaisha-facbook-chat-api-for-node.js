'use strict';

const BaseManager = require('./BaseManager');

class MemoryManager extends BaseManager {
  constructor(api) {
    super(api, 'MemoryManager');
  }
}

module.exports = MemoryManager;
module.exports.MemoryManager = MemoryManager;
module.exports.default = MemoryManager;
