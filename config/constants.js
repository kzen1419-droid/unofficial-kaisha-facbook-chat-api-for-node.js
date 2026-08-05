'use strict';

/**
 * Shared project constants.
 * @module config/constants
 */

const path = require('path');

const PROJECT = Object.freeze({
  name: 'kaisha-facebook-chat-api',
  displayName: 'Kaisha Facebook Chat API',
  version: '1.0.0',
  developer: 'Aldwin Padronia',
  author: 'Aldwin Padronia',
  creator: 'Aldwin Padronia'
});

const MANAGER_ORDER = Object.freeze([
  'ConfigManager',
  'LoggerManager',
  'ValidationManager',
  'SecurityManager',
  'MetricsManager',
  'HealthManager',
  'MemoryManager',
  'CacheManager',
  'DatabaseManager',
  'SessionManager',
  'LoginManager',
  'ConnectionManager',
  'MessageManager',
  'ThreadManager',
  'UserManager',
  'GroupManager',
  'PermissionManager',
  'CooldownManager',
  'QueueManager',
  'EventManager',
  'CommandManager',
  'PluginManager',
  'SchedulerManager',
  'BackupManager',
  'RecoveryManager',
  'StorageManager',
  'FileManager',
  'UploadManager',
  'DownloadManager',
  'NetworkManager',
  'EncryptionManager',
  'LanguageManager',
  'StatisticsManager',
  'UpdateManager',
  'UtilityManager',
  'AttachmentManager'
]);

module.exports = Object.freeze({
  ...PROJECT,
  rootDir: path.resolve(__dirname, '..'),
  defaultConfigPath: path.join(__dirname, 'default.json'),
  defaultDatabasePath: path.join(__dirname, '..', 'database', 'db.json'),
  defaultSessionPath: path.join(__dirname, '..', 'database', 'session.json'),
  defaultBackupDir: path.join(__dirname, '..', 'temp', 'backups'),
  managerOrder: MANAGER_ORDER,
  http: Object.freeze({
    port: 3000,
    timeoutMs: 30_000
  }),
  validation: Object.freeze({
    maxStringLength: 10_000,
    maxJsonDepth: 20
  })
});
