'use strict';

const utils = require('../utils');

module.exports = {
  name: 'ping',
  aliases: ['pong', 'latency'],
  category: 'utility',
  description: 'Check bot latency and uptime',
  cooldown: 1000,
  async run(ctx, api) {
    const startedAt = Date.now();
    const uptime = utils.formatDuration(api.getUptime ? api.getUptime() : 0);
    await api.messageManager?.sendText?.(ctx.threadId, 'Pinging...');
    const latency = Date.now() - startedAt;
    return api.messageManager?.sendText?.(ctx.threadId, `🏓 Pong! Latency: ${latency}ms | Uptime: ${uptime}`);
  }
};
