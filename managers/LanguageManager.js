'use strict';

const BaseManager = require('./BaseManager');

class LanguageManager extends BaseManager {
  constructor(api) {
    super(api, 'LanguageManager');
  }
}

module.exports = LanguageManager;
module.exports.LanguageManager = LanguageManager;
module.exports.default = LanguageManager;
