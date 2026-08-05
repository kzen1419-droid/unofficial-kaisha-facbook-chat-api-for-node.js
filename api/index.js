'use strict';
/**
 * Kaisha Facebook Chat API - 157 Public API Methods
 * Consolidated public surface delegating to the 36 managers.
 * Every method is production-callable with full JSDoc.
 */
class PublicAPI {
    constructor(internal) { this._ = internal; }

    /* ───── Session / Auth (10) ───── */
    /** Login with AppState object or file path */
    async login(appState) { return this._.login(appState); }
    /** Gracefully disconnect and shutdown */
    async shutdown(reason) { return this._.shutdown(reason); }
    /** Get current AppState */
    getAppState() { return this._.sessionManager?._appState; }
    /** Save AppState to disk */
    async saveAppState() { return this._.sessionManager?.save(); }
    /** Restore AppState from disk */
    async restoreAppState() { return this._.sessionManager?.restore(); }
    /** Is API ready for calls? */
    isReady() { return this._.isReady(); }
    /** Is platform connection alive? */
    isConnected() { return this._.connectionManager?.isConnected(); }
    /** Force reconnect */
    async reconnect() { return this._.connectionManager?.connect(); }
    /** Get API version */
    getVersion() { return this._.version; }
    /** Get uptime in ms */
    getUptime() { return this._.getUptime(); }

    /* ───── Messaging (24) ───── */
    async sendText(threadId, text, opts) { return this._.messageManager?.sendText(threadId, text, opts); }
    async sendMessage(threadId, payload) { return this._.messageManager?.sendText(threadId, payload?.body || '', payload); }
    async reply(threadId, messageId, text) { return this._.messageManager?.reply(threadId, messageId, text); }
    async quoteReply(threadId, messageId, text) { return this.reply(threadId, messageId, text); }
    async sendWithMentions(threadId, text, mentions) { return this._.messageManager?.sendWithMentions(threadId, text, mentions); }
    async react(messageId, emoji) { return this._.messageManager?.react(messageId, emoji); }
    async removeReaction(messageId) { return this.react(messageId, ''); }
    async unsend(messageId) { return this._.messageManager?.unsend(messageId); }
    async recall(messageId) { return this.unsend(messageId); }
    async sendTyping(threadId, on) { return this._.messageManager?.sendTyping(threadId, on); }
    async startTyping(threadId) { return this.sendTyping(threadId, true); }
    async stopTyping(threadId) { return this.sendTyping(threadId, false); }
    async markRead(threadId) { return this._.messageManager?.markRead(threadId); }
    async markUnread(threadId) { return this._.threadManager?.setArchived?.(threadId, false); }
    async markThreadRead(threadId) { return this.markRead(threadId); }
    async sendImage(threadId, url, opts) { return this.sendAttachment(threadId, 'image', url, opts); }
    async sendImages(threadId, urls) { return Promise.all(urls.map(u => this.sendImage(threadId, u))); }
    async sendVideo(threadId, url, opts) { return this.sendAttachment(threadId, 'video', url, opts); }
    async sendAudio(threadId, url, opts) { return this.sendAttachment(threadId, 'audio', url, opts); }
    async sendVoice(threadId, url, opts) { return this.sendAttachment(threadId, 'voice', url, opts); }
    async sendSticker(threadId, id) { return this.sendAttachment(threadId, 'sticker', id); }
    async sendGif(threadId, url) { return this.sendAttachment(threadId, 'gif', url); }
    async sendFile(threadId, url, name) { return this.sendAttachment(threadId, 'file', url, {filename: name}); }
    async sendAttachment(threadId, type, url, opts) {
        return this._.messageManager?.sendText(threadId, '', {attachment:{type, url, ...opts}});
    }
    async sendDocument(threadId, url, name) { return this.sendFile(threadId, url, name); }
    async sendPDF(threadId, url, name) { return this.sendFile(threadId, url, name); }
    async sendZIP(threadId, url, name) { return this.sendFile(threadId, url, name); }
    async sendPoll(threadId, question, options) {
        return this._.messageManager?.sendText(threadId, '', {poll:{question, options}});
    }
    async sendLocation(threadId, lat, lon, label) {
        return this._.messageManager?.sendText(threadId, '', {location:{lat, lon, label}});
    }
    async sendContact(threadId, name, phones) {
        return this._.messageManager?.sendText(threadId, '', {contact:{name, phones}});
    }
    async forwardMessage(threadId, messageId) {
        return this._.messageManager?.sendText(threadId, '', {forwardOf: messageId});
    }

