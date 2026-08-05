'use strict';

const path = require('path');
const { EventEmitter } = require('events');
const constants = require('./config/constants');
const { ValidationError } = require('./config/errors');
const { deepMerge, cloneDeep } = require('./utils/internal');

const ConfigManager = require('./managers/ConfigManager');
const LoggerManager = require('./managers/LoggerManager');
const MetricsManager = require('./managers/MetricsManager');
const HealthManager = require('./managers/HealthManager');

function toPropName(name) {
  return name.charAt(0).toLowerCase() + name.slice(1);
}

function resolveProjectPath(input, fallback) {
  const value = input || fallback;
  return path.isAbsolute(value) ? value : path.resolve(constants.rootDir, value);
}

const MANAGER_DEPENDENCIES = Object.freeze({
  ConfigManager: [],
  LoggerManager: ['configManager'],
  ValidationManager: ['configManager'],
  SecurityManager: ['configManager'],
  MetricsManager: ['loggerManager'],
  HealthManager: ['metricsManager'],
  MemoryManager: ['loggerManager', 'metricsManager'],
  CacheManager: ['loggerManager', 'metricsManager'],
  DatabaseManager: ['configManager', 'loggerManager', 'validationManager', 'securityManager'],
  SessionManager: ['configManager', 'validationManager', 'loggerManager'],
  LoginManager: ['sessionManager', 'validationManager', 'loggerManager'],
  ConnectionManager: ['loggerManager', 'metricsManager'],
  MessageManager: ['connectionManager', 'validationManager', 'loggerManager', 'threadManager'],
  ThreadManager: ['validationManager', 'loggerManager'],
  UserManager: ['validationManager', 'loggerManager'],
  GroupManager: ['threadManager', 'validationManager', 'loggerManager'],
  PermissionManager: ['configManager', 'validationManager'],
  CooldownManager: ['cacheManager', 'loggerManager'],
  QueueManager: ['loggerManager'],
  EventManager: ['metricsManager', 'loggerManager'],
  CommandManager: ['validationManager', 'loggerManager', 'permissionManager', 'cooldownManager'],
  PluginManager: ['commandManager', 'loggerManager'],
  SchedulerManager: ['loggerManager', 'validationManager'],
  BackupManager: ['loggerManager', 'validationManager'],
  RecoveryManager: ['backupManager', 'databaseManager'],
  StorageManager: ['securityManager', 'loggerManager'],
  FileManager: ['securityManager', 'validationManager'],
  UploadManager: ['validationManager', 'securityManager'],
  DownloadManager: ['validationManager', 'securityManager'],
  NetworkManager: ['securityManager', 'validationManager'],
  EncryptionManager: ['validationManager', 'securityManager'],
  LanguageManager: ['configManager'],
  StatisticsManager: ['metricsManager'],
  UpdateManager: ['networkManager', 'loggerManager'],
  UtilityManager: ['validationManager'],
  AttachmentManager: ['validationManager', 'securityManager']
});

class KaishaAPI extends EventEmitter {
  constructor(options = {}) {
    super();

    if (!options || typeof options !== 'object' || Array.isArray(options)) {
      throw new ValidationError('options must be an object');
    }

    this.version = constants.version;
    this._startTime = Date.now();
    this._initialized = false;
    this._shuttingDown = false;
    this._managers = new Map();
    this._plugins = new Map();
    this._commands = new Map();
    this._events = new Map();

    this._configBootstrap = new ConfigManager({
      rootDir: constants.rootDir,
      configPath: constants.defaultConfigPath
    });
    this._configBootstrap.reload();

    const defaultOptions = this._configBootstrap.getAll();
    this.options = deepMerge(cloneDeep(defaultOptions), cloneDeep(options));

    this.loggerManager = new LoggerManager({ options: this.options });
    this.logger = this.loggerManager;
    this.metricsManager = new MetricsManager(this);
    this.metrics = this.metricsManager;
    this.healthManager = new HealthManager(this);
    this.health = this.healthManager;

    this._createManagers();
    this._validateManagerDependencies();
  }

