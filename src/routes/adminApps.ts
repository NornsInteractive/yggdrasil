// ==============================================================================
// Yggdrasil (ygg) - Admin App & Version Management Routes
// ==============================================================================

import { Hono } from 'hono';
import { Env } from '../types';
import { AppService } from '../services/appService';
import { adminAuthMiddleware } from '../middleware/auth';

export const adminAppsRoutes = new Hono<{ Bindings: Env }>();

// 统一施加管理员鉴权 (仅作用于 /api/admin/* 接口)
adminAppsRoutes.use('/api/admin/*', adminAuthMiddleware);

/**
 * 获取所有应用列表
 * GET /api/admin/apps
 */
adminAppsRoutes.get('/api/admin/apps', async (c) => {
  const apps = await AppService.listApps(c.env.DB);
  return c.json({ code: 0, message: 'success', data: apps });
});

/**
 * 获取单个应用详情
 * GET /api/admin/apps/:appId
 */
adminAppsRoutes.get('/api/admin/apps/:appId', async (c) => {
  const appId = c.req.param('appId');
  const app = await AppService.getAppByAppId(c.env.DB, appId);
  if (!app) {
    return c.json({ code: 404, message: 'App not found' }, 404);
  }
  return c.json({ code: 0, message: 'success', data: app });
});

/**
 * 创建新应用
 * POST /api/admin/apps
 */
adminAppsRoutes.post('/api/admin/apps', async (c) => {
  try {
    const body = await c.req.json<{
      app_id: string;
      name: string;
      icon_url?: string;
      description?: string;
    }>();

    if (!body.app_id || !body.name) {
      return c.json({ code: 400, message: 'app_id and name are required' }, 400);
    }

    const existing = await AppService.getAppByAppId(c.env.DB, body.app_id);
    if (existing) {
      return c.json({ code: 409, message: `App with app_id '${body.app_id}' already exists` }, 409);
    }

    const app = await AppService.createApp(c.env.DB, body);
    return c.json({ code: 0, message: 'App created successfully', data: app });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to create app: ' + e.message }, 500);
  }
});

/**
 * 修改应用信息
 * PUT /api/admin/apps/:appId
 */
adminAppsRoutes.put('/api/admin/apps/:appId', async (c) => {
  try {
    const appId = c.req.param('appId');
    const body = await c.req.json<{
      name?: string;
      icon_url?: string;
      description?: string;
    }>();

    await AppService.updateApp(c.env.DB, appId, body);
    return c.json({ code: 0, message: 'App updated successfully' });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to update app: ' + e.message }, 500);
  }
});

/**
 * 删除应用
 * DELETE /api/admin/apps/:appId
 */
adminAppsRoutes.delete('/api/admin/apps/:appId', async (c) => {
  try {
    const appId = c.req.param('appId');
    await AppService.deleteApp(c.env.DB, c.env.BUCKET, appId);
    return c.json({ code: 0, message: 'App and associated versions deleted successfully' });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to delete app: ' + e.message }, 500);
  }
});

/**
 * 获取指定 App 的所有版本列表
 * GET /api/admin/apps/:appId/versions
 */
adminAppsRoutes.get('/api/admin/apps/:appId/versions', async (c) => {
  const appId = c.req.param('appId');
  const versions = await AppService.listVersions(c.env.DB, appId);
  return c.json({ code: 0, message: 'success', data: versions });
});

/**
 * 发布新版本 (支持多平台/多架构主包与附加分发包)
 * POST /api/admin/apps/:appId/versions
 */
adminAppsRoutes.post('/api/admin/apps/:appId/versions', async (c) => {
  try {
    const appId = c.req.param('appId');
    const body = await c.req.json<{
      version_code: number;
      version_name: string;
      min_version_code?: number;
      channel?: string;
      changelog?: string;
      file_key?: string;
      file_name?: string;
      file_size?: number;
      file_md5?: string;
      file_sha256?: string;
      is_force_update?: number;
      is_published?: number;
      external_url?: string;
      use_proxy?: number;
      platform?: string;
      arch?: string;
      packages?: Array<{
        platform?: string;
        arch?: string;
        file_key?: string;
        file_name?: string;
        file_size?: number;
        file_md5?: string;
        file_sha256?: string;
        external_url?: string;
        use_proxy?: number;
      }>;
    }>();

    if (!body.version_code || !body.version_name || (!body.file_key && !body.external_url)) {
      return c.json({ code: 400, message: '必须填写版本号、版本名称，并选择上传安装包文件或填写第三方下载直链' }, 400);
    }

    if (body.external_url && body.external_url.trim()) {
      const ext = body.external_url.trim();
      if (!ext.startsWith('http://') && !ext.startsWith('https://')) {
        return c.json({ code: 400, message: '第三方下载直链必须以 http:// 或 https:// 开头' }, 400);
      }
      if (ext.includes('/api/v1/app/download')) {
        return c.json({ code: 400, message: '第三方直链不能填写当前网关自身的 /api/v1/app/download 地址，必须为外部源站真实下载链接！' }, 400);
      }
    }

    const version = await AppService.createVersion(c.env.DB, {
      ...body,
      app_id: appId,
    });

    return c.json({ code: 0, message: 'Version published successfully', data: version });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to publish version: ' + e.message }, 500);
  }
});

