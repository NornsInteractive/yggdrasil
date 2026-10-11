// ==============================================================================
// Yggdrasil (ygg) - esbuild Bundler Script (Outputs dist/worker.js & dist/mcp-server.js)
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

  // 1. 构建 Cloudflare Worker / Pages 产物
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
  console.log(`✅ Worker build completed successfully!`);
  console.log(`📁 Output files: dist/worker.js & dist/_worker.js (${(stats.size / 1024).toFixed(2)} KB)`);

  // 2. 构建独立 MCP STDIO 协议服务 CLI 产物 (供 Cursor, Claude Desktop, Antigravity, Cline 等调用)
  console.log('📦 Starting Yggdrasil MCP Stdio Server CLI build...');
  await esbuild.build({
    entryPoints: ['src/mcp/cli.ts'],
    bundle: true,
    outfile: 'dist/mcp-server.js',
    format: 'esm',
    target: 'node18',
    platform: 'node',
    banner: {
      js: '#!/usr/bin/env node\n',
    },
    minify: false,
    sourcemap: false,
  });

  try {
    fs.chmodSync('dist/mcp-server.js', 0o755);
  } catch (e) {}

  const mcpStats = fs.statSync('dist/mcp-server.js');
  console.log(`✅ MCP Server build completed successfully!`);
  console.log(`📁 Output file: dist/mcp-server.js (${(mcpStats.size / 1024).toFixed(2)} KB)`);
  console.log(`💡 Cloudflare Workers 使用 dist/worker.js，Cloudflare Pages 使用 dist/_worker.js，AI 客户端使用 dist/mcp-server.js。`);
}

build().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
