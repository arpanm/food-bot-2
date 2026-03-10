const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });

// Copy popup HTML to dist (popup.js is emitted by tsc from src/popup.ts)
fs.copyFileSync(path.join(root, 'src', 'popup.html'), path.join(dist, 'popup.html'));

const manifestPath = path.join(root, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
// Paths in dist manifest must be relative to dist (no dist/ prefix)
manifest.background = { service_worker: 'background.js' };
manifest.content_scripts = [{ matches: ['<all_urls>'], js: ['content.js'], run_at: 'document_idle' }];
manifest.action = { default_popup: 'popup.html', default_title: 'Food Bot Workflow Executor' };
fs.writeFileSync(path.join(dist, 'manifest.json'), JSON.stringify(manifest, null, 2));
