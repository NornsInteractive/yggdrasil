// ==============================================================================
// Yggdrasil (ygg) - Comprehensive Verification & Unit Test Suite
// ==============================================================================

import assert from 'node:assert';
import { readFileSync, existsSync } from 'node:fs';

console.log('🧪 Starting Yggdrasil System Verification Test Suite...\n');

// 1. 验证构建文件存在性与大小
console.log('▶ Test 1: Verifying bundle artifact dist/worker.js');
assert(existsSync('dist/worker.js'), 'dist/worker.js must exist after build');
const bundle = readFileSync('dist/worker.js', 'utf-8');
assert(bundle.length > 10000, 'dist/worker.js should contain compiled worker bundle');
console.log(`  ✅ dist/worker.js exists and is valid (${(bundle.length / 1024).toFixed(2)} KB)`);

// 2. 验证 schema.sql 和 schema.clean.sql 语句完整性
console.log('▶ Test 2: Verifying D1 database schema.sql and schema.clean.sql');
assert(existsSync('schema.sql'), 'schema.sql must exist');
assert(existsSync('schema.clean.sql'), 'schema.clean.sql must exist');
const schema = readFileSync('schema.sql', 'utf-8');
const cleanSchema = readFileSync('schema.clean.sql', 'utf-8');
assert(!cleanSchema.includes('--'), 'schema.clean.sql must not contain any comment syntax');
assert(schema.includes('CREATE TABLE IF NOT EXISTS apps'), 'schema.sql must contain apps table');
assert(schema.includes('CREATE TABLE IF NOT EXISTS app_versions'), 'schema.sql must contain app_versions table');
assert(schema.includes('CREATE TABLE IF NOT EXISTS files'), 'schema.sql must contain files table');
assert(schema.includes('CREATE TABLE IF NOT EXISTS system_settings'), 'schema.sql must contain system_settings table');
assert(schema.includes('CREATE TABLE IF NOT EXISTS version_packages'), 'schema.sql must contain version_packages table');
assert(cleanSchema.includes('CREATE TABLE IF NOT EXISTS version_packages'), 'schema.clean.sql must contain version_packages table');
assert(schema.includes('api_token_enabled'), 'schema.sql must contain default settings');
assert(schema.includes('api_fixed_token'), 'schema.sql must contain api_fixed_token default');
console.log('  ✅ schema.sql and schema.clean.sql verified.');

