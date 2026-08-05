'use strict';

/** Middleware: enforce cooldowns */
module.exports = async (ctx, next) => {
  const command = ctx.command;
  if (!command) return next();
  const manager = ctx.api?.cooldownManager;
  if (manager && typeof manager.check === 'function' && !manager.check(command, ctx)) {
    const remaining = Math.ceil((manager.remaining(command, ctx.senderId) || 0) / 1000);
    return ctx.api?.messageManager?.sendText?.(ctx.threadId, `⏳ Cooldown: ${remaining}s`);
  }
  return next();
};
