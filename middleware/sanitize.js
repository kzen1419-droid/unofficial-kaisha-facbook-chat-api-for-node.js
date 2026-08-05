'use strict';

/** Middleware: sanitize message text before processing */
module.exports = async (ctx, next) => {
  if (ctx.text) ctx.text = require('../helpers').sanitizeInput(ctx.text);
  return next();
};