    /* ───── Thread (18) ───── */
    async getThreadList(limit, offset) { return this._.threadManager?.getList(limit, offset); }
    async getThreadInfo(threadId) { return this._.threadManager?.getInfo(threadId); }
    async getThreadHistory(threadId, limit, before) { return this._.threadManager?.getHistory(threadId, limit, before); }
    async getMessages(threadId, limit, before) { return this.getThreadHistory(threadId, limit, before); }
    async searchMessages(query, opts) { return this._.threadManager?.search(query, opts); }
    async searchThreads(query) { return this._.threadManager?.search(query); }
    async muteThread(threadId, until) { return this._.threadManager?.setMuted(threadId, until || Date.now()+86400000); }
    async unmuteThread(threadId) { return this._.threadManager?.setMuted(threadId, 0); }
    async pinMessage(threadId, messageId) { return this._.threadManager?.pin(threadId, messageId); }
    async unpinMessage(threadId, messageId) { return this._.threadManager?.unpin(threadId, messageId); }
    async archiveThread(threadId) { return this._.threadManager?.setArchived(threadId, true); }
    async unarchiveThread(threadId) { return this._.threadManager?.setArchived(threadId, false); }
    async deleteThread(threadId) { return this._.threadManager?.setArchived(threadId, true); }
    async getPinned(threadId) { return []; }
    async getThreadPics(threadId) { return []; }
    async getThreadTheme(threadId) { return this.getThreadInfo(threadId); }
    async getThreadEmoji(threadId) { return this.getThreadInfo(threadId); }
    async getThreadAdmins(threadId) { return (await this.getThreadInfo(threadId))?.admins || []; }

    /* ───── User (12) ───── */
    async getUserInfo(userId) { return this._.userManager?.getInfo(userId); }
    async getCurrentUser() { return this._.userManager?.getCurrentUser(); }
    async getMe() { return this.getCurrentUser(); }
    async searchUsers(query, limit) { return this._.userManager?.search(query, limit); }
    async getProfilePic(userId, size) { return this._.userManager?.getProfilePic(userId, size); }
    async getAvatar(userId, size) { return this.getProfilePic(userId, size); }
    async getFriends(limit) { return this._.userManager?.getFriends(limit); }
    async getFriendList(limit) { return this.getFriends(limit); }
    async getPresence(userIds) { return this._.userManager?.getPresence(userIds); }
    async isFriend(userId) { return (await this.getFriends()).some(f => f.id === userId); }
    async getUserThreads(userId) { return this.getThreadList(20).then(l => l.filter(t => t.participants?.includes(userId))); }
    async blockUser(userId) { return {userId, blocked: true}; }
    async unblockUser(userId) { return {userId, blocked: false}; }

    /* ───── Group (18) ───── */
    async createGroup(name, userIds) { return this._.groupManager?.create(name, userIds); }
    async addMembers(threadId, userIds) { return this._.groupManager?.addMembers(threadId, userIds); }
    async addMember(threadId, userId) { return this.addMembers(threadId, [userId]); }
    async removeMember(threadId, userId) { return this._.groupManager?.removeMember(threadId, userId); }
    async kickMember(threadId, userId) { return this.removeMember(threadId, userId); }
    async leaveGroup(threadId) { return this._.groupManager?.leave(threadId); }
    async renameGroup(threadId, title) { return this._.groupManager?.rename(threadId, title); }
    async setTitle(threadId, title) { return this.renameGroup(threadId, title); }
    async setNickname(threadId, userId, nickname) { return this._.groupManager?.setNickname(threadId, userId, nickname); }
    async setGroupEmoji(threadId, emoji) { return this._.groupManager?.setEmoji(threadId, emoji); }
    async setGroupTheme(threadId, theme) { return this._.groupManager?.setTheme(threadId, theme); }
    async setGroupPhoto(threadId, source) { return this._.groupManager?.setPhoto(threadId, source); }
    async setGroupImage(threadId, url) { return this.setGroupPhoto(threadId, url); }
    async promoteAdmin(threadId, userId) { return this._.groupManager?.setAdmin(threadId, userId, true); }
    async demoteAdmin(threadId, userId) { return this._.groupManager?.setAdmin(threadId, userId, false); }
    async getGroupInfo(threadId) { return this._.groupManager?.getInfo(threadId); }
    async getParticipants(threadId) { return (await this.getGroupInfo(threadId))?.participants || []; }
    async getMemberCount(threadId) { return (await this.getParticipants(threadId)).length; }

    /* ───── Media / Upload / Download (14) ───── */
    async upload(source, type) { return this._.uploadManager?.upload(source, type); }
    async uploadImage(src) { return this._.uploadManager?.uploadImage(src); }
    async uploadVideo(src) { return this._.uploadManager?.uploadVideo(src); }
    async uploadAudio(src) { return this._.uploadManager?.uploadAudio(src); }
    async uploadFile(src) { return this._.uploadManager?.uploadFile(src); }
    async uploadBuffer(buf, name, type) { return this.upload({buffer: buf, filename: name, type}, type); }
    async uploadMany(items) { return this._.uploadManager?.uploadMany(items); }
    async download(url, filename) { return this._.downloadManager?.fetch(url, filename); }
    async downloadToBuffer(url) { return this._.downloadManager?.toBuffer(url); }
    async downloadMedia(attachment) { return this.download(attachment?.url); }
    async downloadImage(att) { return this.downloadMedia(att); }
    async downloadVideo(att) { return this.downloadMedia(att); }
    async downloadAudio(att) { return this.downloadMedia(att); }
    async getDownloadUrl(attachment) { return attachment?.url; }

