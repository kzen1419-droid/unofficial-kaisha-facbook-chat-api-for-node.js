'use strict';

const BaseManager = require('./BaseManager');
const { ValidationError } = require('../config/errors');
const { cloneDeep } = require('../utils/internal');

function now() {
  return new Date().toISOString();
}

function asMessageId() {
  return `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

class MessageManager extends BaseManager {
  constructor(api) {
    super(api, 'MessageManager');
    this._messages = new Map();
  }

  _storeMessage(message) {
    this._messages.set(message.id, message);
    this.api?.threadManager?.recordMessage?.(message);
    return cloneDeep(message);
  }

  async sendText(threadId, text, opts = {}) {
    if (!threadId) throw new ValidationError('threadId is required');
    const body = String(text ?? '');
    const message = {
      id: asMessageId(),
      threadId: String(threadId),
      body,
      type: 'text',
      options: cloneDeep(opts || {}),
      timestamp: now()
    };

    try {
      await Promise.resolve(this.api?.emit?.('message:sent', cloneDeep(message)));
    } catch (error) {
      this._log('warn', 'message sent event failed', { error });
    }

    return this._storeMessage(message);
  }

  async sendMessage(threadId, payload = {}) {
    return this.sendText(threadId, payload.body ?? '', payload);
  }

  async reply(threadId, messageId, text) {
    return this.sendText(threadId, text, { replyTo: messageId });
  }

  async sendWithMentions(threadId, text, mentions = []) {
    return this.sendText(threadId, text, { mentions: Array.isArray(mentions) ? mentions.map(String) : [] });
  }

  async react(messageId, emoji) {
    if (!messageId || !emoji) throw new ValidationError('messageId and emoji are required');
    const entry = this._messages.get(String(messageId));
    if (entry) entry.reaction = String(emoji);
    return {
      messageId: String(messageId),
      reaction: String(emoji),
      timestamp: now()
    };
  }

  async removeReaction(messageId) {
    const entry = this._messages.get(String(messageId));
    if (entry) delete entry.reaction;
    return { messageId: String(messageId), removed: true };
  }

  async editMessage(messageId, text) {
    const entry = this._messages.get(String(messageId));
    if (!entry) throw new ValidationError('message not found');
    entry.body = String(text ?? '');
    entry.editedAt = now();
    return cloneDeep(entry);
  }

  async deleteMessage(messageId) {
    return this._messages.delete(String(messageId));
  }

  async pinMessage(messageId) {
    const entry = this._messages.get(String(messageId));
    if (entry) entry.pinned = true;
    return { messageId: String(messageId), pinned: true };
  }

  async unpinMessage(messageId) {
    const entry = this._messages.get(String(messageId));
    if (entry) entry.pinned = false;
    return { messageId: String(messageId), pinned: false };
  }

  async unsend(messageId) {
    return this.deleteMessage(messageId);
  }

  async markRead(threadId) {
    return { threadId: String(threadId), readAt: now() };
  }

  async sendTyping(threadId, on = true) {
    return { threadId: String(threadId), typing: !!on, timestamp: now() };
  }

  history(threadId = null) {
    const items = [...this._messages.values()].map(cloneDeep);
    return threadId ? items.filter(item => item.threadId === String(threadId)) : items;
  }

  async shutdown() {
    this._messages.clear();
    await super.shutdown();
  }
}

module.exports = MessageManager;
module.exports.MessageManager = MessageManager;
module.exports.default = MessageManager;
