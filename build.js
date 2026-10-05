// ==============================================================================
// Yggdrasil (ygg) - esbuild Bundler Script (Outputs Standalone dist/worker.js)
// ==============================================================================

import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';

async function build() {
  console.log('📦 Starting Yggdrasil Worker build with esbuild...');

  const outdir = path.resolve('dist');
  if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir, { recursive: true });
  }

  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'dist/worker.js',
    format: 'esm',
    target: 'esnext',
    platform: 'browser',
    minify: true,
    sourcemap: false,
    external: ['cloudflare:*'],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  });

  // 同时输出 dist/_worker.js 以兼容 Cloudflare Pages Advanced Mode
  fs.copyFileSync('dist/worker.js', 'dist/_worker.js');

  const stats = fs.statSync('dist/worker.js');
  console.log(`✅ Build completed successfully!`);
  console.log(`📁 Output files: dist/worker.js & dist/_worker.js (${(stats.size / 1024).toFixed(2)} KB)`);
  console.log(`💡 Cloudflare Workers 使用 dist/worker.js，Cloudflare Pages 使用 dist/_worker.js。`);
}

build().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
