'use strict';
/** Middleware: log every incoming command execution */
module.exports = async (ctx, next) => {
  ctx.api?.logger?.info?.(`[CMD] ${ctx.senderId} @ ${ctx.threadId}: ${ctx.command?.name} ${ctx.args?.join(' ')||''}`);
  ctx.api?.metrics?.counter?.('commands.total');
  return next();
};
