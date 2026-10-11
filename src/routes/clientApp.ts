// ==============================================================================
// Yggdrasil (ygg) - Client App & Version Routes (Mobile App Check & Download)
// ==============================================================================

import { Hono } from 'hono';
import { Env, VersionPackageEntity } from '../types';
import { AppService } from '../services/appService';
import { StorageService } from '../services/storageService';
import { SettingService } from '../services/settingService';
import { SETTING_KEYS } from '../config/constants';
import { tokenGuard } from '../middleware/tokenGuard';

export const clientAppRoutes = new Hono<{ Bindings: Env }>();

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderPackageNotFoundHtml(options: {
  appId: string;
  appName?: string;
  iconUrl?: string | null;
  platform?: string;
  arch?: string;
  versionName?: string;
  availablePackages: VersionPackageEntity[];
  originUrl: string;
}): string {
  const { appId, appName, iconUrl, platform, arch, versionName, availablePackages, originUrl } = options;
  const displayTitle = appName ? `${appName} (${appId})` : appId;
  const targetDesc = [platform ? `平台: ${platform}` : '', arch ? `架构: ${arch}` : ''].filter(Boolean).join(' / ');

  const packageRows = availablePackages.map(pkg => {
    const dlUrl = `${originUrl}/api/v1/app/download?app_id=${encodeURIComponent(appId)}` +
      (pkg.version_id ? `&version_id=${encodeURIComponent(pkg.version_id)}` : '') +
      (pkg.id && !pkg.id.startsWith('pkg_def_') ? `&package_id=${encodeURIComponent(pkg.id)}` : '');
    const sizeStr = pkg.file_size ? formatBytes(pkg.file_size) : '';

    return `
      <div class="pkg-card">
        <div class="pkg-info">
          <div class="pkg-header">
            <span class="badge badge-platform">${escapeHtml(pkg.platform || 'universal')}</span>
            <span class="badge badge-arch">${escapeHtml(pkg.arch || 'universal')}</span>
          </div>
          <div class="pkg-name">${escapeHtml(pkg.file_name || 'app-installer')}</div>
          ${sizeStr ? `<div class="pkg-meta">文件大小: ${sizeStr}</div>` : ''}
        </div>
        <a href="${dlUrl}" class="btn-download">下载此安装包</a>
      </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>未找到对应安装包 - ${escapeHtml(displayTitle)}</title>
  <style>
    :root {
      --bg: #0b0f19;
      --card-bg: #131b2e;
      --border: #1e293b;
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #3b82f6;
      --primary-hover: #2563eb;
      --warn: #f59e0b;
      --warn-bg: rgba(245, 158, 11, 0.1);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1.5rem;
    }
    .container {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 2.5rem;
      max-width: 620px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .app-header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    .app-icon {
      width: 64px;
      height: 64px;
      border-radius: 14px;
      object-fit: cover;
      background: #1e293b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      flex-shrink: 0;
    }
    .app-details h1 {
      font-size: 1.35rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 0.25rem;
    }
    .app-id {
      font-size: 0.85rem;
      color: var(--text-muted);
      font-family: monospace;
    }
    .notice-box {
      background: var(--warn-bg);
      border: 1px solid var(--warn);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 2rem;
    }
    .notice-title {
      color: var(--warn);
      font-weight: 600;
      font-size: 1.05rem;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .notice-desc {
      color: #cbd5e1;
      font-size: 0.9rem;
      line-height: 1.6;
    }
    .section-title {
      font-size: 0.95rem;
      font-weight: 600;
      color: #cbd5e1;
      margin-bottom: 1rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .pkg-list {
      display: flex;
      flex-direction: column;
      gap: 0.875rem;
      margin-bottom: 2rem;
    }
    .pkg-card {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      transition: border-color 0.2s;
    }
    .pkg-card:hover {
      border-color: #3b82f6;
    }
    .pkg-info {
      flex: 1;
      min-width: 0;
    }
    .pkg-header {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.4rem;
    }
    .badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-platform {
      background: rgba(59, 130, 246, 0.15);
      color: #60a5fa;
      border: 1px solid rgba(59, 130, 246, 0.3);
    }
    .badge-arch {
      background: rgba(168, 85, 247, 0.15);
      color: #c084fc;
      border: 1px solid rgba(168, 85, 247, 0.3);
    }
    .pkg-name {
      font-size: 0.9rem;
      font-weight: 500;
      color: #f1f5f9;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 0.25rem;
      font-family: monospace;
    }
    .pkg-meta {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .btn-download {
      background: var(--primary);
      color: #fff;
      text-decoration: none;
      padding: 0.6rem 1.25rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 600;
      white-space: nowrap;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .btn-download:hover {
      background: var(--primary-hover);
    }
    .footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .footer a {
      color: #60a5fa;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="app-header">
      ${iconUrl ? `<img src="${escapeHtml(iconUrl)}" alt="${escapeHtml(displayTitle)}" class="app-icon" />` : `<div class="app-icon">📦</div>`}
      <div class="app-details">
        <h1>${escapeHtml(appName || appId)}</h1>
        <div class="app-id">${escapeHtml(appId)}${versionName ? ` &bull; v${escapeHtml(versionName)}` : ''}</div>
      </div>
    </div>

    <div class="notice-box">
      <div class="notice-title">⚠️ 暂无适应该设备/平台的安装包</div>
      <div class="notice-desc">
        ${targetDesc ? `您的请求/设备环境被识别为 [<strong>${escapeHtml(targetDesc)}</strong>]，` : ''}该应用当前版本尚未提供此平台或架构的安装包。系统已阻止下载不兼容的安装包，以防运行崩溃。
      </div>
    </div>

    ${availablePackages.length > 0 ? `
    <div class="section-title">📦 该应用当前已发布的可用安装包</div>
    <div class="pkg-list">
      ${packageRows}
    </div>
    ` : `
    <div style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 2rem 0;">
      暂无任何已发布的安装包。
    </div>
    `}

    <div class="footer">
      Powered by <a href="/">Yggdrasil App Distribution</a>
    </div>
  </div>
</body>
</html>`;
}

function getPackageContentType(fileName: string): string {
  const lower = (fileName || '').toLowerCase();
  if (lower.endsWith('.apk')) return 'application/vnd.android.package-archive';
  if (lower.endsWith('.ipa')) return 'application/octet-stream';
  if (lower.endsWith('.exe')) return 'application/x-msdownload';
  if (lower.endsWith('.msi')) return 'application/x-msi';
  if (lower.endsWith('.dmg')) return 'application/x-apple-diskimage';
  if (lower.endsWith('.pkg')) return 'application/octet-stream';
  if (lower.endsWith('.deb')) return 'application/vnd.debian.binary-package';
  if (lower.endsWith('.rpm')) return 'application/x-rpm';
  if (lower.endsWith('.appimage')) return 'application/octet-stream';
  if (lower.endsWith('.zip')) return 'application/zip';
  if (lower.endsWith('.tar.gz') || lower.endsWith('.tgz')) return 'application/gzip';
  return 'application/octet-stream';
}

/**
 * 根据 User-Agent 智能推断访客操作系统平台与 CPU 架构
 */
export function detectPlatformAndArchFromUa(ua: string): { platform?: string; arch?: string } {
  if (!ua) return {};
  const lower = ua.toLowerCase();

  // 1. Android
  if (lower.includes('android')) {
    let arch = 'universal';
    if (lower.includes('arm64') || lower.includes('aarch64')) arch = 'arm64-v8a';
    else if (lower.includes('armeabi-v7a') || lower.includes('armv7')) arch = 'armeabi-v7a';
    else if (lower.includes('x86_64')) arch = 'x86_64';
    else if (lower.includes('x86')) arch = 'x86';
    return { platform: 'android', arch };
  }

  // 2. Windows
  if (lower.includes('windows') || lower.includes('win32') || lower.includes('win64')) {
    let arch = 'x86_64';
    if (lower.includes('arm64')) arch = 'arm64-v8a';
    else if (lower.includes('win64') || lower.includes('x64') || lower.includes('wow64')) arch = 'x86_64';
    else arch = 'x86';
    return { platform: 'windows', arch };
  }

  // 3. macOS
  if (lower.includes('macintosh') || lower.includes('mac os x')) {
    let arch = 'universal';
    if (lower.includes('arm64') || lower.includes('aarch64')) arch = 'apple-silicon';
    else arch = 'x86_64';
    return { platform: 'macos', arch };
  }

  // 4. iOS
  if (lower.includes('iphone') || lower.includes('ipad') || lower.includes('ipod')) {
    return { platform: 'ios', arch: 'universal' };
  }

  // 5. Linux
  if (lower.includes('linux')) {
    let arch = 'x86_64';
    if (lower.includes('aarch64') || lower.includes('arm64')) arch = 'arm64-v8a';
    else if (lower.includes('arm')) arch = 'armeabi-v7a';
    return { platform: 'linux', arch };
  }

  return {};
}

/**
 * 客户端 App 版本检测接口
 * GET /api/v1/app/latest
 * GET /api/v1/version/check
 */
const handleVersionCheck = async (c: any) => {
  const appId = c.req.query('app_id') || c.req.query('appId') || c.req.query('package_name');
  if (!appId) {
    return c.json({
      code: 400,
      message: 'Missing required query parameter: app_id (e.g. ?app_id=com.example.app)',
    }, 400);
  }

  const rawVersionCode = c.req.query('version_code') || c.req.query('versionCode') || '0';
  const currentVersionCode = parseInt(rawVersionCode, 10) || 0;
  const channel = c.req.query('channel') || 'default';
  const rawPlatform = c.req.query('platform') || c.req.query('os');
  const rawArch = c.req.query('arch') || c.req.query('architecture') || c.req.query('structure') || c.req.query('struct');

  let platform = rawPlatform?.trim().toLowerCase();
  let arch = rawArch?.trim().toLowerCase();

  // 若未指定 platform，从 User-Agent 智能推断
  if (!platform) {
    const ua = c.req.header('user-agent') || '';
    const detected = detectPlatformAndArchFromUa(ua);
    if (detected.platform) {
      platform = detected.platform;
      if (!arch && detected.arch) arch = detected.arch;
    }
  }

  const originUrl = new URL(c.req.url).origin;
  const checkResult = await AppService.checkAppUpdate(
    c.env.DB,
    appId,
    currentVersionCode,
    channel,
    originUrl,
    platform,
    arch
  );

  if (!checkResult) {
    const targetDesc = [platform ? `平台: ${platform}` : '', arch ? `架构: ${arch}` : ''].filter(Boolean).join(' / ');
    return c.json({
      code: 404,
      message: targetDesc
        ? `未找到适用于 [${targetDesc}] 的已发布版本或安装包 (App: ${appId}, Channel: ${channel})`
        : `App '${appId}' or published version not found for channel '${channel}'`,
    }, 404);
  }

  return c.json({
    code: 0,
    message: 'success',
    data: checkResult,
  });
};

clientAppRoutes.get('/api/v1/app/latest', tokenGuard('app_check'), handleVersionCheck);
clientAppRoutes.get('/api/v1/version/check', tokenGuard('app_check'), handleVersionCheck);

/**
 * 客户端 App APK/安装包下载接口 (支持多平台/多架构分发与 HTTP Range 206 断点续传)
 * GET /api/v1/app/download
 * GET /api/v1/app/:app_id/download
 * GET /d/:app_id
 */
const handleAppDownload = async (c: any) => {
  const appId = c.req.query('app_id') || c.req.query('appId') || c.req.param('app_id') || c.req.param('appId');
  if (!appId) {
    return c.json({ code: 400, message: 'Missing required parameter: app_id' }, 400);
  }

  const rawVersionCode = c.req.query('version_code') || c.req.query('versionCode');
  const versionCode = rawVersionCode ? parseInt(rawVersionCode, 10) : undefined;
  const channel = c.req.query('channel') || 'default';
  const rawPlatform = c.req.query('platform') || c.req.query('os');
  const rawArch = c.req.query('arch') || c.req.query('architecture') || c.req.query('structure') || c.req.query('struct');
  const packageId = c.req.query('package_id') || c.req.query('packageId');

  let platform = rawPlatform?.trim().toLowerCase();
  let arch = rawArch?.trim().toLowerCase();

  // 若未指定 platform 且未指定 packageId，从 User-Agent 智能推断
  if (!platform && !packageId) {
    const ua = c.req.header('user-agent') || '';
    const detected = detectPlatformAndArchFromUa(ua);
    if (detected.platform) {
      platform = detected.platform;
      if (!arch && detected.arch) arch = detected.arch;
    }
  }

  const version = await AppService.getVersionForDownload(c.env.DB, appId, versionCode, channel, platform, arch);
  const targetPkg = version
    ? await AppService.getPackageForDownload(c.env.DB, version, platform, arch, packageId)
    : null;

  if (!version || !targetPkg) {
    const originUrl = new URL(c.req.url).origin;
    const isHtmlClient = (c.req.header('accept') || '').includes('text/html');
    const appInfo = await AppService.getAppByAppId(c.env.DB, appId);
    const fallbackVersion = version || await AppService.getLatestPublishedVersion(c.env.DB, appId, channel);

    let availablePackages: VersionPackageEntity[] = [];
    if (fallbackVersion) {
      const pkgs = await AppService.listPackagesByVersionId(c.env.DB, fallbackVersion.id);
      if (pkgs && pkgs.length > 0) {
        availablePackages = pkgs;
      } else {
        availablePackages = [{
          id: 'pkg_def_' + fallbackVersion.id,
          version_id: fallbackVersion.id,
          app_id: fallbackVersion.app_id,
          platform: fallbackVersion.platform || 'android',
          arch: fallbackVersion.arch || 'universal',
          file_key: fallbackVersion.file_key || null,
          file_name: fallbackVersion.file_name || 'app.apk',
          file_size: fallbackVersion.file_size || 0,
          file_md5: fallbackVersion.file_md5 || null,
          file_sha256: fallbackVersion.file_sha256 || null,
          external_url: fallbackVersion.external_url || null,
          use_proxy: fallbackVersion.use_proxy || 0,
          is_cleaned: fallbackVersion.is_cleaned || 0,
          download_count: fallbackVersion.download_count || 0,
          created_at: fallbackVersion.created_at,
        }];
      }
    }

    if (isHtmlClient) {
      return c.html(renderPackageNotFoundHtml({
        appId,
        appName: appInfo?.name,
        iconUrl: appInfo?.icon_url,
        platform,
        arch,
        versionName: fallbackVersion?.version_name,
        availablePackages,
        originUrl,
      }), 404);
    }

    const targetDesc = [platform ? `平台: ${platform}` : '', arch ? `架构: ${arch}` : ''].filter(Boolean).join(' / ');
    return c.json({
      code: 404,
      message: targetDesc
        ? `未找到适用于 [${targetDesc}] 的安装包 (App: ${appId})`
        : `未找到应用 '${appId}' 的可用安装包`,
      data: {
        app_id: appId,
        app_name: appInfo ? appInfo.name : appId,
        requested_platform: platform || null,
        requested_arch: arch || null,
        version_name: fallbackVersion ? fallbackVersion.version_name : null,
        version_code: fallbackVersion ? fallbackVersion.version_code : null,
        available_packages: availablePackages.map(p => ({
          id: p.id,
          platform: p.platform,
          arch: p.arch,
          file_name: p.file_name,
          file_size: p.file_size,
          download_url: `${originUrl}/api/v1/app/download?app_id=${encodeURIComponent(appId)}` +
            (fallbackVersion ? `&version_code=${fallbackVersion.version_code}` : '') +
            (p.id && !p.id.startsWith('pkg_def_') ? `&package_id=${encodeURIComponent(p.id)}` : '')
        }))
      }
    }, 404);
  }

  // 异步增加主版本与具体安装包下载次数 (不阻塞下载响应)
  try {
    c.executionCtx.waitUntil(Promise.all([
      AppService.incrementDownloadCount(c.env.DB, version.id),
      targetPkg.id && !targetPkg.id.startsWith('pkg_def_') ? AppService.incrementPackageDownloadCount(c.env.DB, targetPkg.id) : Promise.resolve(),
    ]));
  } catch (e) {
    AppService.incrementDownloadCount(c.env.DB, version.id).catch(() => {});
    if (targetPkg.id && !targetPkg.id.startsWith('pkg_def_')) {
      AppService.incrementPackageDownloadCount(c.env.DB, targetPkg.id).catch(() => {});
    }
  }

  // 1. 如果该安装包已被历史策略清理
  if (targetPkg.is_cleaned === 1 && !targetPkg.external_url) {
    return c.json({
      code: 410,
      message: `版本 ${version.version_name} (Code: ${version.version_code}, 平台: ${targetPkg.platform}, 架构: ${targetPkg.arch}) 的历史安装包已被存储自动清理策略归档清理。请下载最新版本。`,
    }, 410);
  }

  // 2. 如果配置了第三方外链
  if (targetPkg.external_url && targetPkg.external_url.trim()) {
    const extUrl = targetPkg.external_url.trim();

    // 2.0 防御循环重定向：如果外部直链指向当前网关自身的下载地址，直接报错阻止
    const currentOrigin = new URL(c.req.url).origin;
    if (extUrl.startsWith(currentOrigin) || extUrl.includes('/api/v1/app/download')) {
      return c.json({
        code: 400,
        message: '配置错误：第三方外链 (external_url) 不能指向当前网关自身的下载接口 (/api/v1/app/download)，否则会造成无限重定向循环。请在后台管理界面修改此安装包的外部下载直链。',
      }, 400);
    }

    // 2.1 开启反向代理：由 Edge 节点反向代理流式传输，隐藏源站并支持断点续传
    if (targetPkg.use_proxy === 1) {
      const forwardHeaders = new Headers();
      const rangeHeader = c.req.header('range');
      if (rangeHeader) forwardHeaders.set('Range', rangeHeader);
      forwardHeaders.set('User-Agent', c.req.header('user-agent') || 'Yggdrasil-Edge-Proxy/1.0');

      try {
        let downloadTargetUrl = extUrl;
        const githubMatch = extUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/releases\/download\/([^/]+)\/(.+)$/);

        // 如果是 GitHub Release 链接，尝试读取 GitHub Token 以支持私有仓库的 Release 下载
        if (githubMatch) {
          const githubToken = await SettingService.getSetting(c.env.DB, SETTING_KEYS.GITHUB_TOKEN, '');
          if (githubToken && githubToken.trim()) {
            const [, owner, repo, tag, rawFilename] = githubMatch;
            const filename = decodeURIComponent(rawFilename);

            try {
              // 1. 通过 GitHub API 获取 Release 的 Asset 列表
              const releaseRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${encodeURIComponent(tag)}`, {
                headers: {
                  'Authorization': `Bearer ${githubToken.trim()}`,
                  'User-Agent': 'Yggdrasil-Edge-Proxy/1.0',
                  'Accept': 'application/vnd.github+json'
                }
              });

              if (releaseRes.ok) {
                const releaseData = await releaseRes.json<{ assets?: Array<{ id: number; name: string }> }>();
                const targetAsset = releaseData.assets?.find(a => a.name === filename);
                if (targetAsset) {
                  // 2. 将目标地址指向 GitHub API 资产二进制下载接口
                  downloadTargetUrl = `https://api.github.com/repos/${owner}/${repo}/releases/assets/${targetAsset.id}`;
                  forwardHeaders.set('Authorization', `Bearer ${githubToken.trim()}`);
                  forwardHeaders.set('Accept', 'application/octet-stream');
                }
              }
            } catch (e) {
              console.warn('[Proxy] Failed to query GitHub Release Asset API:', e);
            }
          }
        }

        const proxyRes = await fetch(downloadTargetUrl, {
          method: 'GET',
          headers: forwardHeaders,
          redirect: 'follow',
        });

        // 处理第三方源站返回的异常状态码 (如 404, 403, 500 等)
        if (!proxyRes.ok) {
          const isHtmlClient = (c.req.header('accept') || '').includes('text/html');
          const isGithub = extUrl.includes('github.com');
          let extraHint = '';
          if (proxyRes.status === 404 && isGithub) {
            extraHint = '（提示：GitHub 私有仓库未配置有效 Token 会返回 404。请在「系统设置」中配置 GitHub Access Token，或将仓库设为 Public，或直接在控制台上传文件到 R2 存储）';
          }

          if (isHtmlClient) {
            return c.html(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>反向代理下载失败 - Yggdrasil</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; box-sizing: border-box; }
    .card { background: #131b2e; border: 1px solid #1e293b; border-radius: 16px; padding: 2rem; max-width: 600px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
    h2 { color: #f87171; margin-top: 0; display: flex; align-items: center; gap: 0.5rem; font-size: 1.25rem; }
    .msg { color: #cbd5e1; font-size: 0.95rem; line-height: 1.6; margin: 1rem 0; }
    .box { background: #080c14; border: 1px solid #1e293b; border-radius: 8px; padding: 0.875rem 1rem; margin: 1rem 0; font-size: 0.85rem; color: #38bdf8; word-break: break-all; font-family: monospace; }
    .hint { background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; padding: 1rem; border-radius: 6px; color: #fbbf24; font-size: 0.875rem; margin: 1.25rem 0; line-height: 1.6; }
    .hint strong { color: #fef08a; }
    .btn { display: inline-block; background: #2563eb; color: #fff; text-decoration: none; padding: 0.65rem 1.5rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; margin-top: 0.5rem; transition: background 0.2s; }
    .btn:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <h2>⚠️ 反向代理下载失败</h2>
    <div class="msg">Edge 节点尝试代理拉取第三方安装包时，源站返回了异常状态：<strong>HTTP ${proxyRes.status} (${proxyRes.statusText})</strong></div>
    <div class="box">${extUrl}</div>
    ${isGithub ? `
    <div class="hint">
      <strong>💡 排查原因：GitHub 私有仓库限制</strong><br>
      检测到目标为 GitHub Release 链接。若仓库为 <strong>Private（私有）</strong>，GitHub 严禁任何未登录的外部请求直接下载 Release 资源并固定返回 404。<br><br>
      <strong>建议解决方案（三选一）：</strong><br>
      1. <strong>在 Yggdrasil 配置 GitHub Token（强烈推荐）：</strong>在 Yggdrasil「系统设置」中填入 GitHub Personal Access Token (PAT)，Edge 节点即可自动解锁并代理下载私有 Release 安装包，代码依然保持 100% 闭源保密！<br>
      2. <strong>直接在后台上传 APK 至 R2：</strong>在 Yggdrasil 控制台选择「上传 APK 到 R2 存储」（支持大文件分片直传），无需依赖 GitHub 且国内外下载速度更快；<br>
      3. <strong>将 GitHub 仓库设为 Public 公开：</strong>在 GitHub 仓库 Settings &rarr; Danger Zone 将可见性改为 Public，公开后直链及反代均可秒级生效下载。
    </div>` : ''}
    <a href="/admin" class="btn">返回后台管理</a>
  </div>
</body>
</html>`, 404);
          }

          // 非 HTML 浏览器请求 (如 APP 内检测或 curl) 返回 JSON，避免 502 状态触发 Cloudflare 页面拦截
          return c.json({
            code: 404,
            message: `反向代理下载第三方安装包失败: 第三方源站返回 HTTP ${proxyRes.status} (${proxyRes.statusText})。${extraHint}`,
            data: { status: proxyRes.status, upstream_url: extUrl },
          }, 404);
        }

        // 白名单提取有效响应头，避免透传 hop-by-hop (如 connection) 或上游安全策略 (CSP) 破坏客户端下载
        const resHeaders = new Headers();
        const contentType = proxyRes.headers.get('content-type');
        const fileName = targetPkg.file_name || `app-v${version.version_name}-${targetPkg.platform}-${targetPkg.arch}`;
        if (contentType && !contentType.includes('text/html') && !contentType.includes('text/plain')) {
          resHeaders.set('Content-Type', contentType);
        } else {
          resHeaders.set('Content-Type', getPackageContentType(fileName));
        }

        resHeaders.set('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
        resHeaders.set('Accept-Ranges', 'bytes');
        resHeaders.set('Cache-Control', 'public, max-age=3600');

        if (proxyRes.headers.has('etag')) {
          resHeaders.set('ETag', proxyRes.headers.get('etag')!);
        }
        if (proxyRes.headers.has('last-modified')) {
          resHeaders.set('Last-Modified', proxyRes.headers.get('last-modified')!);
        }
        if (proxyRes.status === 206 && proxyRes.headers.has('content-range')) {
          resHeaders.set('Content-Range', proxyRes.headers.get('content-range')!);
        }
        // 若无 gzip 解压影响且存在准确 content-length，才回传 Content-Length
        if (!proxyRes.headers.has('content-encoding') && proxyRes.headers.has('content-length')) {
          resHeaders.set('Content-Length', proxyRes.headers.get('content-length')!);
        }

        return new Response(proxyRes.body, {
          status: proxyRes.status,
          statusText: proxyRes.statusText,
          headers: resHeaders,
        });
      } catch (err: any) {
        return c.json({ code: 500, message: '反向代理下载第三方安装包网络异常: ' + err.message }, 500);
      }
    }

    // 2.2 未开启反向代理：直接 302 重定向到第三方下载链接
    return c.redirect(extUrl, 302);
  }

  // 3. 正常 R2 本地文件流式提供下载，并处理 Range 头部以实现断点续传
  const rangeHeader = c.req.header('range');
  const finalFileName = targetPkg.file_name || `app-v${version.version_name}-${targetPkg.platform}-${targetPkg.arch}`;
  return await StorageService.serveFileWithRange(
    c.env.BUCKET,
    targetPkg.file_key || '',
    finalFileName,
    rangeHeader,
    getPackageContentType(finalFileName)
  );
};

clientAppRoutes.get('/api/v1/app/download', tokenGuard('app_download'), handleAppDownload);
clientAppRoutes.get('/api/v1/app/:app_id/download', tokenGuard('app_download'), handleAppDownload);
clientAppRoutes.get('/d/:app_id', tokenGuard('app_download'), handleAppDownload);
