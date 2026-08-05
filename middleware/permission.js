'use strict';

/** Middleware: enforce command permissions before run */
module.exports = async (ctx, next) => {
  const command = ctx.command;
  if (!command) return next();
  const manager = ctx.api?.permissionManager;
  if (manager && typeof manager.check === 'function' && !manager.check(command, ctx)) {
    return ctx.api?.messageManager?.sendText?.(ctx.threadId, '⛔ Permission denied.');
  }
  return next();
};
