'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const KaishaAPI = require('../index');

test('plugin loading registers bundled plugin commands', async () => {
  const api = new KaishaAPI({ ownerIds: ['user-1'] });
  api.messageManager.sendText = async (_threadId, text) => ({ text });
  await api.login({ cookies: [] });
  const commands = api.commandManager.list();
  assert.ok(commands.length > 0);
  assert.ok(commands.some(command => command.name === 'help'));
  await api.shutdown('test');
});

test('loadPlugins and loadCommands stay usable directly', async () => {
  const api = new KaishaAPI({ ownerIds: ['user-1'] });
  await api.loadPlugins(path.join(__dirname, '..', 'plugins'));
  await api.loadCommands(path.join(__dirname, '..', 'commands'));
  assert.ok(api.getCommand('help'));
  assert.ok(api.getPlugin('music'));
});