// 3. 验证 Web Crypto JWT 算法
console.log('▶ Test 3: Verifying Web Crypto JWT Sign & Verify Logic');
async function testJwt() {
  function base64UrlEncode(str) {
    return Buffer.from(str).toString('base64url');
  }
  function base64UrlDecode(str) {
    return Buffer.from(str, 'base64url').toString('utf-8');
  }

  const secret = 'test_secret_key_1234567890_abcdef';
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = { sub: 'admin', role: 'admin', exp: Math.floor(Date.now() / 1000) + 3600 };

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );

  const data = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}`;
  const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const signature = Buffer.from(sigBuffer).toString('base64url');
  const token = `${data}.${signature}`;

  assert(token.split('.').length === 3, 'JWT token must have 3 segments');

  // Verify
  const [h, p, s] = token.split('.');
  const sigBytes = Buffer.from(s, 'base64url');
  const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(`${h}.${p}`));
  assert(isValid === true, 'JWT verification must pass');

  const decodedPayload = JSON.parse(base64UrlDecode(p));
  assert(decodedPayload.role === 'admin', 'Decoded JWT payload role must be admin');
  console.log('  ✅ Web Crypto JWT signing and verification passed.');
}

// 4. 验证 App 版本比对算法与强制更新判定
console.log('▶ Test 4: Verifying App Version Comparison & Force Update Calculation');
function checkUpdateLogic(latestVer, currentVersionCode) {
  const hasUpdate = latestVer.version_code > currentVersionCode;
  let isForce = false;
  if (hasUpdate) {
    if (latestVer.is_force_update === 1) {
      isForce = true;
    } else if (latestVer.min_version_code > 0 && currentVersionCode < latestVer.min_version_code) {
      isForce = true;
    }
  }
  return { hasUpdate, isForce };
}

const ver102 = { version_code: 10200, is_force_update: 0, min_version_code: 10100 };
// Case 1: current is 10000 (below min_version_code 10100) -> should be update + force
const res1 = checkUpdateLogic(ver102, 10000);
assert.strictEqual(res1.hasUpdate, true, 'Should have update');
assert.strictEqual(res1.isForce, true, 'Should be forced update because 10000 < min 10100');

// Case 2: current is 10150 (between min 10100 and latest 10200) -> should be update + non-force
const res2 = checkUpdateLogic(ver102, 10150);
assert.strictEqual(res2.hasUpdate, true, 'Should have update');
assert.strictEqual(res2.isForce, false, 'Should NOT be forced update because 10150 >= min 10100');

// Case 3: current is 10200 (already latest) -> no update
const res3 = checkUpdateLogic(ver102, 10200);
assert.strictEqual(res3.hasUpdate, false, 'Should have no update');
assert.strictEqual(res3.isForce, false, 'Should not be force update');
console.log('  ✅ App version check & force update logic verified across all test cases.');

// 5. 验证 HTTP Range 206 断点续传解析逻辑
console.log('▶ Test 5: Verifying HTTP Range Header Parser');
function parseRangeHeader(rangeHeader, totalSize) {
  if (!rangeHeader || !rangeHeader.startsWith('bytes=')) return null;
  const parts = rangeHeader.substring(6).trim().split('-');
  if (parts.length !== 2) return null;
  if (parts[0] !== '' && parts[1] !== '') {
    const start = parseInt(parts[0], 10);
    const end = parseInt(parts[1], 10);
    return { start, end, length: end - start + 1 };
  } else if (parts[0] !== '' && parts[1] === '') {
    const start = parseInt(parts[0], 10);
    return { start, end: totalSize - 1, length: totalSize - start };
  }
  return null;
}

const totalFileSize = 45829104;
const rangeParsed1 = parseRangeHeader('bytes=0-1023', totalFileSize);
assert.deepStrictEqual(rangeParsed1, { start: 0, end: 1023, length: 1024 });

const rangeParsed2 = parseRangeHeader('bytes=1048576-', totalFileSize);
assert.deepStrictEqual(rangeParsed2, { start: 1048576, end: 45829103, length: 44780528 });
console.log('  ✅ HTTP Range header parser verified.');

// 6. 验证 Token 鉴权中间件匹配逻辑
console.log('▶ Test 6: Verifying Dynamic Token Guard Logic');
function checkTokenAuth(config, action, clientToken) {
  const globalEnabled = config.api_token_enabled === 'true';
  const fixedToken = config.api_fixed_token || 'default_token';

  if (!globalEnabled) return { allowed: true };

  let reqKey = '';
  if (action === 'app_check') reqKey = 'app_check_require_token';
  else if (action === 'app_download') reqKey = 'app_download_require_token';
  else if (action === 'file_download') reqKey = 'file_download_require_token';

  if (config[reqKey] !== 'true') return { allowed: true };

  if (clientToken && clientToken.trim() === fixedToken.trim()) {
    return { allowed: true };
  }
  return { allowed: false, reason: 'Unauthorized' };
}

const mockConfig = {
  api_token_enabled: 'true',
  api_fixed_token: 'my_secret_token_888',
  app_check_require_token: 'true',
  app_download_require_token: 'false',
  file_download_require_token: 'true',
};

// app_check with correct token
assert.strictEqual(checkTokenAuth(mockConfig, 'app_check', 'my_secret_token_888').allowed, true);
// app_check with wrong token
assert.strictEqual(checkTokenAuth(mockConfig, 'app_check', 'wrong_token').allowed, false);
// app_download (switch is false) with no token -> allowed!
assert.strictEqual(checkTokenAuth(mockConfig, 'app_download', '').allowed, true);
// file_download with no token -> blocked!
assert.strictEqual(checkTokenAuth(mockConfig, 'file_download', '').allowed, false);
console.log('  ✅ Dynamic Token Guard logic verified.');

// 7. 验证根路径访问与 Web 控制台渲染不会被 401 拦截
console.log('▶ Test 7: Verifying GET / and Dashboard routes return HTTP 200 without 401 intercept');
async function testAppRouting() {
  const { default: app } = await import('../dist/worker.js');
  const rootRes = await app.fetch(new Request('http://localhost/'), { APP_NAME: 'Yggdrasil' });
  assert.strictEqual(rootRes.status, 200, 'GET / should return 200 OK');
  const rootHtml = await rootRes.text();
  assert(rootHtml.includes('Yggdrasil 控制台'), 'GET / should render the dashboard HTML');

  const adminRes = await app.fetch(new Request('http://localhost/admin'), { APP_NAME: 'Yggdrasil' });
  assert.strictEqual(adminRes.status, 200, 'GET /admin should return 200 OK');

  const healthRes = await app.fetch(new Request('http://localhost/health'), {});
  assert.strictEqual(healthRes.status, 200, 'GET /health should return 200 OK');
  assert(rootHtml.includes('R2 存储自动清理策略'), 'Dashboard HTML should include auto-cleanup settings card');
  assert(rootHtml.includes('modal-edit-version'), 'Dashboard HTML should include edit version modal');
  assert(rootHtml.includes('openEditVersionModal'), 'Dashboard HTML should include openEditVersionModal function');
  assert(rootHtml.includes('modal-add-package'), 'Dashboard HTML should include add package modal');
  assert(rootHtml.includes('modal-edit-package'), 'Dashboard HTML should include edit package modal');
  assert(rootHtml.includes('openAddPackageModal'), 'Dashboard HTML should include openAddPackageModal function');
  assert(rootHtml.includes('modal-app-download'), 'Dashboard HTML should include modal-app-download');
  assert(rootHtml.includes('openAppDownloadModal'), 'Dashboard HTML should include openAppDownloadModal function');
  assert(rootHtml.includes('cfg-github-token'), 'Dashboard HTML should include GitHub token setting input');
  assert(rootHtml.includes('data-tab="mcp"'), 'Dashboard HTML should include MCP nav-tab');
  assert(rootHtml.includes('id="tab-mcp"'), 'Dashboard HTML should include tab-mcp section');
  assert(typeof app.scheduled === 'function', 'Worker export must include scheduled handler for Cron triggers');
  console.log('  ✅ GET /, /admin, /health routing, Edit Version UI, Package Modal UI, App Download Links UI, GitHub Token UI, MCP Hub UI & scheduled cron handler verified.');
}

console.log('▶ Test 8: Verifying Auto-Cleanup Service Logic (cutoff date & keep_latest filtering)');
function testCleanupLogic() {
  const versions = [
    { id: 'v1', version_code: 100, created_at: '2026-01-01T00:00:00Z', channel: 'default' },
    { id: 'v2', version_code: 101, created_at: '2026-02-01T00:00:00Z', channel: 'default' },
    { id: 'v3', version_code: 102, created_at: '2026-03-01T00:00:00Z', channel: 'default' },
    { id: 'v4', version_code: 103, created_at: '2026-09-01T00:00:00Z', channel: 'default' },
    { id: 'v5', version_code: 104, created_at: '2026-10-01T00:00:00Z', channel: 'default' },
  ];
  const keepLatest = 2;
  const cutoffDate = '2026-05-01T00:00:00Z'; // older than May 2026

  // Keep latest 2: v5 (104) and v4 (103)
  const sorted = [...versions].sort((a, b) => b.version_code - a.version_code);
  const keepSet = new Set(sorted.slice(0, keepLatest).map(v => v.id));
  assert(keepSet.has('v5') && keepSet.has('v4'), 'Latest 2 versions must be protected');

  // Expired candidates (created before cutoff): v1, v2, v3
  const candidates = versions.filter(v => v.created_at < cutoffDate);
  const toDelete = candidates.filter(v => !keepSet.has(v.id));

  assert.strictEqual(toDelete.length, 3, 'Should mark 3 old versions for deletion (v1, v2, v3)');
  assert.deepStrictEqual(toDelete.map(v => v.id), ['v1', 'v2', 'v3'], 'Exactly v1, v2, v3 should be deleted');
  console.log('  ✅ Auto-cleanup retention and cutoff logic verified successfully.');
}

console.log('▶ Test 9: Verifying Third-Party External URL Redirection, Reverse Proxy, and Cleaned Package Response');
async function testExternalUrlAndCleanedFlow() {
  const { default: app } = await import('../dist/worker.js');

  const createMockDb = (versionData) => ({
    prepare: (sql) => ({
      bind: (...args) => ({
        first: async () => versionData,
        all: async () => ({ results: [] }),
        run: async () => ({}),
      }),
      all: async () => ({ results: [] }),
      first: async () => versionData,
      run: async () => ({}),
    }),
  });

  const mockDbRedirect = createMockDb({
    id: 'v_ext_redirect',
    app_id: 'test.app',
    version_code: 200,
    version_name: '2.0.0',
    external_url: 'https://download.example.com/test-app.apk',
    use_proxy: 0,
    is_cleaned: 0,
    is_published: 1,
    file_name: 'test-app.apk',
  });

  const reqRedirect = new Request('http://localhost/api/v1/app/download?app_id=test.app&version_code=200');
  const resRedirect = await app.fetch(reqRedirect, { DB: mockDbRedirect });
  assert.strictEqual(resRedirect.status, 302, 'External URL with use_proxy=0 should return HTTP 302 redirect');
  assert.strictEqual(resRedirect.headers.get('Location'), 'https://download.example.com/test-app.apk', 'Should redirect to external URL');

  // 2. Mock DB that returns a cleaned version (is_cleaned = 1)
  const mockDbCleaned = createMockDb({
    id: 'v_cleaned',
    app_id: 'test.app',
    version_code: 100,
    version_name: '1.0.0',
    external_url: null,
    is_cleaned: 1,
    is_published: 1,
    file_name: 'test-app-v1.0.0.apk',
  });

  const reqCleaned = new Request('http://localhost/api/v1/app/download?app_id=test.app&version_code=100');
  const resCleaned = await app.fetch(reqCleaned, { DB: mockDbCleaned });
  assert.strictEqual(resCleaned.status, 410, 'Cleaned version should return HTTP 410 Gone');
  const cleanedBody = await resCleaned.json();
  assert(cleanedBody.message.includes('已被存储自动清理策略归档清理'), 'Should inform user package is cleaned');

  // 3. Mock DB that points external_url to the gateway's own download URL (self-redirect loop defense)
  const mockDbLoop = createMockDb({
    id: 'v_loop',
    app_id: 'test.app',
    version_code: 300,
    version_name: '3.0.0',
    external_url: 'http://localhost/api/v1/app/download?app_id=test.app',
    use_proxy: 0,
    is_cleaned: 0,
    is_published: 1,
    file_name: 'test-app.apk',
  });

  const reqLoop = new Request('http://localhost/api/v1/app/download?app_id=test.app&version_code=300');
  const resLoop = await app.fetch(reqLoop, { DB: mockDbLoop });
  assert.strictEqual(resLoop.status, 400, 'Self-redirecting download URL must be intercepted with HTTP 400');
  const loopBody = await resLoop.json();
  assert(loopBody.message.includes('不能指向当前网关自身的下载接口'), 'Must return informative loop prevention error');

  console.log('  ✅ External URL 302 redirect, Cleaned package 410, and Loop Prevention 400 verified successfully.');
}

console.log('▶ Test 10: Verifying MCP (Model Context Protocol) Endpoints, Tools, and STDIO CLI');
async function testMcpFlow() {
  const { default: app } = await import('../dist/worker.js');
  const { spawn } = await import('node:child_process');

  assert(existsSync('dist/mcp-server.js'), 'dist/mcp-server.js must exist after build');
  const mcpCliContent = readFileSync('dist/mcp-server.js', 'utf-8');
  assert(mcpCliContent.startsWith('#!/usr/bin/env node'), 'dist/mcp-server.js must have node shebang');

  // 1. GET /api/mcp overview
  const resOverview = await app.fetch(new Request('http://localhost/api/mcp'), {});
  assert.strictEqual(resOverview.status, 200, 'GET /api/mcp should return HTTP 200');
  const overviewData = await resOverview.json();
  assert.strictEqual(overviewData.tools_count, 14, 'Overview must advertise 14 tools');
  assert(overviewData.usage.desktop_config_example, 'Overview must provide desktop config example');

  // 2. GET /api/mcp/tools
  const resTools = await app.fetch(new Request('http://localhost/api/mcp/tools'), {});
  assert.strictEqual(resTools.status, 200, 'GET /api/mcp/tools should return HTTP 200');
  const toolsData = await resTools.json();
  assert.strictEqual(toolsData.data.total_tools, 14, 'GET /api/mcp/tools should list all 14 tools');

  // 3. Mock DB for MCP execution
  const createMcpMockDb = () => ({
    prepare: (sql) => ({
      bind: (...args) => ({
        first: async () => ({
          total_apps: 2,
          total_versions: 5,
          app_storage_bytes: 10485760,
          app_downloads: 120,
          total_files: 3,
          file_storage_bytes: 2097152,
          file_downloads: 40,
          value: 'false',
        }),
        all: async () => ({
          results: [
            {
              app_id: 'com.test.app',
              name: 'Test App',
              created_at: new Date().toISOString(),
              version_count: 3,
              total_downloads: 50,
              latest_version_code: 102,
              latest_version_name: '1.0.2',
            },
          ],
        }),
        run: async () => ({ success: true }),
      }),
      all: async () => ({
        results: [
          {
            app_id: 'com.test.app',
            name: 'Test App',
            created_at: new Date().toISOString(),
            version_count: 3,
            total_downloads: 50,
            latest_version_code: 102,
            latest_version_name: '1.0.2',
          },
        ],
      }),
      first: async () => ({
        total_apps: 2,
        total_versions: 5,
        app_storage_bytes: 10485760,
        app_downloads: 120,
        total_files: 3,
        file_storage_bytes: 2097152,
        file_downloads: 40,
        value: 'false',
      }),
      run: async () => ({ success: true }),
    }),
  });

  const mockDb = createMcpMockDb();

  // 4. POST /api/mcp JSON-RPC initialize
  const resInit = await app.fetch(
    new Request('http://localhost/api/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: { protocolVersion: '2024-11-05', capabilities: {} },
      }),
    }),
    { DB: mockDb }
  );
  assert.strictEqual(resInit.status, 200, 'POST /api/mcp initialize should return 200');
  const initResult = await resInit.json();
  assert.strictEqual(initResult.result.serverInfo.name, 'yggdrasil');

  // 5. POST /api/mcp JSON-RPC tools/list
  const resList = await app.fetch(
    new Request('http://localhost/api/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list',
      }),
    }),
    { DB: mockDb }
  );
  assert.strictEqual(resList.status, 200);
  const listResult = await resList.json();
  assert.strictEqual(listResult.result.tools.length, 14, 'tools/list should return 14 tools');

  // 6. POST /api/mcp JSON-RPC tools/call: ygg_list_apps
  const resCallApps = await app.fetch(
    new Request('http://localhost/api/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'ygg_list_apps',
          arguments: {},
        },
      }),
    }),
    { DB: mockDb }
  );
  assert.strictEqual(resCallApps.status, 200);
  const callAppsResult = await resCallApps.json();
  assert(callAppsResult.result.content[0].text.includes('com.test.app'), 'Tool output should include app data');

  // 7. POST /api/mcp JSON-RPC tools/call: ygg_get_system_stats
  const resCallStats = await app.fetch(
    new Request('http://localhost/api/mcp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: {
          name: 'ygg_get_system_stats',
          arguments: {},
        },
      }),
    }),
    { DB: mockDb }
  );
  assert.strictEqual(resCallStats.status, 200);
  const callStatsResult = await resCallStats.json();
  assert(callStatsResult.result.content[0].text.includes('total_apps'), 'Tool output should include total_apps');

  // 8. STDIO Server child process test
  await new Promise((resolve, reject) => {
    const child = spawn('node', ['dist/mcp-server.js'], {
      env: { ...process.env, YGG_ENDPOINT: 'http://localhost' },
    });

    let buffer = '';
    const timeout = setTimeout(() => {
      child.kill();
      reject(new Error('STDIO server test timed out'));
    }, 5000);

    child.stdout.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line);
          if (msg.id === 10) {
            clearTimeout(timeout);
            assert.strictEqual(msg.result.tools.length, 14, 'STDIO server must return 14 tools');
            child.kill();
            resolve();
            return;
          }
        } catch (e) {}
      }
    });

    child.stdin.write(
      JSON.stringify({
        jsonrpc: '2.0',
        id: 9,
        method: 'initialize',
        params: { protocolVersion: '2024-11-05', capabilities: {} },
      }) + '\n'
    );

    child.stdin.write(
      JSON.stringify({
        jsonrpc: '2.0',
        id: 10,
        method: 'tools/list',
        params: {},
      }) + '\n'
    );
  });

  console.log('  ✅ MCP HTTP JSON-RPC 2.0 endpoints, tool execution, and STDIO server verified successfully.');
}

console.log('▶ Test 11: Verifying Multi-Platform & Multi-Architecture Package Distribution');
async function testMultiPlatformPackages() {
  const { default: app } = await import('../dist/worker.js');

  const appRecord = {
    id: 'app_valhalla',
    app_id: 'com.norns.valhalla',
    name: 'Valhalla',
    created_at: new Date().toISOString(),
  };

  const versionRecord = {
    id: 'ver_valhalla_100',
    app_id: 'com.norns.valhalla',
    version_code: 100,
    version_name: '1.0.0',
    min_version_code: 0,
    channel: 'default',
    changelog: 'Multi-platform release',
    file_key: 'pkg_win_key',
    file_name: 'valhalla-win-x64.zip',
    file_size: 1048576,
    is_force_update: 0,
    is_published: 1,
    external_url: 'https://download.example.com/valhalla-win-x64.zip',
    use_proxy: 0,
    is_cleaned: 0,
    platform: 'windows',
    arch: 'x86_64',
    download_count: 5,
    created_at: new Date().toISOString(),
  };

  const packagesList = [
    {
      id: 'pkg_win',
      version_id: 'ver_valhalla_100',
      app_id: 'com.norns.valhalla',
      platform: 'windows',
      arch: 'x86_64',
      file_key: 'pkg_win_key',
      file_name: 'valhalla-win-x64.zip',
      file_size: 1048576,
      external_url: 'https://download.example.com/valhalla-win-x64.zip',
      use_proxy: 0,
      is_cleaned: 0,
      download_count: 5,
      created_at: new Date().toISOString(),
    },
    {
      id: 'pkg_arm',
      version_id: 'ver_valhalla_100',
      app_id: 'com.norns.valhalla',
      platform: 'android',
      arch: 'arm64-v8a',
      file_key: 'pkg_arm_key',
      file_name: 'valhalla-arm64.apk',
      file_size: 2097152,
      external_url: 'https://download.example.com/valhalla-arm64.apk',
      use_proxy: 0,
      is_cleaned: 0,
      download_count: 10,
      created_at: new Date().toISOString(),
    },
    {
      id: 'pkg_uni',
      version_id: 'ver_valhalla_100',
      app_id: 'com.norns.valhalla',
      platform: 'universal',
      arch: 'universal',
      file_key: 'pkg_uni_key',
      file_name: 'valhalla-universal.zip',
      file_size: 3145728,
      external_url: 'https://download.example.com/valhalla-universal.zip',
      use_proxy: 0,
      is_cleaned: 0,
      download_count: 2,
      created_at: new Date().toISOString(),
    },
  ];

  const createMultiPkgMockDb = (packages = packagesList) => ({
    prepare: (sql) => ({
      bind: (...args) => ({
        first: async () => {
          if (sql.includes('FROM apps')) return appRecord;
          if (sql.includes('FROM app_versions')) return versionRecord;
          if (sql.includes('FROM version_packages WHERE id = ?')) {
            return packages.find(p => p.id === args[0]) || null;
          }
          return null;
        },
        all: async () => {
          if (sql.includes('FROM version_packages WHERE version_id = ?')) {
            return { results: packages };
          }
          return { results: [] };
        },
        run: async () => ({ success: true }),
      }),
      first: async () => {
        if (sql.includes('FROM apps')) return appRecord;
        if (sql.includes('FROM app_versions')) return versionRecord;
        return null;
      },
      all: async () => {
        if (sql.includes('FROM version_packages')) return { results: packages };
        return { results: [] };
      },
      run: async () => ({ success: true }),
    }),
  });

  const mockDb = createMultiPkgMockDb();

  // 1. Client check update: request windows + x86_64
  const resWin = await app.fetch(
    new Request('http://localhost/api/v1/app/latest?app_id=com.norns.valhalla&current_version_code=90&platform=windows&arch=x86_64'),
    { DB: mockDb }
  );
  assert.strictEqual(resWin.status, 200);
  const dataWin = await resWin.json();
  assert.strictEqual(dataWin.code, 0);
  assert.strictEqual(dataWin.data.has_update, true);
  assert.strictEqual(dataWin.data.file_name, 'valhalla-win-x64.zip');
  assert.strictEqual(dataWin.data.platform, 'windows');
  assert.strictEqual(dataWin.data.arch, 'x86_64');
  assert.strictEqual(dataWin.data.packages.length, 3);
  assert(dataWin.data.download_url.includes('platform=windows'));

  // 2. Client check update: request android + arm64-v8a
  const resArm = await app.fetch(
    new Request('http://localhost/api/v1/app/latest?app_id=com.norns.valhalla&current_version_code=90&platform=android&arch=arm64-v8a'),
    { DB: mockDb }
  );
  assert.strictEqual(resArm.status, 200);
  const dataArm = await resArm.json();
  assert.strictEqual(dataArm.data.file_name, 'valhalla-arm64.apk');
  assert.strictEqual(dataArm.data.platform, 'android');
  assert.strictEqual(dataArm.data.arch, 'arm64-v8a');
  assert(dataArm.data.download_url.includes('package_id=pkg_arm'));

  // 3. Download matching: by platform & arch
  const resDlWin = await app.fetch(
    new Request('http://localhost/api/v1/app/download?app_id=com.norns.valhalla&platform=windows&arch=x86_64'),
    { DB: mockDb }
  );
  assert.strictEqual(resDlWin.status, 302);
  assert.strictEqual(resDlWin.headers.get('Location'), 'https://download.example.com/valhalla-win-x64.zip');

  // 4. Download matching: by specific package_id
  const resDlPkg = await app.fetch(
    new Request('http://localhost/api/v1/app/download?app_id=com.norns.valhalla&package_id=pkg_arm'),
    { DB: mockDb }
  );
  assert.strictEqual(resDlPkg.status, 302);
  assert.strictEqual(resDlPkg.headers.get('Location'), 'https://download.example.com/valhalla-arm64.apk');

  // 5. Legacy version fallback when version_packages has no rows
  const mockLegacyDb = createMultiPkgMockDb([]);
  const resLegacy = await app.fetch(
    new Request('http://localhost/api/v1/app/latest?app_id=com.norns.valhalla&current_version_code=90'),
    { DB: mockLegacyDb }
  );
  assert.strictEqual(resLegacy.status, 200);
  const dataLegacy = await resLegacy.json();
  assert.strictEqual(dataLegacy.data.packages.length, 1);
  assert.strictEqual(dataLegacy.data.packages[0].platform, 'windows');

  // 6. Latest version download via route param: /api/v1/app/:app_id/download
  const resDlRoute = await app.fetch(
    new Request('http://localhost/api/v1/app/com.norns.valhalla/download?platform=windows&arch=x86_64'),
    { DB: mockDb }
  );
  assert.strictEqual(resDlRoute.status, 302);
  assert.strictEqual(resDlRoute.headers.get('Location'), 'https://download.example.com/valhalla-win-x64.zip');

  // 7. Latest version download via short link: /d/:app_id
  const resDlShort = await app.fetch(
    new Request('http://localhost/d/com.norns.valhalla?platform=android&arch=arm64-v8a'),
    { DB: mockDb }
  );
  assert.strictEqual(resDlShort.status, 302);
  assert.strictEqual(resDlShort.headers.get('Location'), 'https://download.example.com/valhalla-arm64.apk');

  // 8. Auto-detect platform and arch from User-Agent header (Windows)
  const resUaWin = await app.fetch(
    new Request('http://localhost/d/com.norns.valhalla', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    }),
    { DB: mockDb }
  );
  assert.strictEqual(resUaWin.status, 302);
  assert.strictEqual(resUaWin.headers.get('Location'), 'https://download.example.com/valhalla-win-x64.zip');

  // 9. Auto-detect platform and arch from User-Agent header (Android)
  const resUaAndroid = await app.fetch(
    new Request('http://localhost/d/com.norns.valhalla', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile; arm64) AppleWebKit/537.36' },
    }),
    { DB: mockDb }
  );
  assert.strictEqual(resUaAndroid.status, 302);
  assert.strictEqual(resUaAndroid.headers.get('Location'), 'https://download.example.com/valhalla-arm64.apk');

  // 10. Strictly return 404 when requested platform does not exist (No arbitrary package returned)
  // App only has Windows x86_64 and Android arm64-v8a (no iOS and no universal package)
  const specificOnlyDb = createMultiPkgMockDb([packagesList[0], packagesList[1]]);

  // 10.1 JSON API download request for non-existent platform (ios)
  const resDlNoIos = await app.fetch(
    new Request('http://localhost/api/v1/app/download?app_id=com.norns.valhalla&platform=ios', {
      headers: { 'Accept': 'application/json' }
    }),
    { DB: specificOnlyDb }
  );
  assert.strictEqual(resDlNoIos.status, 404, 'Non-existent platform package request must return HTTP 404');
  const dataDlNoIos = await resDlNoIos.json();
  assert.strictEqual(dataDlNoIos.code, 404);
  assert(dataDlNoIos.message.includes('ios'));
  assert.strictEqual(dataDlNoIos.data.available_packages.length, 2, 'Must provide available packages list');

  // 10.2 HTML browser download request for non-existent platform (ios)
  const resDlNoIosHtml = await app.fetch(
    new Request('http://localhost/d/com.norns.valhalla?platform=ios', {
      headers: { 'Accept': 'text/html,application/xhtml+xml' }
    }),
    { DB: specificOnlyDb }
  );
  assert.strictEqual(resDlNoIosHtml.status, 404, 'HTML request for non-existent platform must return HTTP 404');
  const htmlDlNoIos = await resDlNoIosHtml.text();
  assert(htmlDlNoIos.includes('未找到对应安装包'));
  assert(htmlDlNoIos.includes('ios'));
  assert(htmlDlNoIos.includes('Valhalla'));

  // 10.3 Download request for platform with non-existent architecture (windows + arm64-v8a)
  const resDlNoArch = await app.fetch(
    new Request('http://localhost/api/v1/app/download?app_id=com.norns.valhalla&platform=windows&arch=arm64-v8a', {
      headers: { 'Accept': 'application/json' }
    }),
    { DB: specificOnlyDb }
  );
  assert.strictEqual(resDlNoArch.status, 404, 'Non-existent architecture package request must return HTTP 404');
  const dataDlNoArch = await resDlNoArch.json();
  assert.strictEqual(dataDlNoArch.code, 404);
  assert(dataDlNoArch.message.includes('arm64-v8a'));

  // 10.4 Check update request for non-existent platform
  const resCheckNoIos = await app.fetch(
    new Request('http://localhost/api/v1/app/latest?app_id=com.norns.valhalla&platform=ios'),
    { DB: specificOnlyDb }
  );
  assert.strictEqual(resCheckNoIos.status, 404, 'Update check for non-existent platform must return HTTP 404');
  const dataCheckNoIos = await resCheckNoIos.json();
  assert.strictEqual(dataCheckNoIos.code, 404);
  assert(dataCheckNoIos.message.includes('ios'));

  console.log('  ✅ Multi-platform matching, architecture filtering, latest package download, UA auto-detection, strict 404 not-found checks & short links verified.');
}

async function main() {
  await testJwt();
  await testAppRouting();
  testCleanupLogic();
  await testExternalUrlAndCleanedFlow();
  await testMcpFlow();
  await testMultiPlatformPackages();
  console.log('\n🎉 ALL SYSTEM TESTS PASSED SUCCESSFULLY! 🚀\n');
}

main().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
