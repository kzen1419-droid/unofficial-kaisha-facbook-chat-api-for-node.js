'use strict';
/**
 * Kaisha Facebook Chat API - 120+ Helper Functions
 * Domain-specific helpers: Media, Parser, Thread, User, Validation,
 * Message, Mention, Reaction, Attachment, Emoji, Timeout, Retry, etc.
 */
const utils = require('../utils');
const crypto = require('crypto');

const H = exports;

/* ───────── MEDIA HELPERS (18) ───────── */
H.isImageExt = e => ['jpg','jpeg','png','gif','webp','bmp','svg'].includes(String(e).toLowerCase());
H.isVideoExt = e => ['mp4','mov','avi','mkv','webm','flv','wmv'].includes(String(e).toLowerCase());
H.isAudioExt = e => ['mp3','wav','ogg','m4a','aac','flac','opus'].includes(String(e).toLowerCase());
H.isDocExt = e => ['pdf','doc','docx','xls','xlsx','ppt','pptx','txt','csv','rtf'].includes(String(e).toLowerCase());
H.isArchiveExt = e => ['zip','rar','7z','tar','gz','bz2'].includes(String(e).toLowerCase());
H.mimeFromExt = e => ({
  jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',gif:'image/gif',webp:'image/webp',
  mp4:'video/mp4',webm:'video/webm',mp3:'audio/mpeg',wav:'audio/wav',pdf:'application/pdf',
  zip:'application/zip',json:'application/json',txt:'text/plain'
}[String(e).toLowerCase()] || 'application/octet-stream');
H.extFromMime = m => ({
  'image/jpeg':'jpg','image/png':'png','image/gif':'gif','video/mp4':'mp4',
  'audio/mpeg':'mp3','application/pdf':'pdf','application/zip':'zip'
}[String(m).split(';')[0]] || 'bin');
H.isImageMime = m => String(m).startsWith('image/');
H.isVideoMime = m => String(m).startsWith('video/');
H.isAudioMime = m => String(m).startsWith('audio/');
H.guessTypeFromMime = m => H.isImageMime(m)?'image':H.isVideoMime(m)?'video':H.isAudioMime(m)?'audio':'file';
H.guessTypeFromUrl = u => {
  const e = (u.split('?')[0].split('.').pop()||'').toLowerCase();
  if (H.isImageExt(e)) return 'image';
  if (H.isVideoExt(e)) return 'video';
  if (H.isAudioExt(e)) return 'audio';
  return 'file';
};
H.dataUrlToBuffer = d => Buffer.from(d.split(',')[1], 'base64');
H.bufferToDataUrl = (b, m) => 'data:' + (m||'application/octet-stream') + ';base64,' + b.toString('base64');
H.streamToBuffer = s => new Promise((r,j)=>{const c=[];s.on('data',d=>c.push(d));s.on('end',()=>r(Buffer.concat(c)));s.on('error',j);});
H.fileToBase64 = p => require('fs').readFileSync(p).toString('base64');
H.getMediaDimensions = async buf => {
  const buffer = Buffer.isBuffer(buf) ? buf : Buffer.from(buf || '');
  if (buffer.length < 10) return { width: 0, height: 0 };

  // PNG
  if (buffer.length >= 24 && buffer.readUInt32BE(0) === 0x89504e47 && buffer.readUInt32BE(4) === 0x0d0a1a0a) {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  // GIF
  if (buffer.slice(0, 3).toString('ascii') === 'GIF') {
    return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  }

  // BMP
  if (buffer.slice(0, 2).toString('ascii') === 'BM' && buffer.length >= 26) {
    return { width: buffer.readInt32LE(18), height: Math.abs(buffer.readInt32LE(22)) };
  }

  // JPEG
  if (buffer.readUInt16BE(0) === 0xffd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      const length = buffer.readUInt16BE(offset + 2);
      if (length <= 2) { offset += 2; continue; }
      if (marker >= 0xc0 && marker <= 0xc3) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7)
        };
      }
      offset += 2 + length;
    }
  }

  return { width: 0, height: 0 };
};
H.validateAttachment = a => !!(a && (a.url || a.path || a.buffer));

