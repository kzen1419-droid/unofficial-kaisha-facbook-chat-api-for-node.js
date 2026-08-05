'use strict';

const PROTECTED_KEYS = new Set(['__proto__', 'prototype', 'constructor']);

function isPlainObject(value) {
  if (!value || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function cloneDeep(value) {
  if (value === undefined) return undefined;
  if (typeof global.structuredClone === 'function') {
    try {
      return global.structuredClone(value);
    } catch {
      // Fall through to JSON clone.
    }
  }

  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

function splitPath(pathExpression) {
  if (pathExpression === undefined || pathExpression === null || pathExpression === '') return [];
  return String(pathExpression)
    .split('.')
    .map(part => part.trim())
    .filter(Boolean);
}

function isSafePathSegment(segment) {
  const normalized = String(segment || '');
  return normalized.length > 0 && !PROTECTED_KEYS.has(normalized) && /^[A-Za-z0-9_-]+$/.test(normalized);
}

function safeGet(object, pathExpression, fallback) {
  if (!pathExpression) return object;
  const parts = splitPath(pathExpression);
  let cursor = object;

  for (const part of parts) {
    if (!isPlainObject(cursor) && !Array.isArray(cursor)) return fallback;
    if (!Object.prototype.hasOwnProperty.call(cursor, part)) return fallback;
    cursor = cursor[part];
  }

  return cursor === undefined ? fallback : cursor;
}

function safeSet(object, pathExpression, value) {
  if (!isPlainObject(object) && !Array.isArray(object)) {
    throw new TypeError('safeSet requires an object target');
  }

  const parts = splitPath(pathExpression);
  if (!parts.length) throw new TypeError('pathExpression is required');

  let cursor = object;
  while (parts.length > 1) {
    const part = parts.shift();
    if (!isSafePathSegment(part)) throw new TypeError(`Unsafe path segment: ${part}`);
    if (!Object.prototype.hasOwnProperty.call(cursor, part) || !isPlainObject(cursor[part])) {
      cursor[part] = {};
    }
    cursor = cursor[part];
  }

  const last = parts[0];
  if (!isSafePathSegment(last)) throw new TypeError(`Unsafe path segment: ${last}`);
  cursor[last] = value;
  return object;
}

function safeDelete(object, pathExpression) {
  if (!object || typeof object !== 'object') return false;
  const parts = splitPath(pathExpression);
  if (!parts.length) return false;

  let cursor = object;
  while (parts.length > 1) {
    const part = parts.shift();
    if (!Object.prototype.hasOwnProperty.call(cursor, part)) return false;
    cursor = cursor[part];
    if (!cursor || typeof cursor !== 'object') return false;
  }

  return delete cursor[parts[0]];
}

function deepMerge(target, source) {
  if (!isPlainObject(target) && !Array.isArray(target)) return cloneDeep(source);
  if (!source || typeof source !== 'object') return target;

  for (const [key, value] of Object.entries(source)) {
    if (PROTECTED_KEYS.has(key)) continue;

    if (Array.isArray(value)) {
      target[key] = cloneDeep(value);
      continue;
    }

    if (isPlainObject(value)) {
      if (!isPlainObject(target[key])) target[key] = {};
      deepMerge(target[key], value);
      continue;
    }

    target[key] = value;
  }

  return target;
}

function toFiniteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value.slice();
  if (value === undefined || value === null) return [];
  return [value];
}

module.exports = {
  cloneDeep,
  deepMerge,
  isPlainObject,
  normalizeArray,
  safeDelete,
  safeGet,
  safeSet,
  splitPath,
  toFiniteNumber,
  isSafePathSegment
};
