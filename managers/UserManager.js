'use strict';

const BaseManager = require('./BaseManager');
const { cloneDeep } = require('../utils/internal');

class UserManager extends BaseManager {
  constructor(api) {
    super(api, 'UserManager');
    this._users = new Map();
    this._currentUser = {
      id: String(api?.options?.developer || api?.options?.author || 'kaisha'),
      name: String(api?.options?.author || 'Kaisha Bot'),
      username: String(api?.options?.creator || api?.options?.author || 'kaisha')
    };
  }

  _seed(userId) {
    const key = String(userId);
    if (!this._users.has(key)) {
      this._users.set(key, {
        id: key,
        name: `User ${key}`,
        username: key,
        friends: [],
        presence: 'offline',
        profilePic: null
      });
    }
    return this._users.get(key);
  }

  getInfo(userId) {
    if (!userId) return cloneDeep(this._currentUser);
    return cloneDeep(this._seed(userId));
  }

  getCurrentUser() {
    return cloneDeep(this._currentUser);
  }

  search(query, limit = 20) {
    const term = String(query || '').toLowerCase();
    const results = [];
    for (const user of this._users.values()) {
      if (!term || user.id.toLowerCase().includes(term) || user.name.toLowerCase().includes(term) || String(user.username || '').toLowerCase().includes(term)) {
        results.push(cloneDeep(user));
      }
    }
    return results.slice(0, Math.max(1, Number(limit) || 20));
  }

  getProfilePic(userId, size = 256) {
    const user = this._seed(userId);
    return user.profilePic || null;
  }

  getFriends(limit = 50) {
    return [...this._users.values()].filter(user => user.friends.includes(this._currentUser.id)).slice(0, Math.max(1, Number(limit) || 50)).map(cloneDeep);
  }

  getPresence(userIds = []) {
    const ids = Array.isArray(userIds) ? userIds : [userIds];
    return ids.map(id => {
      const user = this._seed(id);
      return { id: user.id, presence: user.presence };
    });
  }

  getUserThreads(userId) {
    return this.api?.threadManager?.search?.(userId, { limit: 20 }) || [];
  }

  async shutdown() {
    this._users.clear();
    await super.shutdown();
  }
}

module.exports = UserManager;
module.exports.UserManager = UserManager;
module.exports.default = UserManager;