  _createManagers() {
    const managerPath = path.join(__dirname, 'managers');

    for (const name of constants.managerOrder) {
      let instance;
      if (name === 'ConfigManager') instance = this._configBootstrap;
      else if (name === 'LoggerManager') instance = this.loggerManager;
      else if (name === 'MetricsManager') instance = this.metricsManager;
      else if (name === 'HealthManager') instance = this.healthManager;
      else {
        const ManagerClass = require(path.join(managerPath, `${name}.js`));
        instance = new ManagerClass(this);
      }

      const key = toPropName(name);
      this._managers.set(name, instance);
      this[key] = instance;

      if (key === 'configManager') this.config = instance;
      if (key === 'loggerManager') this.logger = instance;
      if (key === 'metricsManager') this.metrics = instance;
      if (key === 'healthManager') this.health = instance;
    }

    this.loggerManager.info(`Initialized ${this._managers.size} managers`, { module: 'core' });
  }

  _validateManagerDependencies() {
    for (const [managerName, dependencies] of Object.entries(MANAGER_DEPENDENCIES)) {
      for (const dependency of dependencies) {
        if (!this[dependency]) {
          throw new ValidationError(`Missing manager dependency: ${managerName} -> ${dependency}`, {
            manager: managerName,
            dependency
          });
        }
      }
    }
  }

  async _initializeManagers() {
    for (const [name, manager] of this._managers.entries()) {
      if (typeof manager?.init === 'function') {
        await manager.init();
      }
      this.loggerManager.debug(`Manager ready: ${name}`, { module: 'core' });
    }
  }

  async _shutdownManagers() {
    const entries = [...this._managers.entries()].reverse();
    for (const [name, manager] of entries) {
      if (!manager) continue;
      try {
        if (typeof manager.shutdown === 'function') {
          await manager.shutdown();
        } else if (typeof manager.stop === 'function') {
          await manager.stop();
        } else if (typeof manager.unloadAll === 'function') {
          await manager.unloadAll();
        }
      } catch (error) {
        this.loggerManager.warn(`Shutdown step failed: ${name}`, { module: 'core', error });
      }
    }
  }

  async login(appState = {}) {
    if (this._initialized) {
      throw new ValidationError('Kaisha runtime is already initialized');
    }

    const timer = this.metricsManager.startTimer('login_duration_ms');
    try {
      this.loggerManager.info('Starting Kaisha runtime', { module: 'core' });

      await this._initializeManagers();

      if (appState && (Array.isArray(appState) || typeof appState === 'object')) {
        await this.sessionManager.load(appState);
      }

      await this.loginManager.authenticate();
      await this.connectionManager.connect({ appStateLoaded: !!appState });
      await this.databaseManager.connect();
      await this.cacheManager.init();
      await this.eventManager.start();
      await this.schedulerManager.start();

      const pluginsDir = resolveProjectPath(this.options?.plugins?.directory, path.join(constants.rootDir, 'plugins'));
      const commandsDir = resolveProjectPath(this.options?.commands?.directory, path.join(constants.rootDir, 'commands'));

      if (this.options?.plugins?.autoLoad !== false) {
        await this.loadPlugins(pluginsDir);
      }
      await this.loadCommands(commandsDir);

      this._initialized = true;
      this.healthManager.markHealthy('core', { version: this.version });
      this.emit('ready', this);

      const elapsed = timer.end();
      this.loggerManager.info(`Ready in ${elapsed.toFixed(0)}ms`, {
        module: 'core',
        plugins: this._plugins.size,
        commands: this._commands.size
      });

      return this;
    } catch (error) {
      timer.end();
      this._initialized = false;
      this.healthManager.markUnhealthy('core', error.message);
      await this._shutdownManagers();
      this.loggerManager.fatal('Login failed', { module: 'core', error });
      this.emit('error', error);
      throw error;
    }
  }

