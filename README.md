<div align="center">

# Kaisha Facebook Chat API

Enterprise-grade Facebook Messenger SDK runtime, command loader, plugin host, and distribution server.

</div>

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-339933)
![License](https://img.shields.io/badge/license-MIT-green)
![No Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)

## Overview

`Kaisha Facebook Chat API` is a pure JavaScript Messenger SDK/runtime with a modular manager architecture, a command system, a plugin loader, event registration, helpers, utilities, and a one-click ZIP distribution server.

## Feature Matrix

| Area | What is actually in the repo | Count |
| --- | --- | --- |
| `Main runtime` | Root `KaishaAPI` class with login, shutdown, command, plugin, and event helpers. | 1 |
| `Runtime managers` | 36 manager modules in the startup order defined by `config/constants.js`. | 36 |
| `Built-in commands` | 4 bundled commands: about, eval, help, ping. | 4 |
| `Bundled plugins` | 30 plugin manifests auto-loaded from `plugins/`. | 30 |
| `Events` | 59 event definitions registered by `EventManager`. | 59 |
| `Helpers` | Domain helpers for media, parsing, messaging, thread/user utilities, and control flow. | 125 exports |
| `Utilities` | String, number, date, array, object, crypto, file, and validation helpers. | 98 exports |
| `Configuration` | JSON config plus `KAISHA_*` environment overrides. | Yes |
| `Distribution server` | HTTP server that serves a ZIP build and status endpoints. | Yes |
| `Testing` | Node test suite covering bootstrap, lifecycle, plugin loading, and safety checks. | Yes |

## Package Exports

| Export | What it points to | Use |
| --- | --- | --- |
| `.` | Root entrypoint that exports `KaishaAPI` and helpers. | Main SDK |
| `./api` | Public API wrapper class. | Facade |
| `./helpers` | Helper utility bundle. | Helper module |
| `./utils` | General utility bundle. | Utility module |
| `./events` | Event registry. | Event module |
| `./config` | Default config JSON. | Configuration |

## Root Entry Point

| Export | Value | Notes |
| --- | --- | --- |
| `default / module.exports` | KaishaAPI class | Main runtime class |
| `KaishaAPI` | Named export of the main class | Main runtime class |
| `default` | Alias of the main class | Main runtime class |
| `create(opts)` | Factory that returns `new KaishaAPI(opts)` | Convenience helper |
| `utils` | Re-export of `./utils` | Utility bundle |
| `helpers` | Re-export of `./helpers` | Helper bundle |
| `Constants` | Re-export of `./config/constants` | Constants bundle |
| `Errors` | Re-export of `./config/errors` | Error classes |

## Installation

```bash
npm install
npm run dev
```

The project has no npm dependencies. `npm run build` and `npm start` require a Python executable because `build.js` uses Python's `zipfile` module to package the repository.

### Package managers

```bash
npm install
yarn install
pnpm install
```

## Quick Start

```js
const KaishaAPI = require('./index');

async function main() {
  const api = new KaishaAPI({
    prefix: '!',
    ownerIds: ['1234567890']
  });

  await api.login([{ key: 'c_user', value: 'REPLACE' }]);
  await api.sendText('THREAD_ID', 'Hello from Kaisha');

  api.on('ready', () => {
    console.log('Runtime is ready');
  });
}

main().catch(console.error);
```

### Message handler integration

```js
const KaishaAPI = require('./index');
const handleMessage = require('./handlers/message');

async function onMessengerEvent(event) {
  const api = new KaishaAPI({ prefix: '!' });
  await api.login([{ key: 'c_user', value: 'REPLACE' }]);
  await handleMessage({
    text: event.body,
    threadId: event.threadID,
    senderId: event.senderID,
    messageId: event.messageID
  }, api);
}
```

## Repository Structure

```text
kaisha-facebook-chat-api2/
├── api/
│   └── index.js
├── commands/
│   ├── about.js
│   ├── eval.js
│   ├── help.js
│   └── ping.js
├── config/
│   ├── constants.js
│   ├── default.json
│   └── errors.js
├── database/
│   └── db.json
├── docs/
│   └── API.md
├── events/
│   └── index.js
├── examples/
│   ├── appstate.example.json
│   ├── basic.js
│   ├── custom-command.js
│   ├── custom-plugin.js
│   └── echo-bot.js
├── handlers/
│   ├── error.js
│   ├── index.js
│   └── message.js
├── helpers/
│   └── index.js
├── managers/
│   ├── AttachmentManager.js
│   ├── BackupManager.js
│   ├── BaseManager.js
│   ├── CacheManager.js
│   ├── CommandManager.js
│   ├── ConfigManager.js
│   ├── ConnectionManager.js
│   ├── CooldownManager.js
│   ├── DatabaseManager.js
│   ├── DownloadManager.js
│   ├── EncryptionManager.js
│   ├── EventManager.js
│   ├── FileManager.js
│   ├── GroupManager.js
│   ├── HealthManager.js
│   ├── LanguageManager.js
│   ├── LoggerManager.js
│   ├── LoginManager.js
│   ├── MemoryManager.js
│   ├── MessageManager.js
│   ├── MetricsManager.js
│   ├── NetworkManager.js
│   ├── PermissionManager.js
│   ├── PluginManager.js
│   ├── QueueManager.js
│   ├── RecoveryManager.js
│   ├── SchedulerManager.js
│   ├── SecurityManager.js
│   ├── SessionManager.js
│   ├── StatisticsManager.js
│   ├── StorageManager.js
│   ├── ThreadManager.js
│   ├── UpdateManager.js
│   ├── UploadManager.js
│   ├── UserManager.js
│   ├── UtilityManager.js
│   └── ValidationManager.js
├── middleware/
│   ├── cooldown.js
│   ├── index.js
│   ├── logger.js
│   ├── permission.js
│   └── sanitize.js
├── plugins/
│   ├── admin.js
│   ├── ai.js
│   ├── analytics.js
│   ├── antiSpam.js
│   ├── autoReply.js
│   ├── backup.js
│   ├── commands.js
│   ├── config.js
│   ├── converter.js
│   ├── downloader.js
│   ├── economy.js
│   ├── events.js
│   ├── games.js
│   ├── goodbye.js
│   ├── group.js
│   ├── level.js
│   ├── logger.js
│   ├── media.js
│   ├── moderation.js
│   ├── monitor.js
│   ├── music.js
│   ├── notifications.js
│   ├── profile.js
│   ├── scheduler.js
│   ├── system.js
│   ├── thread.js
│   ├── tools.js
│   ├── translator.js
│   ├── utility.js
│   └── welcome.js
├── scripts/
│   ├── generate-docs.js
│   └── lint.js
├── tests/
│   ├── bootstrap.test.js
│   ├── lifecycle.test.js
│   ├── plugin-command.test.js
│   └── refactor.test.js
├── types/
│   └── index.d.ts
├── utils/
│   ├── index.js
│   └── internal.js
├── .env.example
├── .gitignore
├── build.js
├── index.js
├── jsdoc.json
├── LICENSE
├── package.json
├── README.md
└── server.js
```

## Architecture

### Runtime flow

1. `KaishaAPI` bootstraps `ConfigManager`, `LoggerManager`, `MetricsManager`, and `HealthManager` first.
2. The remaining managers are created in the order defined by `config/constants.js`.
3. `login()` loads session data, authenticates, connects, opens the database, starts cache/event/scheduler services, then loads plugins and commands.
4. `handlers/message.js` parses commands with `helpers.parseCommand()`, applies middleware in the chain `sanitize -> logger -> permission -> cooldown`, and finally runs the command.
5. If a message is not a command, the handler dispatches it to plugins and emits the `message` event.

### Manager layout

The runtime order contains 36 managers. Several of them are fully implemented (`ConfigManager`, `LoggerManager`, `MetricsManager`, `HealthManager`, `CacheManager`, `DatabaseManager`, `SessionManager`, `LoginManager`, `ConnectionManager`, `MessageManager`, `ThreadManager`, `UserManager`, `GroupManager`, `PermissionManager`, `CooldownManager`, `PluginManager`, `EventManager`, `SchedulerManager`, `BackupManager`, `ValidationManager`, `SecurityManager`), while others are minimal shells reserved for future expansion.

### Plugin system

Plugins are loaded from `plugins/` by `PluginManager.loadAll()`. Each plugin file currently exports metadata, `onLoad`/`onUnload` hooks, an `events` map, and a single status command. The bundled plugins are extension scaffolds rather than full feature implementations.

### Middleware

| Middleware | What it does | Result |
| --- | --- | --- |
| `sanitize` | Normalizes incoming text with `helpers.sanitizeInput()`. | Returns `next()` |
| `logger` | Logs command execution and increments the `commands.total` metric. | Returns `next()` |
| `permission` | Checks `PermissionManager.check()` and denies access when needed. | Returns `next()` or sends a denial message |
| `cooldown` | Checks `CooldownManager.check()` and reports remaining cooldown. | Returns `next()` or sends a cooldown message |

### Distribution server

| Endpoint | Behavior |
| --- | --- |
| `GET /health` | JSON health snapshot with build readiness and uptime. |
| `GET /info` | Project metadata plus endpoint map. |
| `GET /rebuild` | Rebuild the ZIP archive and return a status JSON object. |
| `GET /download` | Stream `dist/kaisha-facebook-chat-api.zip` as an attachment. |

## Configuration

### `config/default.json`

| Key | Default value | Used by |
| --- | --- | --- |
| prefix | `/` | Runtime or manager |
| ownerIds | `[]` | Runtime or manager |
| language | `en` | Runtime or manager |
| timezone | `UTC` | Runtime or manager |
| logger.level | `info` | Runtime or manager |
| logger.pretty | `true` | Runtime or manager |
| logger.maxFiles | `14` | Runtime or manager |
| http.timeout | `30000` | Runtime or manager |
| http.userAgent | `KaishaFB/1.0.0` | Runtime or manager |
| queue.concurrency | `3` | Runtime or manager |
| queue.defaultPriority | `5` | Runtime or manager |
| cache.ttlMs | `300000` | Runtime or manager |
| cache.maxEntries | `5000` | Runtime or manager |
| connection.maxReconnects | `20` | Runtime or manager |
| connection.baseDelayMs | `1000` | Runtime or manager |
| database.backend | `json` | Runtime or manager |
| database.path | `./database/db.json` | Runtime or manager |
| encryption.enabled | `false` | Runtime or manager |
| encryption.algorithm | `AES-256-GCM` | Runtime or manager |
| plugins.autoLoad | `true` | Runtime or manager |
| plugins.directory | `./plugins` | Runtime or manager |
| scheduler.enabled | `true` | Runtime or manager |
| scheduler.timezone | `UTC` | Runtime or manager |
| backup.schedule | `0 3 * * *` | Runtime or manager |
| backup.retainDays | `30` | Runtime or manager |
| backup.encrypt | `false` | Runtime or manager |
| health.checkIntervalMs | `30000` | Runtime or manager |
| api.version | `1.0.0` | Runtime or manager |
| api.developer | `Aldwin Padronia` | Runtime or manager |

### Environment variables

| Variable | Meaning | Used by |
| --- | --- | --- |
| `PORT` | HTTP port used by `server.js`. | distribution server |
| `PYTHON` | Optional Python executable used by `build.js` for ZIP creation. | build script |
| `KAISHA_*` | Environment overrides merged into config. Double underscores map nested keys; values are parsed as JSON, booleans, numbers, or strings. | ConfigManager |

### `.env.example`

The sample file includes `NODE_ENV`, `PORT`, `PREFIX`, `OWNER_IDS`, `LOG_LEVEL`, and `DB_BACKEND`. In this revision, `PORT` is read directly by `server.js`, while the configuration system also honors any `KAISHA_*` override.

## Built-in Commands

| Command | Description | Aliases | Loaded by |
| --- | --- | --- | --- |
| `about` | About Kaisha Facebook Chat API | `'info', 'bot'` | Loaded by CommandManager |
| `eval` | Owner-only JavaScript evaluation | `'e', 'exec'` | Loaded by CommandManager |
| `help` | List all available commands or show help for a specific one | `'h', 'commands', 'cmds'` | Loaded by CommandManager |
| `ping` | Check bot latency and uptime | `'pong', 'latency'` | Loaded by CommandManager |

## Bundled Plugins

| Plugin | Category | Declared purpose | Current implementation |
| --- | --- | --- | --- |
| `admin` | admin | Bot administration: restart, eval, ban, broadcast | Registers lifecycle hooks and a status command |
| `ai` | general | AI chat completion with multi-provider support | Registers lifecycle hooks and a status command |
| `analytics` | analytics | Track command usage, active users, retention, charts | Registers lifecycle hooks and a status command |
| `antiSpam` | moderation | Detect spam, flood, caps, duplicates, rate limit | Registers lifecycle hooks and a status command |
| `autoReply` | automation | Keyword-based auto-response with regex matching | Registers lifecycle hooks and a status command |
| `backup` | system | Trigger manual/auto backups of config and database | Registers lifecycle hooks and a status command |
| `commands` | system | Dynamic command registry, enable/disable per thread | Registers lifecycle hooks and a status command |
| `config` | admin | View/edit bot configuration via chat commands | Registers lifecycle hooks and a status command |
| `converter` | utility | Unit, currency, base64, JSON, image format conversion | Registers lifecycle hooks and a status command |
| `downloader` | media | Download from YouTube, TikTok, FB, IG, Twitter | Registers lifecycle hooks and a status command |
| `economy` | economy | Virtual currency, bank, shop, daily rewards, gamble | Registers lifecycle hooks and a status command |
| `events` | dev | Debug event stream, emit test events, inspect payloads | Registers lifecycle hooks and a status command |
| `games` | fun | Trivia, hangman, rps, 8ball, dice, coinflip, slots | Registers lifecycle hooks and a status command |
| `goodbye` | social | Auto-goodbye when users leave groups | Registers lifecycle hooks and a status command |
| `group` | admin | Group settings: prefix, language, welcome, permissions | Registers lifecycle hooks and a status command |
| `level` | economy | XP / level system with ranks and leaderboards | Registers lifecycle hooks and a status command |
| `logger` | logging | Log group events: join, leave, rename, admin changes | Registers lifecycle hooks and a status command |
| `media` | media | Sticker maker, meme generator, image filters, ocr | Registers lifecycle hooks and a status command |
| `moderation` | moderation | Kick, ban, warn, mute, word filter, anti-raid | Registers lifecycle hooks and a status command |
| `monitor` | system | Monitor bot health, memory, lag, queue size, alerts | Registers lifecycle hooks and a status command |
| `music` | media | Music search, streaming info, lyrics lookup | Registers lifecycle hooks and a status command |
| `notifications` | system | Push notifications via webhook / email / TG | Registers lifecycle hooks and a status command |
| `profile` | social | View/edit user profile, bio, avatar, preferences | Registers lifecycle hooks and a status command |
| `scheduler` | automation | Schedule messages, reminders, cron announcements | Registers lifecycle hooks and a status command |
| `system` | dev | Runtime stats, gc, reload plugins, config hot-reload | Registers lifecycle hooks and a status command |
| `thread` | admin | Thread management: pin, mute, archive, delete, nick | Registers lifecycle hooks and a status command |
| `tools` | utility | Shorten URL, expand, whois, dns, port check, headers | Registers lifecycle hooks and a status command |
| `translator` | utility | 100+ language translation with auto-detect | Registers lifecycle hooks and a status command |
| `utility` | utility | Ping, uptime, info, calc, weather, translate, qr | Registers lifecycle hooks and a status command |
| `welcome` | social | Auto-welcome message when users join groups | Registers lifecycle hooks and a status command |

## Event Registry

All events are registered from `events/index.js` by `EventManager.start()`. The default handler for each event increments a matching metric counter.

| Event | Description | Payload |
| --- | --- | --- |
| `message` | A new chat message was received | `threadId, senderId, messageId, timestamp, raw` |
| `reply` | Explicit reply to a previous message | `threadId, senderId, messageId, timestamp, raw` |
| `reaction` | Reaction emoji added to a message | `threadId, senderId, messageId, timestamp, raw` |
| `reaction_remove` | Reaction removed from a message | `threadId, senderId, messageId, timestamp, raw` |
| `unsend` | Message recalled / unsent | `threadId, senderId, messageId, timestamp, raw` |
| `image` | Image attachment received | `threadId, senderId, messageId, timestamp, raw` |
| `video` | Video attachment received | `threadId, senderId, messageId, timestamp, raw` |
| `audio` | Audio file received | `threadId, senderId, messageId, timestamp, raw` |
| `voice` | Voice / voicemail clip received | `threadId, senderId, messageId, timestamp, raw` |
| `sticker` | Sticker received | `threadId, senderId, messageId, timestamp, raw` |
| `gif` | Animated GIF received | `threadId, senderId, messageId, timestamp, raw` |
| `attachment` | Generic attachment received | `threadId, senderId, messageId, timestamp, raw` |
| `file` | Document / archive file received | `threadId, senderId, messageId, timestamp, raw` |
| `user_join` | User(s) joined a group | `threadId, senderId, messageId, timestamp, raw` |
| `user_leave` | User left a group | `threadId, senderId, messageId, timestamp, raw` |
| `nickname_change` | Per-user nickname changed | `threadId, senderId, messageId, timestamp, raw` |
| `group_rename` | Group title changed | `threadId, senderId, messageId, timestamp, raw` |
| `theme_change` | Group theme changed | `threadId, senderId, messageId, timestamp, raw` |
| `emoji_change` | Group quick-reaction emoji changed | `threadId, senderId, messageId, timestamp, raw` |
| `group_photo_change` | Group photo updated | `threadId, senderId, messageId, timestamp, raw` |
| `admin_change` | Admin role granted / revoked | `threadId, senderId, messageId, timestamp, raw` |
| `typing` | User started / stopped typing | `threadId, senderId, messageId, timestamp, raw` |
| `read_receipt` | Message marked as read | `threadId, senderId, messageId, timestamp, raw` |
| `delivery` | Message delivered to device | `threadId, senderId, messageId, timestamp, raw` |
| `poll` | Poll created or voted in | `threadId, senderId, messageId, timestamp, raw` |
| `call` | Messenger call event | `threadId, senderId, messageId, timestamp, raw` |
| `event_reminder` | Calendar reminder fired | `threadId, senderId, messageId, timestamp, raw` |
| `pin` | Message pinned | `threadId, senderId, messageId, timestamp, raw` |
| `unpin` | Message unpinned | `threadId, senderId, messageId, timestamp, raw` |
| `mention` | @mention of current user | `threadId, senderId, messageId, timestamp, raw` |
| `quote` | Message quotes prior content | `threadId, senderId, messageId, timestamp, raw` |
| `link` | Message contains URL(s) | `threadId, senderId, messageId, timestamp, raw` |
| `location` | Location / map pin shared | `threadId, senderId, messageId, timestamp, raw` |
| `contact` | Contact card shared | `threadId, senderId, messageId, timestamp, raw` |
| `share` | External content shared | `threadId, senderId, messageId, timestamp, raw` |
| `story_reply` | Reply to a story | `threadId, senderId, messageId, timestamp, raw` |
| `message_edit` | Message was edited | `threadId, senderId, messageId, timestamp, raw` |
| `thread_mute` | Thread muted | `threadId, senderId, messageId, timestamp, raw` |
| `thread_unmute` | Thread unmuted | `threadId, senderId, messageId, timestamp, raw` |
| `friend_request` | Incoming friend request | `threadId, senderId, messageId, timestamp, raw` |
| `friend_accept` | Friend request accepted | `threadId, senderId, messageId, timestamp, raw` |
| `presence` | Online presence changed | `threadId, senderId, messageId, timestamp, raw` |
| `profile_update` | User profile updated | `threadId, senderId, messageId, timestamp, raw` |
| `encrypted_message` | E2EE encrypted message | `threadId, senderId, messageId, timestamp, raw` |
| `ephemeral` | Self-destructing message | `threadId, senderId, messageId, timestamp, raw` |
| `folder` | Thread moved between folders | `threadId, senderId, messageId, timestamp, raw` |
| `mark_read` | Thread marked read | `threadId, senderId, messageId, timestamp, raw` |
| `mark_unread` | Thread marked unread | `threadId, senderId, messageId, timestamp, raw` |
| `message_request` | Message in request inbox | `threadId, senderId, messageId, timestamp, raw` |
| `plugin_ready` | Plugin finished loading | `threadId, senderId, messageId, timestamp, raw` |
| `command_run` | Command executed | `threadId, senderId, messageId, timestamp, raw` |
| `ready` | API fully online | `threadId, senderId, messageId, timestamp, raw` |
| `error` | Unhandled error | `threadId, senderId, messageId, timestamp, raw` |
| `shutdown` | Shutdown initiated | `threadId, senderId, messageId, timestamp, raw` |
| `connected` | Platform connected | `threadId, senderId, messageId, timestamp, raw` |
| `disconnected` | Platform disconnected | `threadId, senderId, messageId, timestamp, raw` |
| `reconnect` | Reconnecting | `threadId, senderId, messageId, timestamp, raw` |
| `health_change` | Health status changed | `threadId, senderId, messageId, timestamp, raw` |
| `backup_complete` | Backup finished | `threadId, senderId, messageId, timestamp, raw` |

## Core Runtime API

These are the public methods on the main `KaishaAPI` class exported from `index.js`.

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `login` | Boot the runtime, initialize managers, load session data, and register plugins and commands. | `appState = {}` | Runtime result |
| `shutdown` | Shut down the runtime and tear down managers in reverse order. | `reason = 'manual'` | Runtime result |
| `getManagers` | Return a copy of the manager map. | — | Runtime result |
| `getUptime` | Return runtime uptime in milliseconds. | — | Runtime result |
| `isReady` | Check whether login finished and the connection manager reports an active connection. | — | Runtime result |
| `getCommand` | Resolve a command by name or alias. | `name` | Runtime result |
| `registerCommand` | Register a command and cache it in the runtime command map. | `command` | Runtime result |
| `runCommand` | Execute a command through CommandManager with the runtime API attached. | `name, ctx = {}` | Runtime result |
| `getPlugin` | Resolve a plugin by name. | `name` | Runtime result |
| `registerPlugin` | Register a plugin and cache it in the runtime plugin map. | `plugin, source = 'runtime'` | Runtime result |
| `emitEvent` | Emit a named event through EventManager. | `name, payload` | Runtime result |
| `sendText` | Send a text message through MessageManager. | `threadId, text, options` | Runtime result |
| `sendMessage` | Send a message payload through MessageManager. | `threadId, payload` | Runtime result |
| `reply` | Reply to a thread message through MessageManager. | `threadId, messageId, text` | Runtime result |
| `getHealthReport` | Return the HealthManager report object. | — | Runtime result |

## Public API Wrapper

`api/index.js` exposes a façade class with a much larger convenience surface. The tables below reflect the methods present in this source revision.

### Session / Auth

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `login` | Delegate to the runtime login flow. | `appState` | Promise of the manager result. |
| `shutdown` | Delegate to the runtime shutdown flow. | `reason` | Promise of the manager result. |
| `getAppState` | Read the current AppState from SessionManager. | — | Snapshot value. |
| `saveAppState` | Persist the current AppState to disk through SessionManager. | — | Promise of the manager result. |
| `restoreAppState` | Restore the AppState from disk through SessionManager. | — | Promise of the manager result. |
| `isReady` | Check runtime readiness. | — | Snapshot value. |
| `isConnected` | Check whether the connection manager is connected. | — | Snapshot value. |
| `reconnect` | Reconnect through ConnectionManager. | — | Promise of the manager result. |
| `getVersion` | Return the API version string. | — | Snapshot value. |
| `getUptime` | Return the runtime uptime in milliseconds. | — | Snapshot value. |

### Messaging

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `sendText` | Send a plain text message. | `threadId, text, opts` | Promise of the manager result. |
| `sendMessage` | Forward `payload.body` to `sendText`. | `threadId, payload` | Promise of the manager result. |
| `reply` | Send a reply with `replyTo` metadata. | `threadId, messageId, text` | Promise of the manager result. |
| `quoteReply` | Alias of `reply`. | `threadId, messageId, text` | Promise of the manager result. |
| `sendWithMentions` | Send text while attaching a mentions array. | `threadId, text, mentions` | Promise of the manager result. |
| `react` | Add a reaction to a stored message. | `messageId, emoji` | Promise of the manager result. |
| `removeReaction` | Clear a reaction by calling `react(messageId, '')` in this wrapper. | `messageId` | Promise of the manager result. |
| `unsend` | Delete a stored message. | `messageId` | Promise of the manager result. |
| `recall` | Alias of `unsend`. | `messageId` | Promise of the manager result. |
| `sendTyping` | Toggle a typing indicator. | `threadId, on` | Promise of the manager result. |
| `startTyping` | Alias of `sendTyping(threadId, true)`. | `threadId` | Promise of the manager result. |
| `stopTyping` | Alias of `sendTyping(threadId, false)`. | `threadId` | Promise of the manager result. |
| `markRead` | Mark a thread as read. | `threadId` | Promise of the manager result. |
| `markUnread` | Mark a thread as unread by unarchiving it. | `threadId` | Promise of the manager result. |
| `markThreadRead` | Alias of `markRead`. | `threadId` | Promise of the manager result. |
| `sendImage` | Send an image attachment. | `threadId, url, opts` | Promise of the manager result. |
| `sendImages` | Send multiple images in parallel. | `threadId, urls` | Promise of the manager result. |
| `sendVideo` | Send a video attachment. | `threadId, url, opts` | Promise of the manager result. |
| `sendAudio` | Send an audio attachment. | `threadId, url, opts` | Promise of the manager result. |
| `sendVoice` | Send a voice attachment. | `threadId, url, opts` | Promise of the manager result. |
| `sendSticker` | Send a sticker attachment. | `threadId, id` | Promise of the manager result. |
| `sendGif` | Send a GIF attachment. | `threadId, url` | Promise of the manager result. |
| `sendFile` | Send a file attachment. | `threadId, url, name` | Promise of the manager result. |
| `sendAttachment` | Send an attachment envelope through `sendText`. | `threadId, type, url, opts` | Promise of the manager result. |
| `sendDocument` | Alias of `sendFile`. | `threadId, url, name` | Promise of the manager result. |
| `sendPDF` | Alias of `sendFile`. | `threadId, url, name` | Promise of the manager result. |
| `sendZIP` | Alias of `sendFile`. | `threadId, url, name` | Promise of the manager result. |
| `sendPoll` | Send a poll payload. | `threadId, question, options` | Promise of the manager result. |
| `sendLocation` | Send a location payload. | `threadId, lat, lon, label` | Promise of the manager result. |
| `sendContact` | Send a contact payload. | `threadId, name, phones` | Promise of the manager result. |
| `forwardMessage` | Forward a message reference. | `threadId, messageId` | Promise of the manager result. |

### Thread

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `getThreadList` | Fetch thread records from ThreadManager. | `limit, offset` | Snapshot value. |
| `getThreadInfo` | Fetch a single thread record. | `threadId` | Snapshot value. |
| `getThreadHistory` | Fetch stored message history for a thread. | `threadId, limit, before` | Snapshot value. |
| `getMessages` | Alias of `getThreadHistory`. | `threadId, limit, before` | Snapshot value. |
| `searchMessages` | Search thread data through ThreadManager. | `query, opts` | Snapshot value. |
| `searchThreads` | Search thread data through ThreadManager. | `query` | Snapshot value. |
| `muteThread` | Set the thread mute timestamp. | `threadId, until` | Promise of the manager result. |
| `unmuteThread` | Clear the mute timestamp. | `threadId` | Promise of the manager result. |
| `pinMessage` | Pin a message in the thread. | `threadId, messageId` | Promise of the manager result. |
| `unpinMessage` | Unpin a message in the thread. | `threadId, messageId` | Promise of the manager result. |
| `archiveThread` | Archive a thread. | `threadId` | Promise of the manager result. |
| `unarchiveThread` | Unarchive a thread. | `threadId` | Promise of the manager result. |
| `deleteThread` | Currently archives the thread in this revision. | `threadId` | Promise of the manager result. |
| `getPinned` | Return pinned message IDs from the wrapper cache. | `threadId` | Snapshot value. |
| `getThreadPics` | Return cached thread photo data. | `threadId` | Snapshot value. |
| `getThreadTheme` | Return thread info so callers can read theme data. | `threadId` | Snapshot value. |
| `getThreadEmoji` | Return thread info so callers can read emoji data. | `threadId` | Snapshot value. |
| `getThreadAdmins` | Return the admins array from thread info. | `threadId` | Snapshot value. |

### User

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `getUserInfo` | Fetch a user profile from UserManager. | `userId` | Promise of the manager result. |
| `getCurrentUser` | Fetch the current user profile. | — | Snapshot value. |
| `getMe` | Alias of `getCurrentUser`. | — | Snapshot value. |
| `searchUsers` | Search cached user profiles. | `query, limit` | Promise of the manager result. |
| `getProfilePic` | Return the profile picture URL or cached value. | `userId, size` | Snapshot value. |
| `getAvatar` | Alias of `getProfilePic`. | `userId, size` | Snapshot value. |
| `getFriends` | Return cached friend records. | `limit` | Snapshot value. |
| `getFriendList` | Alias of `getFriends`. | `limit` | Snapshot value. |
| `getPresence` | Return cached presence records. | `userIds` | Snapshot value. |
| `isFriend` | Check whether the supplied user is in the friend list. | `userId` | Snapshot value. |
| `getUserThreads` | Filter the current thread list for threads containing the user. | `userId` | Snapshot value. |
| `blockUser` | Return a stub block result in this revision. | `userId` | Promise of the manager result. |
| `unblockUser` | Return a stub unblock result in this revision. | `userId` | Promise of the manager result. |

### Group

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `createGroup` | Create a group through GroupManager. | `name, userIds` | Promise of the manager result. |
| `addMembers` | Add one or more members to a group. | `threadId, userIds` | Promise of the manager result. |
| `addMember` | Alias of `addMembers` for a single user. | `threadId, userId` | Promise of the manager result. |
| `removeMember` | Remove a member from a group. | `threadId, userId` | Promise of the manager result. |
| `kickMember` | Alias of `removeMember`. | `threadId, userId` | Promise of the manager result. |
| `leaveGroup` | Leave a group. | `threadId` | Promise of the manager result. |
| `renameGroup` | Rename a group. | `threadId, title` | Promise of the manager result. |
| `setTitle` | Alias of `renameGroup`. | `threadId, title` | Promise of the manager result. |
| `setNickname` | Set a per-user nickname. | `threadId, userId, nickname` | Promise of the manager result. |
| `setGroupEmoji` | Set the group quick-reaction emoji. | `threadId, emoji` | Promise of the manager result. |
| `setGroupTheme` | Set the group theme value. | `threadId, theme` | Promise of the manager result. |
| `setGroupPhoto` | Set the group photo reference. | `threadId, source` | Promise of the manager result. |
| `setGroupImage` | Alias of `setGroupPhoto`. | `threadId, url` | Promise of the manager result. |
| `promoteAdmin` | Mark a member as admin. | `threadId, userId` | Promise of the manager result. |
| `demoteAdmin` | Remove admin status from a member. | `threadId, userId` | Promise of the manager result. |
| `getGroupInfo` | Fetch the cached group record. | `threadId` | Snapshot value. |
| `getParticipants` | Return the group members array. | `threadId` | Snapshot value. |
| `getMemberCount` | Return the number of group members. | `threadId` | Snapshot value. |

### Media / Upload / Download

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `upload` | Delegate to UploadManager. | `source, type` | Promise of the manager result. |
| `uploadImage` | Delegate to UploadManager.uploadImage. | `src` | Promise of the manager result. |
| `uploadVideo` | Delegate to UploadManager.uploadVideo. | `src` | Promise of the manager result. |
| `uploadAudio` | Delegate to UploadManager.uploadAudio. | `src` | Promise of the manager result. |
| `uploadFile` | Delegate to UploadManager.uploadFile. | `src` | Promise of the manager result. |
| `uploadBuffer` | Wrap a buffer into an upload descriptor. | `buf, name, type` | Promise of the manager result. |
| `uploadMany` | Upload several items at once. | `items` | Promise of the manager result. |
| `download` | Delegate to DownloadManager. | `url, filename` | Promise of the manager result. |
| `downloadToBuffer` | Convert a remote asset to a buffer. | `url` | Promise of the manager result. |
| `downloadMedia` | Download the attachment represented by a message object. | `attachment` | Promise of the manager result. |
| `downloadImage` | Alias of `downloadMedia`. | `att` | Promise of the manager result. |
| `downloadVideo` | Alias of `downloadMedia`. | `att` | Promise of the manager result. |
| `downloadAudio` | Alias of `downloadMedia`. | `att` | Promise of the manager result. |
| `getDownloadUrl` | Return `attachment.url` directly. | `attachment` | Promise of the manager result. |

### Events

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `on` | Register an event handler through EventManager. | `event, handler` | Chainable or status result. |
| `off` | Unregister an event handler through EventManager. | `event, handler` | Chainable or status result. |
| `once` | Register a one-time event handler. | `event, handler` | Chainable or status result. |
| `emit` | Emit an event through EventManager. | `event, payload` | Chainable or status result. |
| `onMessage` | Shortcut for `on('message', handler)`. | `h` | The same instance (`this`). |
| `onReply` | Shortcut for `on('reply', handler)`. | `h` | The same instance (`this`). |
| `onReaction` | Shortcut for `on('reaction', handler)`. | `h` | The same instance (`this`). |
| `onAny` | Shortcut for `on('*', handler)`. | `h` | The same instance (`this`). |

### Commands

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `registerCommand` | Register a command through CommandManager. | `cmd` | Chainable or status result. |
| `unregisterCommand` | Delete a command from the runtime command cache. | `name` | Chainable or status result. |
| `getCommand` | Resolve a command by name or alias. | `name` | Snapshot value. |
| `listCommands` | Return the loaded command list. | — | Snapshot value. |
| `runCommand` | Execute a command through CommandManager. | `name, ctx` | Promise of the manager result. |
| `hasCommand` | Check whether a command exists. | `name` | Snapshot value. |

### Plugins

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `loadPlugin` | Load plugin files from the supplied path through PluginManager. | `path` | Promise of the manager result. |
| `unloadPlugin` | Call the plugin lifecycle teardown and remove it from the cache. | `name` | Promise of the manager result. |
| `reloadPlugin` | Unload the plugin and load its file again. | `name` | Promise of the manager result. |
| `getPlugin` | Resolve a plugin by name. | `name` | Snapshot value. |
| `listPlugins` | Return the list of loaded plugin names. | — | Snapshot value. |
| `isPluginLoaded` | Check whether a plugin exists in the cache. | `name` | Promise of the manager result. |
| `reloadAllPlugins` | Unload all plugins and load the default plugins directory again. | — | Promise of the manager result. |

### Cache / DB / Config

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `cacheGet` | Read a cached value. | `k` | Promise of the manager result. |
| `cacheSet` | Write a cached value with an optional TTL. | `k, v, ttl` | Chainable or status result. |
| `cacheDel` | Delete a cached value. | `k` | Chainable or status result. |
| `cacheHas` | Check whether a cache key exists. | `k` | Chainable or status result. |
| `cacheClear` | Clear the cache. | — | Chainable or status result. |
| `dbGet` | Read a database value. | `k, d` | Snapshot value. |
| `dbSet` | Write a database value. | `k, v` | Promise of the manager result. |
| `dbUpdate` | Update a database value with a callback. | `k, fn` | Promise of the manager result. |
| `configGet` | Read a config value. | `k, d` | Snapshot value. |
| `configSet` | Write a config value. | `k, v` | Chainable or status result. |
| `getAllConfig` | Return the full merged config object. | — | Snapshot value. |
| `reloadConfig` | Reload the config file and env overrides. | — | Promise of the manager result. |

### Scheduler

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `cron` | Schedule an interval job from a cron-like expression. | `expr, fn, name` | Promise of the manager result. |
| `scheduleAfter` | Schedule a one-shot job after a delay. | `ms, fn, name` | Promise of the manager result. |
| `scheduleAt` | Schedule a one-shot job at a target date. | `date, fn, name` | Promise of the manager result. |
| `cancelJob` | Cancel a scheduled job by name. | `name` | Chainable or status result. |

### Metrics / Health / Logger

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `getMetrics` | Return the metrics snapshot. | — | Snapshot value. |
| `getHealth` | Return the health snapshot. | — | Snapshot value. |
| `counter` | Increment a counter metric. | `name, n` | Chainable or status result. |
| `gauge` | Set a gauge metric. | `name, v` | Chainable or status result. |
| `log` | Call a logger method by level. | `level, ...a` | Chainable or status result. |
| `logInfo` | Log at info level. | `...a` | Chainable or status result. |
| `logWarn` | Log at warn level. | `...a` | Chainable or status result. |
| `logError` | Log at error level. | `...a` | Chainable or status result. |

### Encryption

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `getEncryptionCaps` | Delegate to EncryptionManager capability detection. | — | Snapshot value. |
| `isEncryptedThread` | Check whether a thread is encrypted. | `threadId` | Promise of the manager result. |
| `encryptIfPossible` | Encrypt a payload when the manager supports it; otherwise return the original payload. | `threadId, payload` | Promise of the manager result. |
| `enableEncryption` | Update the runtime encryption flag in options. | `flag` | Chainable or status result. |
| `encryptionSupported` | Read the `e2eeSupported` capability flag. | — | Promise of the manager result. |
| `listEncryptedThreads` | Return the active encrypted thread list from the manager. | — | Snapshot value. |

### Backup / Maintenance

| Method | Description | Parameters | Returns |
| --- | --- | --- | --- |
| `createBackup` | Create a backup through BackupManager. | `label` | Promise of the manager result. |
| `listBackups` | Read the `backups` database key. | — | Snapshot value. |
| `restoreBackup` | Return a stub restore result in this revision. | `id` | Promise of the manager result. |
| `cleanup` | Clear the cache and return `{ ok: true }`. | — | Promise of the manager result. |

## Helpers and Utilities

`helpers/index.js` exports 125 helper utilities for media, parsing, messaging, thread/user handling, and general control flow. `utils/index.js` exports 98 general-purpose helpers for strings, numbers, dates, arrays, objects, crypto, files, and validation. Both modules also ship a `COUNT` constant.

## TypeScript Support

`types/index.d.ts` currently provides the following minimal interfaces:

```ts
// Kaisha Type Definitions
export interface AppStateCookie { key: string; value: string; }
export interface MessageContext { threadId: string; senderId: string; text: string; }
export interface CommandDefinition { name: string; run(ctx: any, api: any): Promise<any>; }
```

## Error Handling

The project uses a custom error hierarchy in `config/errors.js`: `KaishaError`, `ValidationError`, `ConfigurationError`, `NotFoundError`, `SecurityError`, `PluginError`, `CommandError`, and `ManagerError`.

Runtime code consistently wraps failure paths with `try/catch` blocks. Notable examples include:

- `handlers/error.js`, which logs the error, increments `errors.total`, and tries to send a warning back to the thread.
- `index.js`, which marks the core health state unhealthy, shuts managers down, and rethrows on login failure.
- `build.js` and `server.js`, which return structured errors when validation or packaging fails.

## Security

Security controls present in the repository include:

- Path-protection helpers in `utils/internal.js` that block `__proto__`, `prototype`, and `constructor` writes.
- `SecurityManager.safeJoin()`, which blocks path traversal.
- `SecurityManager.isSafeUrl()`, which only accepts `http:` and `https:` URLs.
- `LoggerManager`, which redacts error objects and limits log metadata capture.
- `PermissionManager`, which enforces `OWNER` and `ADMIN` permissions against `ownerIds` and runtime role data.
- `CooldownManager`, which rate-limits command execution per command/sender pair.
- The `eval` command sandbox, which uses `vm.Script`, a 1 second timeout, and a console stub.

## Performance

The codebase includes several practical performance choices:

- `CacheManager` uses TTL entries, periodic cleanup, and an entry cap.
- `LoggerManager` keeps a bounded in-memory buffer and writes structured JSON logs.
- `ThreadManager` caps stored thread history at 500 messages.
- `SchedulerManager` uses `unref()` timers so background jobs do not keep the process alive on their own.
- `build.js` filters the packaged file list and skips generated / local directories such as `dist`, `node_modules`, and `temp`.

## Testing

The test suite uses Node's built-in `node:test` runner. It covers:

- Runtime bootstrap and manager initialization.
- Command registration and command execution.
- Plugin loading and command registration from plugins.
- Lifecycle startup/shutdown behavior.
- Config path safety against prototype pollution.
- Helper image-dimension parsing.
- Script exports for linting and documentation generation.

Run it with:

```bash
npm test
```

## Scripts

| Script | Behavior |
| --- | --- |
| `npm start` | Run the distribution server in `server.js`. |
| `npm run dev` | Run the demo/runtime entry point in `index.js`. |
| `npm run build` | Validate the project and create `dist/kaisha-facebook-chat-api.zip`. |
| `npm test` | Execute the Node test suite. |
| `npm run lint` | Run syntax checks and console-usage checks. |
| `npm run docs` | Regenerate `docs/API.md` from the exported API surface. |

## Contributing

1. Fork the repository and create a feature branch.
2. Keep changes aligned with the existing manager / command / plugin layout.
3. Run `npm test`, `npm run lint`, and `npm run docs` before opening a pull request.
4. Update the README or generated docs when you add public API surface.

## License

This project is licensed under the MIT License. See `LICENSE` for the full text.

## Author

| Field | Value |
| --- | --- |
| Developer | Aldwin Padronia |
| GitHub | https://github.com/kzen1419-droid |
| Facebook | https://www.facebook.com/share/14mu8NouLzi/ |
| Instagram | https://www.instagram.com/kaiz3n_nnn |

## Notes

Some modules in `managers/` are intentionally minimal shells in this revision. The README only documents behavior that is actually visible in the source
