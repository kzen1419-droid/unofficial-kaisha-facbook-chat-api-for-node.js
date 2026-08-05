/**
 * Kaisha Facebook Chat API - 50+ Messenger Event Definitions
 * Single consolidated registry consumed by EventManager
 */
'use strict';

const EVENTS = {};

EVENTS.MESSAGE = {
  name: 'message',
  description: 'A new chat message was received',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.message'); }
};

EVENTS.REPLY = {
  name: 'reply',
  description: 'Explicit reply to a previous message',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.reply'); }
};

EVENTS.REACTION = {
  name: 'reaction',
  description: 'Reaction emoji added to a message',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.reaction'); }
};

EVENTS.REACTION_REMOVE = {
  name: 'reaction_remove',
  description: 'Reaction removed from a message',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.reaction_remove'); }
};

EVENTS.UNSEND = {
  name: 'unsend',
  description: 'Message recalled / unsent',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.unsend'); }
};

EVENTS.IMAGE = {
  name: 'image',
  description: 'Image attachment received',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.image'); }
};

EVENTS.VIDEO = {
  name: 'video',
  description: 'Video attachment received',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.video'); }
};

EVENTS.AUDIO = {
  name: 'audio',
  description: 'Audio file received',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.audio'); }
};

EVENTS.VOICE = {
  name: 'voice',
  description: 'Voice / voicemail clip received',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.voice'); }
};

EVENTS.STICKER = {
  name: 'sticker',
  description: 'Sticker received',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.sticker'); }
};

EVENTS.GIF = {
  name: 'gif',
  description: 'Animated GIF received',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.gif'); }
};

EVENTS.ATTACHMENT = {
  name: 'attachment',
  description: 'Generic attachment received',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.attachment'); }
};

EVENTS.FILE = {
  name: 'file',
  description: 'Document / archive file received',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.file'); }
};

EVENTS.USER_JOIN = {
  name: 'user_join',
  description: 'User(s) joined a group',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.user_join'); }
};

EVENTS.USER_LEAVE = {
  name: 'user_leave',
  description: 'User left a group',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.user_leave'); }
};

EVENTS.NICKNAME_CHANGE = {
  name: 'nickname_change',
  description: 'Per-user nickname changed',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.nickname_change'); }
};

EVENTS.GROUP_RENAME = {
  name: 'group_rename',
  description: 'Group title changed',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.group_rename'); }
};

EVENTS.THEME_CHANGE = {
  name: 'theme_change',
  description: 'Group theme changed',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.theme_change'); }
};

EVENTS.EMOJI_CHANGE = {
  name: 'emoji_change',
  description: 'Group quick-reaction emoji changed',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.emoji_change'); }
};

EVENTS.GROUP_PHOTO_CHANGE = {
  name: 'group_photo_change',
  description: 'Group photo updated',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.group_photo_change'); }
};

EVENTS.ADMIN_CHANGE = {
  name: 'admin_change',
  description: 'Admin role granted / revoked',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.admin_change'); }
};

EVENTS.TYPING = {
  name: 'typing',
  description: 'User started / stopped typing',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.typing'); }
};

EVENTS.READ_RECEIPT = {
  name: 'read_receipt',
  description: 'Message marked as read',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.read_receipt'); }
};

EVENTS.DELIVERY = {
  name: 'delivery',
  description: 'Message delivered to device',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.delivery'); }
};

EVENTS.POLL = {
  name: 'poll',
  description: 'Poll created or voted in',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.poll'); }
};

EVENTS.CALL = {
  name: 'call',
  description: 'Messenger call event',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.call'); }
};

EVENTS.EVENT_REMINDER = {
  name: 'event_reminder',
  description: 'Calendar reminder fired',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.event_reminder'); }
};

EVENTS.PIN = {
  name: 'pin',
  description: 'Message pinned',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.pin'); }
};

EVENTS.UNPIN = {
  name: 'unpin',
  description: 'Message unpinned',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.unpin'); }
};

EVENTS.MENTION = {
  name: 'mention',
  description: '@mention of current user',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.mention'); }
};

EVENTS.QUOTE = {
  name: 'quote',
  description: 'Message quotes prior content',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.quote'); }
};

EVENTS.LINK = {
  name: 'link',
  description: 'Message contains URL(s)',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.link'); }
};

EVENTS.LOCATION = {
  name: 'location',
  description: 'Location / map pin shared',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.location'); }
};

EVENTS.CONTACT = {
  name: 'contact',
  description: 'Contact card shared',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.contact'); }
};

