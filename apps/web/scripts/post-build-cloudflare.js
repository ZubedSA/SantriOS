const fs = require('fs');
const path = require('path');

const openNextDir = path.resolve(__dirname, '..', '.open-next');
const assetsDir = path.join(openNextDir, 'assets');
const workerSrc = path.join(openNextDir, 'worker.js');
const workerDest = path.join(openNextDir, '_worker.js');
const routesJsonPath = path.join(openNextDir, '_routes.json');

console.log('[post-build-cloudflare] Running post-build steps...');

// 1. Rename worker.js -> _worker.js for Cloudflare Pages Advanced Mode
if (fs.existsSync(workerSrc)) {
  fs.renameSync(workerSrc, workerDest);
  console.log('[post-build-cloudflare] Renamed worker.js -> _worker.js');
} else if (fs.existsSync(workerDest)) {
  console.log('[post-build-cloudflare] _worker.js already exists');
} else {
  console.warn('[post-build-cloudflare] Warning: worker.js not found');
}

// 2. Copy all static assets from .open-next/assets to .open-next root
// Cloudflare Pages expects static files (like /_next/static/...) at the root of pages_build_output_dir
if (fs.existsSync(assetsDir)) {
  fs.cpSync(assetsDir, openNextDir, { recursive: true });
  console.log('[post-build-cloudflare] Copied assets/* to .open-next root for CDN serving');
} else {
  console.warn('[post-build-cloudflare] Warning: assets dir not found');
}

// 3. Create _routes.json to route static assets directly through Cloudflare CDN
// This prevents _worker.js from intercepting static CSS/JS, making them load instantly
const routesConfig = {
  version: 1,
  include: ['/*'],
  exclude: ['/_next/*', '/favicon.ico']
};

fs.writeFileSync(routesJsonPath, JSON.stringify(routesConfig, null, 2), 'utf-8');
console.log('[post-build-cloudflare] Created _routes.json with static asset exclusions');

console.log('[post-build-cloudflare] Done!');
