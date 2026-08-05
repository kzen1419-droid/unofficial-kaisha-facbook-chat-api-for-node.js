'use strict';

const BaseManager = require('./BaseManager');
const { cloneDeep } = require('../utils/internal');
const { ValidationError } = require('../config/errors');

function now() {
  return new Date().toISOString();
}

function asId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

class GroupManager extends BaseManager {
  constructor(api) {
    super(api, 'GroupManager');
    this._groups = new Map();
  }

  _ensure(threadId) {
    if (!threadId) throw new ValidationError('threadId is required');
    const key = String(threadId);
    if (!this._groups.has(key)) {
      this._groups.set(key, {
        id: key,
        name: key,
        members: new Set(),
        nicknames: Object.create(null),
        admins: new Set(),
        emoji: null,
        theme: null,
        photo: null,
        history: [],
        createdAt: now(),
        updatedAt: now()
      });
    }
    return this._groups.get(key);
  }

  create(name, userIds = []) {
    if (!name) throw new ValidationError('Group name is required');
    const id = asId('group');
    const group = this._ensure(id);
    group.name = String(name);
    for (const userId of userIds) group.members.add(String(userId));
    group.updatedAt = now();
    return this.getInfo(id);
  }

  addMembers(threadId, userIds = []) {
    const group = this._ensure(threadId);
    for (const userId of userIds) group.members.add(String(userId));
    group.updatedAt = now();
    return this.getInfo(threadId);
  }

  removeMember(threadId, userId) {
    const group = this._ensure(threadId);
    group.members.delete(String(userId));
    group.admins.delete(String(userId));
    delete group.nicknames[String(userId)];
    group.updatedAt = now();
    return this.getInfo(threadId);
  }

  leave(threadId) {
    const group = this._ensure(threadId);
    group.left = true;
    group.updatedAt = now();
    return this.getInfo(threadId);
  }

  rename(threadId, title) {
    const group = this._ensure(threadId);
    group.name = String(title || group.name);
    group.updatedAt = now();
    return this.getInfo(threadId);
  }

  setNickname(threadId, userId, nickname) {
    const group = this._ensure(threadId);
    group.nicknames[String(userId)] = String(nickname || '');
    group.updatedAt = now();
    return this.getInfo(threadId);
  }

  setEmoji(threadId, emoji) {
    const group = this._ensure(threadId);
    group.emoji = String(emoji || '');
    group.updatedAt = now();
    return this.getInfo(threadId);
  }

  setTheme(threadId, theme) {
    const group = this._ensure(threadId);
    group.theme = String(theme || '');
    group.updatedAt = now();
    return this.getInfo(threadId);
  }

  setPhoto(threadId, source) {
    const group = this._ensure(threadId);
    group.photo = String(source || '');
    group.updatedAt = now();
    return this.getInfo(threadId);
  }

  setAdmin(threadId, userId, isAdmin = true) {
    const group = this._ensure(threadId);
    const id = String(userId);
    if (isAdmin) group.admins.add(id);
    else group.admins.delete(id);
    group.updatedAt = now();
    return this.getInfo(threadId);
  }

  getInfo(threadId) {
    const group = this._groups.get(String(threadId));
    if (!group) return null;
    return cloneDeep({
      id: group.id,
      name: group.name,
      members: [...group.members],
      nicknames: group.nicknames,
      admins: [...group.admins],
      emoji: group.emoji,
      theme: group.theme,
      photo: group.photo,
      left: !!group.left,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt
    });
  }

  async shutdown() {
    this._groups.clear();
    await super.shutdown();
  }
}

module.exports = GroupManager;
module.exports.GroupManager = GroupManager;
module.exports.default = GroupManager;
