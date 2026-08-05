'use strict';

/**
 * Distribution server for one-click ZIP download.
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const { buildProject } = require('./build');
const LoggerManager = require('./managers/LoggerManager');
const constants = require('./config/constants');

const PORT = Number(process.env.PORT || constants.http.port || 3000);
const ZIP_PATH = path.join(__dirname, 'dist', 'kaisha-facebook-chat-api.zip');
const logger = new LoggerManager({ options: { logger: { level: 'info' } } });

async function ensureZip() {
  if (fs.existsSync(ZIP_PATH)) return ZIP_PATH;
  await buildProject();
  if (!fs.existsSync(ZIP_PATH)) {
    throw new Error('Build completed but ZIP file is still missing');
  }
  return ZIP_PATH;
}

function json(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(payload));
}

function serveFile(res, filePath) {
  const stat = fs.statSync(filePath);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="kaisha-facebook-chat-api.zip"');
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  fs.createReadStream(filePath).pipe(res);
}

function createServer() {
  return http.createServer(async (req, res) => {
    const requestId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const log = logger.child('server', requestId);

    try {
      const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

      if (req.method === 'GET' && requestUrl.pathname === '/health') {
        return json(res, 200, {
          ok: true,
          name: constants.name,
          version: constants.version,
          status: 'online',
          zipReady: fs.existsSync(ZIP_PATH),
          uptime: process.uptime(),
          requestId
        });
      }

      if (req.method === 'GET' && requestUrl.pathname === '/info') {
        return json(res, 200, {
          project: constants.displayName,
          version: constants.version,
          developer: constants.developer,
          repository: 'https://github.com/kzen1419-droid/kaisha-facebook-chat-api',
          endpoints: {
            download: '/download',
            rebuild: '/rebuild',
            health: '/health',
            info: '/info'
          },
          requestId
        });
      }

      if (req.method === 'GET' && requestUrl.pathname === '/rebuild') {
        if (fs.existsSync(ZIP_PATH)) fs.unlinkSync(ZIP_PATH);
        await ensureZip();
        return json(res, 200, { ok: true, rebuilt: true, requestId });
      }

      if (req.method === 'GET' && requestUrl.pathname === '/download') {
        const filePath = await ensureZip();
        log.info(`Serving ZIP (${path.basename(filePath)})`, { module: 'server' });
        return serveFile(res, filePath);
      }

      return json(res, 404, { ok: false, error: 'Not found', requestId });
    } catch (error) {
      log.error('Request failed', { module: 'server', error });
      return json(res, 500, { ok: false, error: error.message, requestId });
    }
  });
}

if (require.main === module) {
  const server = createServer();

  server.listen(PORT, () => {
    logger.info(`Kaisha distribution server running on http://localhost:${PORT}`, { module: 'server' });
  });

  const shutdown = async (signal) => {
    logger.warn(`Shutdown requested by ${signal}`, { module: 'server' });
    await new Promise(resolve => server.close(resolve));
  };

  const fatal = async (signal, error) => {
    logger.fatal(`Server ${signal}`, { module: 'server', error });
    try {
      await shutdown(signal);
    } finally {
      process.exit(1);
    }
  };

  process.once('SIGINT', () => shutdown('SIGINT').then(() => process.exit(0)));
  process.once('SIGTERM', () => shutdown('SIGTERM').then(() => process.exit(0)));
  process.once('uncaughtException', error => fatal('uncaughtException', error));
  process.once('unhandledRejection', reason => fatal('unhandledRejection', reason instanceof Error ? reason : new Error(String(reason))));
}

module.exports = { createServer, ensureZip };
