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
  c.executionCtx.waitUntil(AppService.incrementDownloadCount(c.env.DB, version.id));

  // 流式提供下载，并处理 Range 头部以实现断点续传
  const rangeHeader = c.req.header('range');
  return await StorageService.serveFileWithRange(
    c.env.BUCKET,
    version.file_key,
    version.file_name,
    rangeHeader,
    'application/vnd.android.package-archive'
  );
});
