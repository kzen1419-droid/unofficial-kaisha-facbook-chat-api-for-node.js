'use strict';

const BaseManager = require('./BaseManager');

class FileManager extends BaseManager {
  constructor(api) {
    super(api, 'FileManager');
  }
}

module.exports = FileManager;
module.exports.FileManager = FileManager;
module.exports.default = FileManager;
