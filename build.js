'use strict';

/**
 * Production build and ZIP packaging.
 * No external dependencies are required.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const LoggerManager = require('./managers/LoggerManager');
const constants = require('./config/constants');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const OUTPUT = path.join(DIST, 'kaisha-facebook-chat-api.zip');

const logger = new LoggerManager({ options: { logger: { level: 'info' } } });

const EXCLUDES = new Set([
  '.git',
  '.github',
  'dist',
  'node_modules',
  'logs',
  'cache',
  'temp',
  '.env'
]);

function walkFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(full, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function validateStructure() {
  const required = [
    'index.js',
    'package.json',
    'server.js',
    'build.js',
    'managers',
    'plugins',
    'events',
    'api',
    'utils',
    'helpers',
    'middleware',
    'commands',
    'config'
  ];

  const missing = required.filter(item => !fs.existsSync(path.join(ROOT, item)));
  if (missing.length) {
    throw new Error(`Missing required project items: ${missing.join(', ')}`);
  }
}

function validateModules() {
  const files = walkFiles(ROOT).filter(file => file.endsWith('.js'));
  let count = 0;
  for (const file of files) {
    const result = spawnSync(process.execPath, ['--check', file], {
      cwd: ROOT,
      encoding: 'utf8'
    });
    if (result.status !== 0) {
      throw new Error(`Syntax check failed for ${path.relative(ROOT, file)}: ${result.stderr || result.stdout}`);
    }
    count += 1;
  }
  return count;
}

function findPython() {
  const candidates = [process.env.PYTHON, 'python3', 'python'].filter(Boolean);
  for (const command of candidates) {
    const result = spawnSync(command, ['--version'], { encoding: 'utf8' });
    if (result.status === 0) return command;
  }
  return null;
}

function createZipWithPython(files) {
  fs.mkdirSync(DIST, { recursive: true });
  const python = findPython();
  if (!python) {
    throw new Error('Python is required to package the ZIP file but was not found');
  }

  const payload = {
    root: ROOT,
    output: OUTPUT,
    files: files.map(file => path.relative(ROOT, file))
  };

  const script = `
import json, os, pathlib, sys, zipfile
payload = json.loads(sys.stdin.read())
root = pathlib.Path(payload["root"])
output = pathlib.Path(payload["output"])
files = payload["files"]
output.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as zf:
    for rel in files:
        abs_path = root / rel
        if abs_path.is_file():
            zf.write(abs_path, rel)
print(output)
`;

  const result = spawnSync(python, ['-c', script], {
    input: JSON.stringify(payload),
    cwd: ROOT,
    encoding: 'utf8'
  });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || 'ZIP creation failed');
  }

  return OUTPUT;
}

async function buildProject() {
  logger.info('Starting production build', { module: 'build' });
  validateStructure();
  const parsed = validateModules();
  const files = walkFiles(ROOT);
  const output = createZipWithPython(files);

  const sizeMB = (fs.statSync(output).size / 1048576).toFixed(2);
  logger.info(`Build complete: ${path.relative(ROOT, output)} (${sizeMB} MB)`, {
    module: 'build',
    files: parsed
  });

  return { output, files: parsed, sizeMB };
}

if (require.main === module) {
  buildProject().catch(error => {
    logger.error('Build failed', { module: 'build', error });
    process.exitCode = 1;
  });
}

module.exports = { buildProject };
