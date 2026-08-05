'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const EXCLUDES = new Set(['dist', 'node_modules', '.git', 'logs', 'cache', 'temp']);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

function runLint() {
  let failures = 0;
  const files = walk(ROOT);

  for (const file of files) {
    const check = spawnSync(process.execPath, ['--check', file], {
      cwd: ROOT,
      encoding: 'utf8'
    });
    if (check.status !== 0) {
      failures += 1;
      process.stderr.write(`Syntax error in ${path.relative(ROOT, file)}\n${check.stderr || check.stdout}\n`);
    }
  }

  const forbidden = [];
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    if (/console\.(log|warn|error)\s*\(/.test(text) && !file.endsWith(path.join('scripts', 'lint.js'))) {
      forbidden.push(path.relative(ROOT, file));
    }
  }
  if (forbidden.length) {
    process.stderr.write(`Console usage found in: ${forbidden.join(', ')}\n`);
    failures += 1;
  }

  if (failures) {
    process.exitCode = 1;
  } else {
    process.stdout.write(`Lint passed for ${files.length} JavaScript files.\n`);
  }

  return { files, failures };
}

if (require.main === module) {
  runLint();
}

module.exports = { runLint, walk };