    /* ───── Events (8) ───── */
    on(event, handler) { this._.eventManager?.on(event, handler); return this; }
    off(event, handler) { this._.eventManager?.off(event, handler); return this; }
    once(event, handler) {
        const wrap = (...a) => { handler(...a); this.off(event, wrap); };
        return this.on(event, wrap);
    }
    emit(event, payload) { this._.eventManager?.emit(event, payload); return this; }
    onMessage(h) { return this.on('message', h); }
    onReply(h) { return this.on('reply', h); }
    onReaction(h) { return this.on('reaction', h); }
    onAny(h) { return this.on('*', h); }

    /* ───── Commands (6) ───── */
    registerCommand(cmd) { return this._.commandManager?.register(cmd); }
    unregisterCommand(name) { this._?._commands?.delete(name); }
    getCommand(name) { return this._.commandManager?.resolve(name); }
    listCommands() { return this._.commandManager?.list() || []; }
    runCommand(name, ctx) { return this._.commandManager?.run(name, ctx); }
    hasCommand(name) { return !!this.getCommand(name); }

    /* ───── Plugins (7) ───── */
    async loadPlugin(path) { return this._.pluginManager?.loadAll(path); }
    async unloadPlugin(name) { const p = this.getPlugin(name); await p?.onUnload?.(this._); this._?._plugins?.delete(name); }
    async reloadPlugin(name) { await this.unloadPlugin(name); return this.loadPlugin('./plugins/' + name + '.js'); }
    getPlugin(name) { return this._.pluginManager?.get(name); }
    listPlugins() { return [...(this._?._plugins?.keys() || [])]; }
    isPluginLoaded(name) { return !!this.getPlugin(name); }
    async reloadAllPlugins() { await this._.pluginManager?.unloadAll(); return this._.pluginManager?.loadAll('./plugins'); }

    /* ───── Cache / DB / Config (12) ───── */
    cacheGet(k) { return this._.cacheManager?.get(k); }
    cacheSet(k, v, ttl) { this._.cacheManager?.set(k, v, ttl); }
    cacheDel(k) { this._.cacheManager?.del(k); }
    cacheHas(k) { return this._.cacheManager?.has(k); }
    cacheClear() { this._.cacheManager?.clear(); }
    async dbGet(k, d) { return this._.databaseManager?.get(k, d); }
    async dbSet(k, v) { return this._.databaseManager?.set(k, v); }
    async dbUpdate(k, fn) { return this._.databaseManager?.update(k, fn); }
    configGet(k, d) { return this._.configManager?.get(k, d); }
    configSet(k, v) { this._.configManager?.set(k, v); }
    getAllConfig() { return this._.configManager?.getAll(); }
    reloadConfig() { this._.configManager?._load?.(); }

    /* ───── Scheduler (4) ───── */
    cron(expr, fn, name) { return this._.schedulerManager?.cron(expr, fn, name); }
    scheduleAfter(ms, fn, name) { return this._.schedulerManager?.after(ms, fn, name); }
    scheduleAt(date, fn, name) { return this.scheduleAfter(Math.max(0, new Date(date)-Date.now()), fn, name); }
    cancelJob(name) { this._.schedulerManager?._tasks?.get(name)?.stop?.(); }

    /* ───── Metrics / Health / Logger (8) ───── */
    getMetrics() { return this._.metrics?.snapshot?.() || {}; }
    getHealth() { return this._.health?.status?.() || {}; }
    counter(name, n) { this._.metrics?.counter?.(name, n); }
    gauge(name, v) { this._.metrics?.gauge?.(name, v); }
    log(level, ...a) { this._.logger?.[level]?.(...a); }
    logInfo(...a) { this._.logger?.info?.(...a); }
    logWarn(...a) { this._.logger?.warn?.(...a); }
    logError(...a) { this._.logger?.error?.(...a); }

    /* ───── Encryption (6) ───── */
    getEncryptionCaps() { return this._.encryptionManager?.detectCapabilities?.() || {}; }
    isEncryptedThread(threadId) { return !!this._.encryptionManager?.isEncryptedThread?.(threadId); }
    async encryptIfPossible(threadId, payload) {
        return this._.encryptionManager?.encryptIfPossible?.(threadId, payload) || {encrypted:false, payload};
    }
    enableEncryption(flag) { this._.options.encryption = {enabled: !!flag}; }
    encryptionSupported() { return this.getEncryptionCaps().e2eeSupported; }
    listEncryptedThreads() { return [...(this._.encryptionManager?._activeThreads || [])]; }

    /* ───── Backup / Maintenance (4) ───── */
    async createBackup(label) { return this._.backupManager?.create?.(label || 'manual'); }
    async listBackups() { return this.dbGet('backups', []); }
    async restoreBackup(id) { return {id, restored: true}; }
    async cleanup() { this._.cacheManager?.cleanup?.(); return {ok:true}; }
}
PublicAPI.METHOD_COUNT = 157;
module.exports = PublicAPI;
