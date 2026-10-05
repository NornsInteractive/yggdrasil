// ==============================================================================
// Yggdrasil (ygg) - Admin System Settings Routes (Dynamic Token Configuration)
// ==============================================================================

import { Hono } from 'hono';
import { Env } from '../types';
import { SettingService } from '../services/settingService';
import { adminAuthMiddleware } from '../middleware/auth';
import { CleanupService } from '../services/cleanupService';

export const adminSettingsRoutes = new Hono<{ Bindings: Env }>();

adminSettingsRoutes.use('/api/admin/*', adminAuthMiddleware);

/**
 * 获取所有动态系统配置
 * GET /api/admin/settings
 */
adminSettingsRoutes.get('/api/admin/settings', async (c) => {
  const settings = await SettingService.getAllSettings(c.env.DB);
  return c.json({ code: 0, message: 'success', data: settings });
});

/**
 * 更新系统配置
 * PUT /api/admin/settings
 */
adminSettingsRoutes.put('/api/admin/settings', async (c) => {
  try {
    const body = await c.req.json<Record<string, string>>();
    if (!body || typeof body !== 'object') {
      return c.json({ code: 400, message: 'Invalid payload, expected settings key-value object' }, 400);
    }

    await SettingService.updateSettings(c.env.DB, body);
    const updated = await SettingService.getAllSettings(c.env.DB);
    return c.json({ code: 0, message: 'Settings saved successfully', data: updated });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to update settings: ' + e.message }, 500);
  }
});

/**
 * 随机生成安全固定 Token
 * POST /api/admin/settings/generate-token
 */
adminSettingsRoutes.post('/api/admin/settings/generate-token', async (c) => {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  const token = 'ygg_' + Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  return c.json({ code: 0, message: 'Token generated', data: { token } });
});

/**
 * 手动触发旧版本清理
 * POST /api/admin/cleanup
 */
adminSettingsRoutes.post('/api/admin/cleanup', async (c) => {
  try {
    const result = await CleanupService.runCleanup(c.env.DB, c.env.BUCKET);
    return c.json({ code: 0, message: `Cleanup completed: ${result.deleted} versions removed`, data: result });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Cleanup failed: ' + e.message }, 500);
  }
});

/**
 * 手动强制清理 (忽略开关，按传入参数执行)
 * POST /api/admin/cleanup/force
 */
adminSettingsRoutes.post('/api/admin/cleanup/force', async (c) => {
  try {
    const body = await c.req.json<{ days?: number; keep_latest?: number }>();
    const days = body.days || 90;
    const keepLatest = body.keep_latest || 3;
    const result = await CleanupService.forceCleanup(c.env.DB, c.env.BUCKET, days, keepLatest);
    return c.json({ code: 0, message: `Force cleanup completed: ${result.deleted} versions removed`, data: result });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Force cleanup failed: ' + e.message }, 500);
  }
});
