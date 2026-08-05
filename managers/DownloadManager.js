'use strict';

const BaseManager = require('./BaseManager');

class DownloadManager extends BaseManager {
  constructor(api) {
    super(api, 'DownloadManager');
  }
}

module.exports = DownloadManager;
module.exports.DownloadManager = DownloadManager;
module.exports.default = DownloadManager;