/**
 * 修改版本信息 (更新日志、是否强更、发布状态、外链与反代设置)
 * PUT /api/admin/versions/:id
 */
adminAppsRoutes.put('/api/admin/versions/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json<{
      version_name?: string;
      min_version_code?: number;
      channel?: string;
      changelog?: string;
      is_force_update?: number;
      is_published?: number;
      external_url?: string;
      use_proxy?: number;
      file_name?: string;
    }>();

    if (body.external_url && body.external_url.trim()) {
      const ext = body.external_url.trim();
      if (!ext.startsWith('http://') && !ext.startsWith('https://')) {
        return c.json({ code: 400, message: '第三方下载直链必须以 http:// 或 https:// 开头' }, 400);
      }
      if (ext.includes('/api/v1/app/download')) {
        return c.json({ code: 400, message: '第三方直链不能填写当前网关自身的 /api/v1/app/download 地址，必须为外部源站真实下载链接！' }, 400);
      }
    }

    await AppService.updateVersion(c.env.DB, id, body);
    return c.json({ code: 0, message: 'Version updated successfully' });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to update version: ' + e.message }, 500);
  }
});

/**
 * 删除版本记录及 R2 文件
 * DELETE /api/admin/versions/:id
 */
adminAppsRoutes.delete('/api/admin/versions/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await AppService.deleteVersion(c.env.DB, c.env.BUCKET, id);
    return c.json({ code: 0, message: 'Version deleted successfully' });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to delete version: ' + e.message }, 500);
  }
});

/**
 * 获取指定版本的所有分发安装包列表
 * GET /api/admin/versions/:versionId/packages
 */
adminAppsRoutes.get('/api/admin/versions/:versionId/packages', async (c) => {
  const versionId = c.req.param('versionId');
  const pkgs = await AppService.listPackagesByVersionId(c.env.DB, versionId);
  return c.json({ code: 0, message: 'success', data: pkgs });
});

/**
 * 为指定版本新增分发安装包 (不同平台/架构)
 * POST /api/admin/versions/:versionId/packages
 */
adminAppsRoutes.post('/api/admin/versions/:versionId/packages', async (c) => {
  try {
    const versionId = c.req.param('versionId');
    const version = await AppService.getVersionById(c.env.DB, versionId);
    if (!version) {
      return c.json({ code: 404, message: 'Version not found' }, 404);
    }

    const body = await c.req.json<{
      platform?: string;
      arch?: string;
      file_key?: string;
      file_name?: string;
      file_size?: number;
      file_md5?: string;
      file_sha256?: string;
      external_url?: string;
      use_proxy?: number;
    }>();

    if (!body.file_key && !body.external_url) {
      return c.json({ code: 400, message: '必须选择上传安装包文件或填写第三方下载直链' }, 400);
    }

    if (body.external_url && body.external_url.trim()) {
      const ext = body.external_url.trim();
      if (!ext.startsWith('http://') && !ext.startsWith('https://')) {
        return c.json({ code: 400, message: '第三方下载直链必须以 http:// 或 https:// 开头' }, 400);
      }
      if (ext.includes('/api/v1/app/download')) {
        return c.json({ code: 400, message: '第三方直链不能填写当前网关自身的 /api/v1/app/download 地址' }, 400);
      }
    }

    const pkg = await AppService.createPackage(c.env.DB, {
      ...body,
      version_id: versionId,
      app_id: version.app_id,
    });

    return c.json({ code: 0, message: 'Package added successfully', data: pkg });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to add package: ' + e.message }, 500);
  }
});

/**
 * 修改分发安装包信息
 * PUT /api/admin/packages/:packageId
 */
adminAppsRoutes.put('/api/admin/packages/:packageId', async (c) => {
  try {
    const packageId = c.req.param('packageId');
    const body = await c.req.json<{
      platform?: string;
      arch?: string;
      file_name?: string;
      file_size?: number;
      file_md5?: string;
      file_sha256?: string;
      external_url?: string;
      use_proxy?: number;
    }>();

    if (body.external_url && body.external_url.trim()) {
      const ext = body.external_url.trim();
      if (!ext.startsWith('http://') && !ext.startsWith('https://')) {
        return c.json({ code: 400, message: '第三方下载直链必须以 http:// 或 https:// 开头' }, 400);
      }
      if (ext.includes('/api/v1/app/download')) {
        return c.json({ code: 400, message: '第三方直链不能填写当前网关自身的 /api/v1/app/download 地址' }, 400);
      }
    }

    await AppService.updatePackage(c.env.DB, packageId, body);
    return c.json({ code: 0, message: 'Package updated successfully' });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to update package: ' + e.message }, 500);
  }
});

/**
 * 删除分发安装包及对应的 R2 存储
 * DELETE /api/admin/packages/:packageId
 */
adminAppsRoutes.delete('/api/admin/packages/:packageId', async (c) => {
  try {
    const packageId = c.req.param('packageId');
    await AppService.deletePackage(c.env.DB, c.env.BUCKET, packageId);
    return c.json({ code: 0, message: 'Package deleted successfully' });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to delete package: ' + e.message }, 500);
  }
});
