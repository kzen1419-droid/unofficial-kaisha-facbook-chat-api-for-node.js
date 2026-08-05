'use strict';

const BaseManager = require('./BaseManager');
const { ValidationError } = require('../config/errors');

function parseInterval(expression) {
  const parts = String(expression || '').trim().split(/\s+/);
  const first = parts[0] || '';
  const seconds = first.match(/^\*\/(\d+)$/);
  if (seconds) return Math.max(1000, Number(seconds[1]) * 1000);
  const minutes = first.match(/^(\d+)$/);
  if (minutes) return Math.max(60_000, Number(minutes[1]) * 60_000);
  return 60_000;
}

class SchedulerManager extends BaseManager {
  constructor(api) {
    super(api, 'SchedulerManager');
    this._jobs = new Map();
    this._tasks = this._jobs;
  }

  async start() {
    this._ready = true;
    return this;
  }

  async stop() {
    for (const job of this._jobs.values()) {
      if (job.timer) clearInterval(job.timer);
      if (job.timeout) clearTimeout(job.timeout);
    }
    this._jobs.clear();
    this._ready = false;
  }

  async shutdown() {
    await this.stop();
    await super.shutdown();
  }

  schedule(name, fn, intervalMs) {
    if (typeof fn !== 'function') throw new ValidationError('Scheduled job must be a function');
    const key = String(name);
    this.cancelJob(key);
    const timer = setInterval(() => {
      Promise.resolve()
        .then(() => fn())
        .catch(error => this._log('error', `scheduled job failed: ${key}`, { error }));
    }, Math.max(1000, Number(intervalMs) || 1000));
    timer.unref?.();
    const job = {
      type: 'interval',
      timer,
      stop: () => this.cancelJob(key)
    };
    this._jobs.set(key, job);
    return key;
  }

  after(ms, fn, name = `job_${Date.now()}`) {
    if (typeof fn !== 'function') throw new ValidationError('Scheduled task must be a function');
    const key = String(name);
    this.cancelJob(key);
    const timeout = setTimeout(() => {
      Promise.resolve()
        .then(() => fn())
        .catch(error => this._log('error', `scheduled task failed: ${key}`, { error }))
        .finally(() => this._jobs.delete(key));
    }, Math.max(0, Number(ms) || 0));
    timeout.unref?.();
    const job = {
      type: 'timeout',
      timeout,
      stop: () => this.cancelJob(key)
    };
    this._jobs.set(key, job);
    return key;
  }

  cron(expression, fn, name = `cron_${Date.now()}`) {
    return this.schedule(name, fn, parseInterval(expression));
  }

  once(name, fn, delayMs) {
    return this.after(delayMs, fn, name);
  }

  cancelJob(name) {
    const key = String(name);
    const job = this._jobs.get(key);
    if (!job) return false;
    if (job.timer) clearInterval(job.timer);
    if (job.timeout) clearTimeout(job.timeout);
    return this._jobs.delete(key);
  }

  list() {
    return [...this._jobs.entries()].map(([name, job]) => ({ name, type: job.type }));
  }
}

module.exports = SchedulerManager;
module.exports.SchedulerManager = SchedulerManager;
module.exports.default = SchedulerManager;
