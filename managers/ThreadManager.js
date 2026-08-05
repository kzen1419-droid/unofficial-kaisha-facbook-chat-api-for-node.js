'use strict';

const BaseManager = require('./BaseManager');
const { cloneDeep } = require('../utils/internal');
const { ValidationError } = require('../config/errors');

function now() {
  return new Date().toISOString();
}

class ThreadManager extends BaseManager {
  constructor(api) {
    super(api, 'ThreadManager');
    this._threads = new Map();
  }

  _ensure(threadId) {
    if (!threadId) throw new ValidationError('threadId is required');
    const key = String(threadId);
    if (!this._threads.has(key)) {
      this._threads.set(key, {
        id: key,
        archived: false,
        mutedUntil: 0,
        pinnedMessages: [],
        photos: [],
        messages: [],
        metadata: Object.create(null)
      });
    }
    return this._threads.get(key);
  }

  recordMessage(message) {
    if (!message?.threadId || !message?.id) return null;
    const thread = this._ensure(message.threadId);
    thread.messages.push({
      id: String(message.id),
      body: String(message.body ?? ''),
      timestamp: message.timestamp || now(),
      type: message.type || 'text'
    });
    if (thread.messages.length > 500) thread.messages.splice(0, thread.messages.length - 500);
    return cloneDeep(thread);
  }

  setArchived(threadId, archived = true) {
    const thread = this._ensure(threadId);
    thread.archived = !!archived;
    thread.updatedAt = now();
    return cloneDeep(thread);
  }

  setMuted(threadId, until = 0) {
    const thread = this._ensure(threadId);
    thread.mutedUntil = Number(until) || 0;
    thread.updatedAt = now();
    return cloneDeep(thread);
  }

  pin(threadId, messageId) {
    const thread = this._ensure(threadId);
    const id = String(messageId);
    if (!thread.pinnedMessages.includes(id)) thread.pinnedMessages.push(id);
    thread.updatedAt = now();
    return cloneDeep(thread);
  }

  unpin(threadId, messageId) {
    const thread = this._ensure(threadId);
    const id = String(messageId);
    thread.pinnedMessages = thread.pinnedMessages.filter(item => item !== id);
    thread.updatedAt = now();
    return cloneDeep(thread);
  }

  getList(limit = 50, offset = 0) {
    return [...this._threads.values()].slice(Number(offset) || 0, (Number(offset) || 0) + (Number(limit) || 50)).map(cloneDeep);
  }

  getInfo(threadId) {
    const thread = this._threads.get(String(threadId));
    return thread ? cloneDeep(thread) : null;
  }

  getHistory(threadId, limit = 50, before = null) {
    const thread = this._threads.get(String(threadId));
    if (!thread) return [];
    let history = thread.messages.slice();
    if (before) {
      const index = history.findIndex(message => message.id === String(before));
      if (index >= 0) history = history.slice(0, index);
    }
    return history.slice(-Math.max(0, Number(limit) || 50)).map(cloneDeep);
  }

  search(query, opts = {}) {
    const term = String(query || '').toLowerCase();
    const results = [];
    for (const thread of this._threads.values()) {
      if (!term || thread.id.toLowerCase().includes(term) || JSON.stringify(thread.metadata).toLowerCase().includes(term)) {
        results.push(cloneDeep(thread));
      }
    }
    const limit = Math.max(1, Number(opts.limit) || results.length || 1);
    return results.slice(0, limit);
  }

  getPinned(threadId) {
    return (this._threads.get(String(threadId))?.pinnedMessages || []).slice();
  }

  getThreadPics(threadId) {
    return (this._threads.get(String(threadId))?.photos || []).slice();
  }

  getThreadTheme(threadId) {
    return this._threads.get(String(threadId))?.theme || null;
  }

  async shutdown() {
    this._threads.clear();
    await super.shutdown();
  }
}

module.exports = ThreadManager;
module.exports.ThreadManager = ThreadManager;
module.exports.default = ThreadManager;
