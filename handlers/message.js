'use strict';

/**
 * Primary message handler — dispatches to commands, middleware, and plugins.
 * @param {object} ctx
 * @param {import('../index')} api
 */
module.exports = async function handleMessage(ctx, api) {
  const helpers = require('../helpers');
  const middleware = require('../middleware');

  const context = ctx && typeof ctx === 'object' ? ctx : {};
  context.api = api;
  context.text = String(context.text ?? '');

  const command = helpers.parseCommand(context.text, api.options?.prefix || '/');
  if (command) {
    context.command = api.getCommand(command.name);
    context.args = command.args;
    context.rawArgs = command.raw;

    if (context.command) {
      const chain = Array.isArray(middleware.CHAIN)
        ? middleware.CHAIN.map(name => middleware[name]).filter(fn => typeof fn === 'function')
        : [];

      let index = 0;
      const next = async () => {
        if (index < chain.length) {
          const step = chain[index++];
          return step(context, next, api);
        }
        return api.runCommand(command.name, context);
      };

      return next();
    }
  }

  await api.pluginManager?.dispatch?.('message', context);
  return api.emit('message', context);
};