  async shutdown(reason = 'manual') {
    if (this._shuttingDown) return;
    this._shuttingDown = true;

    this.loggerManager.warn(`Shutdown initiated: ${reason}`, { module: 'core' });
    this.emit('shutdown', reason);

    try {
      await this._shutdownManagers();
      try {
        await this.backupManager?.create?.(`shutdown-${reason}`, {
          uptimeMs: this.getUptime(),
          reason,
          health: this.getHealthReport()
        });
      } catch (error) {
        this.loggerManager.warn('Shutdown backup failed', { module: 'core', error });
      }
      await this.loggerManager.flush();
    } finally {
      this._initialized = false;
      this._shuttingDown = false;
      this.healthManager.markHealthy('core', { state: 'stopped' });
      this.removeAllListeners();
      this.loggerManager.info('Shutdown complete', { module: 'core' });
    }
  }

  getManagers() {
    return new Map(this._managers);
  }

  getUptime() {
    return Date.now() - this._startTime;
  }

  isReady() {
    return this._initialized && !!this.connectionManager?.isConnected?.();
  }

  getCommand(name) {
    return this.commandManager?.resolve?.(name) || null;
  }

  registerCommand(command) {
    const registered = this.commandManager?.register?.(command);
    if (registered) this._commands.set(registered.name, registered);
    return registered;
  }

  async runCommand(name, ctx = {}) {
    return this.commandManager?.run?.(name, { ...ctx, api: this });
  }

  async loadCommands(dir = path.join(constants.rootDir, 'commands')) {
    const loaded = await this.commandManager?.loadAll?.(dir);
    for (const command of this.commandManager?.list?.() || []) {
      this._commands.set(command.name, command);
    }
    return loaded;
  }

  getPlugin(name) {
    return this.pluginManager?.get?.(name) || null;
  }

  registerPlugin(plugin, source = 'runtime') {
    const registered = this.pluginManager?.register?.(plugin, source);
    if (registered) this._plugins.set(registered.name, registered);
    return registered;
  }

  async loadPlugins(dir = path.join(constants.rootDir, 'plugins')) {
    const loaded = await this.pluginManager?.loadAll?.(dir);
    for (const plugin of this.pluginManager?.list?.() || []) {
      this._plugins.set(plugin.name, plugin);
    }
    return loaded;
  }

  async emitEvent(name, payload) {
    await this.eventManager?.emitEvent?.(name, payload);
    return true;
  }

  async sendText(threadId, text, options) {
    return this.messageManager?.sendText?.(threadId, text, options);
  }

  async sendMessage(threadId, payload) {
    return this.messageManager?.sendMessage?.(threadId, payload);
  }

  async reply(threadId, messageId, text) {
    return this.messageManager?.reply?.(threadId, messageId, text);
  }

  async getHealthReport() {
    return this.healthManager?.report?.() || {};
  }
}

module.exports = KaishaAPI;
module.exports.KaishaAPI = KaishaAPI;
module.exports.default = KaishaAPI;
module.exports.create = (opts) => new KaishaAPI(opts);
module.exports.utils = require('./utils');
module.exports.helpers = require('./helpers');
module.exports.Constants = require('./config/constants');
module.exports.Errors = require('./config/errors');

if (require.main === module) {
  const api = new KaishaAPI();

  const shutdown = async (signal) => {
    try {
      await api.shutdown(signal);
    } finally {
      process.exit(0);
    }
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('uncaughtException', async (error) => {
    api.loggerManager.fatal('Uncaught exception', { module: 'core', error });
    try {
      await api.shutdown('uncaughtException');
    } finally {
      process.exit(1);
    }
  });
  process.once('unhandledRejection', async (reason) => {
    api.loggerManager.fatal('Unhandled rejection', { module: 'core', error: reason instanceof Error ? reason : new Error(String(reason)) });
    try {
      await api.shutdown('unhandledRejection');
    } finally {
      process.exit(1);
    }
  });

  api.login({ demo: true }).then(() => {
    api.loggerManager.info('Kaisha API demo started', { module: 'core' });
  }).catch(error => {
    api.loggerManager.error('Failed to start demo runtime', { module: 'core', error });
    process.exitCode = 1;
  });
}
