'use strict';

const BaseManager = require('./BaseManager');

class UploadManager extends BaseManager {
  constructor(api) {
    super(api, 'UploadManager');
  }
}

module.exports = UploadManager;
module.exports.UploadManager = UploadManager;
module.exports.default = UploadManager;