EVENTS.SHARE = {
  name: 'share',
  description: 'External content shared',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.share'); }
};

EVENTS.STORY_REPLY = {
  name: 'story_reply',
  description: 'Reply to a story',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.story_reply'); }
};

EVENTS.MESSAGE_EDIT = {
  name: 'message_edit',
  description: 'Message was edited',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.message_edit'); }
};

EVENTS.THREAD_MUTE = {
  name: 'thread_mute',
  description: 'Thread muted',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.thread_mute'); }
};

EVENTS.THREAD_UNMUTE = {
  name: 'thread_unmute',
  description: 'Thread unmuted',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.thread_unmute'); }
};

EVENTS.FRIEND_REQUEST = {
  name: 'friend_request',
  description: 'Incoming friend request',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.friend_request'); }
};

EVENTS.FRIEND_ACCEPT = {
  name: 'friend_accept',
  description: 'Friend request accepted',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.friend_accept'); }
};

EVENTS.PRESENCE = {
  name: 'presence',
  description: 'Online presence changed',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.presence'); }
};

EVENTS.PROFILE_UPDATE = {
  name: 'profile_update',
  description: 'User profile updated',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.profile_update'); }
};

EVENTS.ENCRYPTED_MESSAGE = {
  name: 'encrypted_message',
  description: 'E2EE encrypted message',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.encrypted_message'); }
};

EVENTS.EPHEMERAL = {
  name: 'ephemeral',
  description: 'Self-destructing message',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.ephemeral'); }
};

EVENTS.FOLDER = {
  name: 'folder',
  description: 'Thread moved between folders',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.folder'); }
};

EVENTS.MARK_READ = {
  name: 'mark_read',
  description: 'Thread marked read',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.mark_read'); }
};

EVENTS.MARK_UNREAD = {
  name: 'mark_unread',
  description: 'Thread marked unread',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.mark_unread'); }
};

EVENTS.MESSAGE_REQUEST = {
  name: 'message_request',
  description: 'Message in request inbox',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.message_request'); }
};

EVENTS.PLUGIN_READY = {
  name: 'plugin_ready',
  description: 'Plugin finished loading',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.plugin_ready'); }
};

EVENTS.COMMAND_RUN = {
  name: 'command_run',
  description: 'Command executed',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.command_run'); }
};

EVENTS.READY = {
  name: 'ready',
  description: 'API fully online',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.ready'); }
};

EVENTS.ERROR = {
  name: 'error',
  description: 'Unhandled error',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.error'); }
};

EVENTS.SHUTDOWN = {
  name: 'shutdown',
  description: 'Shutdown initiated',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.shutdown'); }
};

EVENTS.CONNECTED = {
  name: 'connected',
  description: 'Platform connected',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.connected'); }
};

EVENTS.DISCONNECTED = {
  name: 'disconnected',
  description: 'Platform disconnected',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.disconnected'); }
};

EVENTS.RECONNECT = {
  name: 'reconnect',
  description: 'Reconnecting',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.reconnect'); }
};

EVENTS.HEALTH_CHANGE = {
  name: 'health_change',
  description: 'Health status changed',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.health_change'); }
};

EVENTS.BACKUP_COMPLETE = {
  name: 'backup_complete',
  description: 'Backup finished',
  schema: ['threadId','senderId','messageId','timestamp','raw'],
  async handler(payload, api) { api?.metrics?.counter?.('event.backup_complete'); }
};

EVENTS.ALL = Object.values(EVENTS).filter(v => typeof v === 'object' && v.name);
EVENTS.COUNT = 59;
EVENTS.NAMES = ['message', 'reply', 'reaction', 'reaction_remove', 'unsend', 'image', 'video', 'audio', 'voice', 'sticker', 'gif', 'attachment', 'file', 'user_join', 'user_leave', 'nickname_change', 'group_rename', 'theme_change', 'emoji_change', 'group_photo_change', 'admin_change', 'typing', 'read_receipt', 'delivery', 'poll', 'call', 'event_reminder', 'pin', 'unpin', 'mention', 'quote', 'link', 'location', 'contact', 'share', 'story_reply', 'message_edit', 'thread_mute', 'thread_unmute', 'friend_request', 'friend_accept', 'presence', 'profile_update', 'encrypted_message', 'ephemeral', 'folder', 'mark_read', 'mark_unread', 'message_request', 'plugin_ready', 'command_run', 'ready', 'error', 'shutdown', 'connected', 'disconnected', 'reconnect', 'health_change', 'backup_complete'];
module.exports = EVENTS;
