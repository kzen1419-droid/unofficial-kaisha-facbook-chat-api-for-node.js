'use strict';

const constants = require('../config/constants');

module.exports = {
  name: 'about',
  aliases: ['info', 'bot'],
  category: 'general',
  description: 'About Kaisha Facebook Chat API',
  async run(ctx, api) {
    return api.messageManager?.sendText?.(ctx.threadId,
      `🤖 ${constants.displayName}\n` +
      `Version: ${constants.version}\n` +
      `Developer: ${constants.developer}\n` +
      `Managers: ${api._managers?.size || 0}\n` +
      `Plugins: ${api._plugins?.size || 0}\n` +
      `Commands: ${api._commands?.size || 0}\n` +
      `Architecture: Modular | Production Ready`);
  }
};
