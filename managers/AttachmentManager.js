'use strict';

const BaseManager = require('./BaseManager');

class AttachmentManager extends BaseManager {
  constructor(api) {
    super(api, 'AttachmentManager');
  }
}

module.exports = AttachmentManager;
module.exports.AttachmentManager = AttachmentManager;
module.exports.default = AttachmentManager;
