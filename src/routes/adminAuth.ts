// ==============================================================================
// Yggdrasil (ygg) - Admin Auth & System Stats Routes
// ==============================================================================

import { Hono } from 'hono';
import { Env, AdminJwtPayload } from '../types';
import { DEFAULT_CONFIG } from '../config/constants';
import { signJwt, adminAuthMiddleware } from '../middleware/auth';

export const adminAuthRoutes = new Hono<{ Bindings: Env }>();

/**
 * 管理员登录
 * POST /api/admin/login
 */
adminAuthRoutes.post('/api/admin/login', async (c) => {
  try {
    const body = await c.req.json<{ password?: string }>();
    const expectedPassword = c.env.ADMIN_PASSWORD || DEFAULT_CONFIG.DEFAULT_ADMIN_PASSWORD;

    if (!body.password || body.password !== expectedPassword) {
      return c.json({ code: 401, message: 'Invalid admin password' }, 401);
    }

    const jwtSecret = c.env.JWT_SECRET || DEFAULT_CONFIG.DEFAULT_JWT_SECRET;
    const now = Math.floor(Date.now() / 1000);
    const payload: AdminJwtPayload = {
      sub: 'admin',
      role: 'admin',
      iat: now,
      exp: now + DEFAULT_CONFIG.JWT_EXPIRES_IN_SECONDS,
    };

    const token = await signJwt(payload, jwtSecret);

    // 设置 HttpOnly Cookie
    const isHttps = new URL(c.req.url).protocol === 'https:';
    const cookieFlags = [
      `${DEFAULT_CONFIG.COOKIE_NAME}=${token}`,
      'Path=/',
      `Max-Age=${DEFAULT_CONFIG.JWT_EXPIRES_IN_SECONDS}`,
      'HttpOnly',
      'SameSite=Lax',
    ];
    if (isHttps) {
      cookieFlags.push('Secure');
    }

    const response = c.json({
      code: 0,
      message: 'Login successful',
      data: { token, expiresIn: DEFAULT_CONFIG.JWT_EXPIRES_IN_SECONDS },
    });

    response.headers.set('Set-Cookie', cookieFlags.join('; '));
    return response;
  } catch (e: any) {
    return c.json({ code: 400, message: 'Bad request: ' + (e.message || 'Unknown error') }, 400);
  }
});

/**
 * 管理员登出
 * POST /api/admin/logout
 */
adminAuthRoutes.post('/api/admin/logout', async (c) => {
  const response = c.json({ code: 0, message: 'Logged out successfully' });
  response.headers.set('Set-Cookie', `${DEFAULT_CONFIG.COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  return response;
});

/**
 * 校验当前登录状态与获取统计信息
 * GET /api/admin/me
 */
adminAuthRoutes.get('/api/admin/me', adminAuthMiddleware, async (c) => {
  return c.json({
    code: 0,
    message: 'Authenticated',
    data: {
      user: 'admin',
      role: 'admin',
    },
  });
});

/**
 * 获取控制台仪表盘聚合数据统计
 * GET /api/admin/stats
 */
adminAuthRoutes.get('/api/admin/stats', adminAuthMiddleware, async (c) => {
  try {
    const appStats = await c.env.DB.prepare(`
      SELECT 
        (SELECT COUNT(1) FROM apps) AS total_apps,
        (SELECT COUNT(1) FROM app_versions) AS total_versions,
        (SELECT COALESCE(SUM(file_size), 0) FROM app_versions) AS app_storage_bytes,
        (SELECT COALESCE(SUM(download_count), 0) FROM app_versions) AS app_downloads
    `).first<{ total_apps: number; total_versions: number; app_storage_bytes: number; app_downloads: number }>();

    const fileStats = await c.env.DB.prepare(`
      SELECT 
        (SELECT COUNT(1) FROM files) AS total_files,
        (SELECT COALESCE(SUM(file_size), 0) FROM files) AS file_storage_bytes,
        (SELECT COALESCE(SUM(download_count), 0) FROM files) AS file_downloads
    `).first<{ total_files: number; file_storage_bytes: number; file_downloads: number }>();

    const totalApps = appStats?.total_apps || 0;
    const totalVersions = appStats?.total_versions || 0;
    const totalFiles = fileStats?.total_files || 0;
    const totalStorageBytes = (appStats?.app_storage_bytes || 0) + (fileStats?.file_storage_bytes || 0);
    const totalDownloads = (appStats?.app_downloads || 0) + (fileStats?.file_downloads || 0);

    return c.json({
      code: 0,
      message: 'success',
      data: {
        totalApps,
        totalVersions,
        totalFiles,
        totalStorageBytes,
        totalDownloads,
      },
    });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to query system stats: ' + e.message }, 500);
  }
});
