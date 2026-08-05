'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs', 'API.md');

function generateDocs() {
  const api = require('../index');
  const methods = Object.getOwnPropertyNames(api.prototype || {})
    .filter(name => name !== 'constructor' && typeof api.prototype[name] === 'function')
    .sort();

  const lines = [
    '# Kaisha Facebook Chat API',
    '',
    '## Public Methods',
    '',
    ...methods.map(name => `- \`${name}\``),
    '',
    '## Runtime Notes',
    '',
    '- `npm start` launches the distribution server.',
    '- `npm run dev` boots the local runtime entry point.',
    '- `npm run build` creates a ZIP archive in `dist/`.'
  ];

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, lines.join('\n') + '\n');
  process.stdout.write(`Generated ${path.relative(ROOT, OUT)}\n`);
  return OUT;
}

if (require.main === module) {
  generateDocs();
}

module.exports = { generateDocs };
