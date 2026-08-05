'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const KaishaAPI = require('../index');

test('bootstrap loads managers and config', () => {
  const api = new KaishaAPI({ ownerIds: ['user-1'] });
  assert.ok(api.loggerManager);
  assert.ok(api.metricsManager);
  assert.ok(api.healthManager);
  assert.equal(api.version, '1.0.0');
  assert.equal(typeof api.getUptime(), 'number');
});

test('command registration works', async () => {
  const api = new KaishaAPI({ ownerIds: ['user-1'] });
  api.messageManager.sendText = async (_threadId, text) => ({ text });
  api.registerCommand({
    name: 'echo',
    aliases: ['say'],
    category: 'general',
    description: 'Echo test',
    async run(ctx) {
      return api.messageManager.sendText(ctx.threadId, ctx.args.join(' '));
    }
  });

  const result = await api.runCommand('echo', {
    threadId: 't1',
    args: ['hello', 'world']
  });

  assert.deepEqual(result, { text: 'hello world' });
});

test('helper image dimension detection works for PNG buffers', async () => {
  const helpers = require('../helpers');
  const png = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0x10,
    0x08, 0x06, 0x00, 0x00, 0x00
  ]);
  const dims = await helpers.getMediaDimensions(png);
  assert.deepEqual(dims, { width: 32, height: 16 });
});

test('utility scripts export callable functions without auto-running', () => {
  const docs = require('../scripts/generate-docs');
  const lint = require('../scripts/lint');
  assert.equal(typeof docs.generateDocs, 'function');
  assert.equal(typeof lint.runLint, 'function');
});
