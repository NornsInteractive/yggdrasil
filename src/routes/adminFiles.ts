// ==============================================================================
// Yggdrasil (ygg) - Admin Generic Files Management Routes
// ==============================================================================

import { Hono } from 'hono';
import { Env } from '../types';
import { FileService } from '../services/fileService';
import { adminAuthMiddleware } from '../middleware/auth';

export const adminFilesRoutes = new Hono<{ Bindings: Env }>();

adminFilesRoutes.use('*', adminAuthMiddleware);

/**
 * 获取通用文件列表
 * GET /api/admin/files
 */
adminFilesRoutes.get('/api/admin/files', async (c) => {
  const category = c.req.query('category');
  const search = c.req.query('search');
  const limit = parseInt(c.req.query('limit') || '50', 10);
  const offset = parseInt(c.req.query('offset') || '0', 10);

  const result = await FileService.listFiles(c.env.DB, { category, search, limit, offset });
  return c.json({ code: 0, message: 'success', data: result });
});

/**
 * 获取现有文件分类列表
 * GET /api/admin/categories
 */
adminFilesRoutes.get('/api/admin/categories', async (c) => {
  const categories = await FileService.getCategories(c.env.DB);
  return c.json({ code: 0, message: 'success', data: categories });
});

/**
 * 登记新通用文件记录 (通常在上传完成后调用)
 * POST /api/admin/files
 */
adminFilesRoutes.post('/api/admin/files', async (c) => {
  try {
    const body = await c.req.json<{
      name: string;
      category?: string;
      file_key: string;
      file_name: string;
      file_size: number;
      mime_type?: string;
      file_md5?: string;
      alias?: string;
      is_public?: number;
    }>();

    if (!body.name || !body.file_key || !body.file_name || !body.file_size) {
      return c.json({ code: 400, message: 'Missing required file fields (name, file_key, file_name, file_size)' }, 400);
    }

    if (body.alias) {
      const existing = await FileService.getFileByAlias(c.env.DB, body.alias);
      if (existing) {
        return c.json({ code: 409, message: `File alias '${body.alias}' is already in use` }, 409);
      }
    }

    const file = await FileService.createFile(c.env.DB, body);
    return c.json({ code: 0, message: 'File created successfully', data: file });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to create file: ' + e.message }, 500);
  }
});

/**
 * 修改通用文件信息
 * PUT /api/admin/files/:id
 */
adminFilesRoutes.put('/api/admin/files/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json<{
      name?: string;
      category?: string;
      alias?: string;
      is_public?: number;
    }>();

    if (body.alias) {
      const existing = await FileService.getFileByAlias(c.env.DB, body.alias);
      if (existing && existing.id !== id) {
        return c.json({ code: 409, message: `File alias '${body.alias}' is already in use` }, 409);
      }
    }

    await FileService.updateFile(c.env.DB, id, body);
    return c.json({ code: 0, message: 'File updated successfully' });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to update file: ' + e.message }, 500);
  }
});

/**
 * 删除通用文件
 * DELETE /api/admin/files/:id
 */
adminFilesRoutes.delete('/api/admin/files/:id', async (c) => {
  try {
    const id = c.req.param('id');
    await FileService.deleteFile(c.env.DB, c.env.BUCKET, id);
    return c.json({ code: 0, message: 'File deleted successfully' });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to delete file: ' + e.message }, 500);
  }
});
