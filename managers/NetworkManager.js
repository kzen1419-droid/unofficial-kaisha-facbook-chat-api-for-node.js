'use strict';

const BaseManager = require('./BaseManager');

class NetworkManager extends BaseManager {
  constructor(api) {
    super(api, 'NetworkManager');
  }
}

module.exports = NetworkManager;
module.exports.NetworkManager = NetworkManager;
module.exports.default = NetworkManager;
