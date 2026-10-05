// ==============================================================================
// Yggdrasil (ygg) - Client App & Version Routes (Mobile App Check & Download)
// ==============================================================================

import { Hono } from 'hono';
import { Env } from '../types';
import { AppService } from '../services/appService';
import { StorageService } from '../services/storageService';
import { tokenGuard } from '../middleware/tokenGuard';

export const clientAppRoutes = new Hono<{ Bindings: Env }>();

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

  const originUrl = new URL(c.req.url).origin;
  const checkResult = await AppService.checkAppUpdate(c.env.DB, appId, currentVersionCode, channel, originUrl);

  if (!checkResult) {
    return c.json({
      code: 404,
      message: `App '${appId}' or published version not found for channel '${channel}'`,
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
 * 客户端 App APK 下载接口 (支持 HTTP Range 206 断点续传)
 * GET /api/v1/app/download
 */
clientAppRoutes.get('/api/v1/app/download', tokenGuard('app_download'), async (c) => {
  const appId = c.req.query('app_id') || c.req.query('appId');
  if (!appId) {
    return c.json({ code: 400, message: 'Missing required query parameter: app_id' }, 400);
  }

  const rawVersionCode = c.req.query('version_code') || c.req.query('versionCode');
  const versionCode = rawVersionCode ? parseInt(rawVersionCode, 10) : undefined;
  const channel = c.req.query('channel') || 'default';

  const version = await AppService.getVersionForDownload(c.env.DB, appId, versionCode, channel);
  if (!version) {
    return c.json({ code: 404, message: 'Requested APK version not found or not published' }, 404);
  }

  // 异步增加下载次数 (不阻塞下载响应)
  try {
    c.executionCtx.waitUntil(AppService.incrementDownloadCount(c.env.DB, version.id));
  } catch (e) {
    AppService.incrementDownloadCount(c.env.DB, version.id).catch(() => {});
  }

  // 1. 如果该版本的安装包已被历史策略清理
  if (version.is_cleaned === 1 && !version.external_url) {
    return c.json({
      code: 410,
      message: `版本 ${version.version_name} (Code: ${version.version_code}) 的历史安装包已被存储自动清理策略归档清理。请下载最新版本。`,
    }, 410);
  }

  // 2. 如果配置了第三方外链
  if (version.external_url && version.external_url.trim()) {
    const extUrl = version.external_url.trim();

    // 2.0 防御循环重定向：如果外部直链指向当前网关自身的下载地址，直接报错阻止
    const currentOrigin = new URL(c.req.url).origin;
    if (extUrl.startsWith(currentOrigin) || extUrl.includes('/api/v1/app/download')) {
      return c.json({
        code: 400,
        message: '配置错误：第三方外链 (external_url) 不能指向当前网关自身的下载接口 (/api/v1/app/download)，否则会造成无限重定向循环。请在后台管理界面修改此版本的外部下载直链。',
      }, 400);
    }

    // 2.1 开启反向代理：由 Edge 节点反向代理流式传输，隐藏源站并支持断点续传
    if (version.use_proxy === 1) {
      const forwardHeaders = new Headers();
      const rangeHeader = c.req.header('range');
      if (rangeHeader) forwardHeaders.set('Range', rangeHeader);
      forwardHeaders.set('User-Agent', c.req.header('user-agent') || 'Yggdrasil-Edge-Proxy/1.0');

      try {
        const proxyRes = await fetch(extUrl, {
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
            extraHint = '（提示：GitHub 私有仓库未授权访问会返回 404，请确保 Release 或仓库为 Public 公开状态，或直接在控制台上传文件到 R2 存储）';
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
      <strong>建议解决方案：</strong><br>
      1. <strong>将 GitHub 仓库设为 Public 公开（推荐）：</strong>在 GitHub 仓库 Settings &rarr; Danger Zone 将可见性改为 Public，公开后直链及反代均可秒级生效下载；<br>
      2. <strong>直接在后台上传 APK 至 R2：</strong>在 Yggdrasil 控制台选择「上传 APK 到 R2 存储」（支持大文件分片直传），无需依赖 GitHub 且国内外下载速度更快。
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
        if (contentType && !contentType.includes('text/html') && !contentType.includes('text/plain')) {
          resHeaders.set('Content-Type', contentType);
        } else {
          resHeaders.set('Content-Type', 'application/vnd.android.package-archive');
        }

        const fileName = version.file_name || `app-v${version.version_name}.apk`;
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
  return await StorageService.serveFileWithRange(
    c.env.BUCKET,
    version.file_key,
    version.file_name,
    rangeHeader,
    'application/vnd.android.package-archive'
  );
});
