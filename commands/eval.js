'use strict';

const vm = require('vm');
const util = require('util');
const { ValidationError } = require('../config/errors');

function createSandbox(ctx, api) {
  return vm.createContext({
    ctx,
    api,
    console: {
      log: () => {},
      error: () => {},
      warn: () => {}
    },
    Math,
    JSON,
    Date,
    Promise,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval
  });
}

module.exports = {
  name: 'eval',
  aliases: ['e', 'exec'],
  category: 'dev',
  description: 'Owner-only JavaScript evaluation',
  permissions: ['OWNER'],
  cooldown: 0,
  async run(ctx, api) {
    const source = Array.isArray(ctx.args) ? ctx.args.join(' ') : String(ctx.code || '');
    if (!source.trim()) throw new ValidationError('No code provided');
    try {
      const script = new vm.Script(source, { timeout: 1000, displayErrors: true });
      const result = await script.runInContext(createSandbox(ctx, api), { timeout: 1000 });
      return api.messageManager?.sendText?.(ctx.threadId, '✅ ' + util.inspect(result, { depth: 1 }));
    } catch (error) {
      return api.messageManager?.sendText?.(ctx.threadId, '❌ ' + error.message);
    }
  }
};
