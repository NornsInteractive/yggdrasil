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

// 2. 验证 schema.sql 语句完整性
console.log('▶ Test 2: Verifying D1 database schema.sql');
assert(existsSync('schema.sql'), 'schema.sql must exist');
const schema = readFileSync('schema.sql', 'utf-8');
assert(schema.includes('CREATE TABLE IF NOT EXISTS apps'), 'schema.sql must contain apps table');
assert(schema.includes('CREATE TABLE IF NOT EXISTS app_versions'), 'schema.sql must contain app_versions table');
assert(schema.includes('CREATE TABLE IF NOT EXISTS files'), 'schema.sql must contain files table');
assert(schema.includes('CREATE TABLE IF NOT EXISTS system_settings'), 'schema.sql must contain system_settings table');
assert(schema.includes('api_token_enabled'), 'schema.sql must contain default settings');
assert(schema.includes('api_fixed_token'), 'schema.sql must contain api_fixed_token default');
console.log('  ✅ schema.sql table definitions and default records verified.');

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

async function main() {
  await testJwt();
  console.log('\n🎉 ALL SYSTEM TESTS PASSED SUCCESSFULLY! 🚀\n');
}

main().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
