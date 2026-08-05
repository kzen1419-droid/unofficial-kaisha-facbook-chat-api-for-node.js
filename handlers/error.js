'use strict';

module.exports = async function handleError(error, ctx, api) {
  const message = error?.message || String(error);
  api?.logger?.error?.(message, { module: 'handler:error', error });
  api?.metrics?.counter?.('errors.total', 1);

  if (ctx?.threadId) {
    try {
      await api?.sendText?.(ctx.threadId, `⚠️ ${message}`);
    } catch (sendError) {
      api?.logger?.warn?.('Failed to send error response', { module: 'handler:error', error: sendError });
    }
  }
};
