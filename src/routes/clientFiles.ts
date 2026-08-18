// ==============================================================================
// Yggdrasil (ygg) - Client Generic Files Routes (Download & Metadata Check)
// ==============================================================================

import { Hono } from 'hono';
import { Env } from '../types';
import { FileService } from '../services/fileService';
import { StorageService } from '../services/storageService';
import { tokenGuard } from '../middleware/tokenGuard';

export const clientFilesRoutes = new Hono<{ Bindings: Env }>();

/**
 * 通用文件信息检测
 * GET /api/v1/files/check?alias=xxx
 * GET /api/v1/files/:id/check
 */
clientFilesRoutes.get('/api/v1/files/check', tokenGuard('file_download'), async (c) => {
  const alias = c.req.query('alias');
  const id = c.req.query('id');

  let file = null;
  if (alias) {
    file = await FileService.getFileByAlias(c.env.DB, alias);
  } else if (id) {
    file = await FileService.getFileById(c.env.DB, id);
  } else {
    return c.json({ code: 400, message: 'Missing alias or id query parameter' }, 400);
  }

  if (!file) {
    return c.json({ code: 404, message: 'File not found' }, 404);
  }

  const originUrl = new URL(c.req.url).origin;
  const downloadUrl = file.alias
    ? `${originUrl}/f/${file.alias}`
    : `${originUrl}/api/v1/files/${file.id}/download`;

  return c.json({
    code: 0,
    message: 'success',
    data: {
      id: file.id,
      name: file.name,
      category: file.category,
      file_name: file.file_name,
      file_size: file.file_size,
      mime_type: file.mime_type,
      file_md5: file.file_md5,
      alias: file.alias,
      download_count: file.download_count,
      download_url: downloadUrl,
      created_at: file.created_at,
    },
  });
});

clientFilesRoutes.get('/api/v1/files/:id/check', tokenGuard('file_download'), async (c) => {
  const id = c.req.param('id');
  const file = await FileService.getFileById(c.env.DB, id);
  if (!file) {
    return c.json({ code: 404, message: 'File not found' }, 404);
  }

  const originUrl = new URL(c.req.url).origin;
  const downloadUrl = file.alias
    ? `${originUrl}/f/${file.alias}`
    : `${originUrl}/api/v1/files/${file.id}/download`;

  return c.json({
    code: 0,
    message: 'success',
    data: {
      id: file.id,
      name: file.name,
      category: file.category,
      file_name: file.file_name,
      file_size: file.file_size,
      mime_type: file.mime_type,
      file_md5: file.file_md5,
      alias: file.alias,
      download_count: file.download_count,
      download_url: downloadUrl,
      created_at: file.created_at,
    },
  });
});

/**
 * 根据 ID 下载通用文件 (支持 HTTP Range 206 断点续传)
 * GET /api/v1/files/:id/download
 */
clientFilesRoutes.get('/api/v1/files/:id/download', tokenGuard('file_download'), async (c) => {
  const id = c.req.param('id');
  const file = await FileService.getFileById(c.env.DB, id);
  if (!file) {
    return c.json({ code: 404, message: 'File not found' }, 404);
  }

  c.executionCtx.waitUntil(FileService.incrementDownloadCount(c.env.DB, file.id));

  const rangeHeader = c.req.header('range');
  return await StorageService.serveFileWithRange(
    c.env.BUCKET,
    file.file_key,
    file.file_name,
    rangeHeader,
    file.mime_type
  );
});

/**
 * 根据短链别名快捷下载 (支持 HTTP Range 206 断点续传)
 * GET /f/:alias
 */
clientFilesRoutes.get('/f/:alias', tokenGuard('file_download'), async (c) => {
  const alias = c.req.param('alias');
  const file = await FileService.getFileByAlias(c.env.DB, alias);
  if (!file) {
    return c.json({ code: 404, message: 'File not found by alias' }, 404);
  }

  c.executionCtx.waitUntil(FileService.incrementDownloadCount(c.env.DB, file.id));

  const rangeHeader = c.req.header('range');
  return await StorageService.serveFileWithRange(
    c.env.BUCKET,
    file.file_key,
    file.file_name,
    rangeHeader,
    file.mime_type
  );
});
