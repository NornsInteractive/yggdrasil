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

  const stats = fs.statSync('dist/worker.js');
  console.log(`✅ Build completed successfully!`);
  console.log(`📁 Output file: dist/worker.js (${(stats.size / 1024).toFixed(2)} KB)`);
  console.log(`💡 You can directly copy the contents of dist/worker.js and paste it into Cloudflare Worker Web Editor to deploy.`);
}

build().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