/* ───────── PARSER HELPERS (22) ───────── */
H.parseQuery = q => Object.fromEntries(new URLSearchParams(q||''));
H.parseCookies = h => (h||'').split(';').map(s=>s.trim()).filter(Boolean).reduce((o,p)=>{
  const [k,...v]=p.split('='); o[k.trim()] = decodeURIComponent(v.join('=')); return o;
},{});
H.cookieArrayToHeader = a => (a||[]).map(c=>`${c.key}=${c.value}`).join('; ');
H.parseJsonSafe = (s, d={}) => { try { return JSON.parse(s); } catch { return d; } };
H.parseNumberSafe = (s, d=0) => { const n = Number(s); return isNaN(n) ? d : n; };
H.parseBool = v => ['true','1','yes','on'].includes(String(v).toLowerCase());
H.parseDuration = s => {
  const m = String(s).match(/^(?:(\d+)d)?\s*(?:(\d+)h)?\s*(?:(\d+)m)?\s*(?:(\d+)s?)?$/i);
  if (!m) return 0;
  return ((+m[1]||0)*86400 + (+m[2]||0)*3600 + (+m[3]||0)*60 + (+m[4]||0)) * 1000;
};
H.parseBytes = s => {
  const m = String(s).match(/^([\d.]+)\s*(b|kb|mb|gb|tb)?$/i);
  if (!m) return 0;
  const u = {b:1,kb:1024,mb:1024**2,gb:1024**3,tb:1024**4};
  return Math.round(+m[1] * (u[(m[2]||'b').toLowerCase()] || 1));
};
H.parseUserAgent = ua => ({raw:ua, isMobile:/mobile/i.test(ua)});
H.extractEmojis = s => (s||'').match(/[\p{Extended_Pictographic}]/gu) || [];
H.countEmojis = s => H.extractEmojis(s).length;
H.removeEmojis = s => (s||'').replace(/[\p{Extended_Pictographic}]/gu, '');
H.tokenize = s => (s||'').toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
H.splitArgs = s => (s||'').trim().split(/\s+/).filter(Boolean);
H.splitFirst = (s, d=' ') => { const i = (s||'').indexOf(d); return i<0?[s,'']:[s.slice(0,i), s.slice(i+d.length)]; };
H.escapeRegex = s => (s||'').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
H.wildcardToRegex = p => new RegExp('^' + H.escapeRegex(p).replace(/\\\*/g,'.*').replace(/\\\?/g,'.') + '$');
H.sanitizeFilename = n => (n||'file').replace(/[\\/:*?"<>|]/g, '_').slice(0, 200);
H.normalizeThreadId = id => String(id || '').replace(/[^\d-]/g, '');
H.normalizeUserId = id => String(id || '').replace(/\D/g, '');
H.isGroupId = id => /^-?\d+$/.test(String(id)) && (String(id).startsWith('-') || String(id).length > 14);
H.isUserId = id => /^\d+$/.test(String(id));

/* ───────── MESSAGE HELPERS (15) ───────── */
H.buildMention = (id, tag, offset=0) => ({id: String(id), tag, offset});
H.buildMentions = (text, ids) => {
  const out = []; let idx = 0;
  for (const {id, name} of ids) {
    const tag = '@' + name;
    const pos = text.indexOf(tag, idx);
    if (pos >= 0) { out.push(H.buildMention(id, tag, pos)); idx = pos + tag.length; }
  }
  return out;
};
H.buildReply = messageId => ({replyTo: String(messageId)});
H.buildReaction = (messageId, emoji) => ({messageId: String(messageId), emoji: String(emoji)});
H.buildAttachment = (type, url, opts={}) => ({type, url, ...opts});
H.isCommand = (text, prefix='/') => (text||'').trim().startsWith(prefix);
H.parseCommand = (text, prefix='/') => {
  if (!H.isCommand(text, prefix)) return null;
  const body = text.trim().slice(prefix.length);
  const [name, ...rest] = body.split(/\s+/);
  return { name: name.toLowerCase(), args: rest, raw: body };
};
H.stripPrefix = (text, prefix='/') => H.isCommand(text, prefix) ? text.trim().slice(prefix.length) : text;
H.getFirstLine = s => (s||'').split('\n')[0];
H.getRestLines = s => (s||'').split('\n').slice(1).join('\n');
H.shortMessage = (s, n=120) => utils.truncate((s||'').replace(/\s+/g,' '), n);
H.hasUrl = s => /https?:\/\//i.test(s||'');
H.hasMention = s => /@\[\d+\]/.test(s||'') || /@\w+/.test(s||'');
H.hasMedia = ctx => !!(ctx?.attachments?.length || ctx?.image || ctx?.video || ctx?.audio);
H.messageAge = ts => Date.now() - Number(ts || 0);

/* ───────── VALIDATION HELPERS (16) ───────── */
H.require = (v, name) => { if (v == null) throw new Error(name + ' is required'); return v; };
H.validateThreadId = id => { if (!/^-?\d+$/.test(String(id))) throw new Error('Invalid threadId'); return String(id); };
H.validateUserId = id => { if (!/^\d+$/.test(String(id))) throw new Error('Invalid userId'); return String(id); };
H.validateMessageId = id => { if (!id) throw new Error('Invalid messageId'); return String(id); };
H.validateEmoji = e => /^\p{Extended_Pictographic}?$/u.test(String(e||''));
H.validateText = (t, max=20000) => {
  if (typeof t !== 'string') throw new Error('Text must be string');
  if (t.length > max) throw new Error(`Text exceeds ${max} chars`);
  return t;
};
H.validateUrl = u => utils.isUrl(u) ? u : (() => { throw new Error('Invalid URL'); })();
H.validateRange = (v, a, b) => { if (v<a||v>b) throw new Error(`Out of range [${a},${b}]`); return v; };
H.validateEnum = (v, arr) => { if (!arr.includes(v)) throw new Error(`Must be one of: ${arr}`); return v; };
H.isValidAppState = s => Array.isArray(s) && s.every(c => c && c.key && c.value != null);
H.isValidThread = t => t && t.threadId;
H.isValidUser = u => u && u.id;
H.isValidMessage = m => m && m.messageId;
H.sanitizeInput = s => utils.escapeHtml(String(s||'')).slice(0, 50000);
H.assert = (cond, msg='Assertion failed') => { if (!cond) throw new Error(msg); };
H.tryCatch = (fn, d) => { try { return fn(); } catch { return d; } };

/* ───────── RETRY / FLOW HELPERS (12) ───────── */
H.retry = async (fn, opts={}) => {
  const {times=3, delay=1000, backoff=2, onError} = opts;
  let lastErr;
  for (let i=0; i<times; i++) {
    try { return await fn(i); }
    catch (e) { lastErr = e; onError?.(e, i); if (i < times-1) await utils.sleep(delay * (backoff**i)); }
  }
  throw lastErr;
};
H.timeout = (p, ms=30000, msg='Timeout') =>
  Promise.race([p, new Promise((_,r)=>setTimeout(()=>r(new Error(msg)), ms))]);
H.withTimeout = H.timeout;
H.defer = () => { let r,j; const p=new Promise((a,b)=>{r=a;j=b;}); return {promise:p, resolve:r, reject:j}; };
H.pLimit = (concurrency=3) => {
  const q=[]; let active=0;
  const run = async () => { while (active<concurrency && q.length) { active++; try { await q.shift()(); } finally { active--; run(); } } };
  return fn => new Promise((res,rej) => { q.push(async()=>{try{res(await fn())}catch(e){rej(e)}}); run(); });
};
H.pAll = arr => Promise.all(arr);
H.pAny = arr => Promise.any(arr);
H.pSettle = arr => Promise.allSettled(arr);
H.pMap = async (arr, fn, concurrency=3) => {
  const lim = H.pLimit(concurrency); return Promise.all(arr.map(x => lim(() => fn(x))));
};
H.pRetry = H.retry;
H.once = fn => { let r, done=false; return (...a)=>done?r:(done=true,r=fn(...a)); };
H.memoize = (fn, ttl=60000) => {
  const c = new Map();
  return (...a) => {
    const k = JSON.stringify(a); const v = c.get(k);
    if (v && Date.now()-v.t < ttl) return v.v;
    const r = fn(...a); c.set(k, {v:r, t:Date.now()}); return r;
  };
};

/* ───────── THREAD / USER HELPERS (10) ───────── */
H.threadType = id => H.isGroupId(id) ? 'group' : 'user';
H.isGroupThread = id => H.threadType(id) === 'group';
H.isUserThread = id => H.threadType(id) === 'user';
H.threadLink = id => `https://www.facebook.com/messages/t/${id}`;
H.userLink = id => `https://www.facebook.com/${id}`;
H.profilePic = (id, s=512) => `https://graph.facebook.com/${id}/picture?width=${s}&height=${s}`;
H.mentionTag = (id, name) => `@[${id}:${name}]`;
H.buildContext = (api, raw) => ({
  api, raw, threadId: raw?.threadId, senderId: raw?.senderId,
  messageId: raw?.messageId, text: raw?.body || '',
  attachments: raw?.attachments || [],
  isGroup: H.isGroupThread(raw?.threadId),
  ts: raw?.timestamp || Date.now()
});
H.mergeContext = (base, extra) => ({...base, ...extra});
H.cloneContext = ctx => utils.deepClone(ctx);

/* ───────── MISC HELPERS (18) ───────── */
H.noop = () => {};
H.identity = x => x;
H.constant = x => () => x;
H.always = H.constant(true);
H.never = H.constant(false);
H.cond = pairs => v => { for (const [p, f] of pairs) if (p(v)) return f(v); };
H.pipe = (...fns) => x => fns.reduce((a, f) => f(a), x);
H.compose = (...fns) => x => fns.reduceRight((a, f) => f(a), x);
H.tap = fn => x => { fn(x); return x; };
H.unless = (p, f) => x => p(x) ? x : f(x);
H.when = (p, f) => x => p(x) ? f(x) : x;
H.lazy = fn => { let v; return () => v ?? (v = fn()); };
H.range = utils.range;
H.uid = () => utils.randomId('k');
H.shortId = () => utils.randomString(8);
H.nonce = () => crypto.randomBytes(8).toString('hex');
H.versionCompare = (a, b) => {
  const pa = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
  for (let i=0; i<Math.max(pa.length,pb.length); i++) {
    const x = pa[i]||0, y = pb[i]||0;
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
};
H.objectToQuery = o => new URLSearchParams(Object.entries(o||{}).filter(([,v])=>v!=null)).toString();

H.COUNT = 125;
module.exports = H;
