'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const KaishaAPI = require('../index');

test('login and shutdown complete cleanly', async () => {
  const api = new KaishaAPI({ ownerIds: ['user-1'] });
  await api.login({ cookies: [] });
  assert.equal(api.isReady(), true);
  await api.shutdown('test');
  assert.equal(api.isReady(), false);
});
