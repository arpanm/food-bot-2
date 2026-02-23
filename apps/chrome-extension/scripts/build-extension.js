const fs = require('fs');
const path = require('path');
const dist = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });
fs.copyFileSync(path.join(__dirname, '..', 'manifest.json'), path.join(dist, 'manifest.json'));
