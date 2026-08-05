'use strict';

const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const KaishaAPI = require('../index');

test('config manager blocks unsafe path writes', () => {
  const api = new KaishaAPI();
  assert.throws(() => {
    api.configManager.set('__proto__.polluted', 'yes');
  }, /Unsafe path segment|Invalid config path/);
  assert.equal({}.polluted, undefined);
});

test('duplicate command aliases resolve deterministically', () => {
  const api = new KaishaAPI();
  api.registerCommand({
    name: 'alpha',
    aliases: ['shared'],
    description: 'First command',
    async run() {
      return 'alpha';
    }
  });
  api.registerCommand({
    name: 'beta',
    aliases: ['shared'],
    description: 'Second command',
    async run() {
      return 'beta';
    }
  });

  assert.equal(api.getCommand('shared').name, 'beta');
  assert.equal(api.getCommand('alpha').name, 'alpha');
  assert.equal(api.getCommand('beta').name, 'beta');
});

test('plugin loading preserves lifecycle and command functions', async () => {
  const api = new KaishaAPI({ ownerIds: ['user-1'] });
  await api.loadPlugins(path.join(__dirname, '..', 'plugins'));

  const admin = api.getPlugin('admin');
  assert.ok(admin);
  assert.equal(typeof admin.onLoad, 'function');
  assert.equal(typeof admin.commands[0].run, 'function');
  assert.ok(api.getCommand('admin'));
});

test('startup and shutdown clear runtime state', async () => {
  const api = new KaishaAPI({ ownerIds: ['user-1'] });
  await api.login([{ token: 'demo' }]);

  assert.equal(api.isReady(), true);
  assert.equal(api.connectionManager.isConnected(), true);
  assert.ok(api.schedulerManager.isReady());

  await api.shutdown('test');

  assert.equal(api.isReady(), false);
  assert.equal(api.connectionManager.isConnected(), false);
  assert.equal(api.schedulerManager.list().length, 0);
});
