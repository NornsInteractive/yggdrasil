// ==============================================================================
// Yggdrasil (ygg) - Admin File Upload Routes (Direct & Multipart R2)
// ==============================================================================

import { Hono } from 'hono';
import { Env } from '../types';
import { StorageService } from '../services/storageService';
import { adminAuthMiddleware } from '../middleware/auth';

export const adminUploadRoutes = new Hono<{ Bindings: Env }>();

adminUploadRoutes.use('/api/admin/*', adminAuthMiddleware);

/**
 * 标准表单直传 (适用于常规大小文件/APK)
 * POST /api/admin/upload/direct
 */
adminUploadRoutes.post('/api/admin/upload/direct', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file');
    const category = (formData.get('category') as string) || 'apk';
    const clientMd5 = (formData.get('md5') as string) || '';

    if (!file || typeof file === 'string') {
      return c.json({ code: 400, message: 'No file provided in form-data (field: file)' }, 400);
    }

    const fileObj = file as File;
    const fileName = fileObj.name || 'upload.bin';
    const fileSize = fileObj.size;
    const mimeType = fileObj.type || (fileName.endsWith('.apk') ? 'application/vnd.android.package-archive' : 'application/octet-stream');

    const fileKey = StorageService.generateFileKey(category, fileName);
    const arrayBuffer = await fileObj.arrayBuffer();

    // 计算 MD5 (若前端未提供)
    let md5 = clientMd5;
    if (!md5) {
      const digest = await crypto.subtle.digest('MD5', arrayBuffer).catch(() => null);
      if (digest) {
        md5 = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
      }
    }

    const r2Obj = await StorageService.putObject(c.env.BUCKET, fileKey, arrayBuffer, {
      httpMetadata: {
        contentType: mimeType,
      },
      customMetadata: {
        originalName: fileName,
        md5: md5 || '',
      },
    });

    return c.json({
      code: 0,
      message: 'Upload successful',
      data: {
        file_key: fileKey,
        file_name: fileName,
        file_size: fileSize,
        mime_type: mimeType,
        file_md5: md5 || r2Obj.httpEtag.replace(/"/g, ''),
      },
    });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Upload failed: ' + e.message }, 500);
  }
});

/**
 * 大文件分片上传 1: 初始化 Multipart Upload
 * POST /api/admin/upload/multipart/init
 */
adminUploadRoutes.post('/api/admin/upload/multipart/init', async (c) => {
  try {
    const body = await c.req.json<{ fileName: string; category?: string; mimeType?: string }>();
    if (!body.fileName) {
      return c.json({ code: 400, message: 'fileName is required' }, 400);
    }

    const category = body.category || 'apk';
    const mimeType = body.mimeType || (body.fileName.endsWith('.apk') ? 'application/vnd.android.package-archive' : 'application/octet-stream');
    const fileKey = StorageService.generateFileKey(category, body.fileName);

    const multipart = await StorageService.createMultipartUpload(c.env.BUCKET, fileKey, {
      contentType: mimeType,
    });

    return c.json({
      code: 0,
      message: 'Multipart upload initialized',
      data: {
        upload_id: multipart.uploadId,
        file_key: fileKey,
        file_name: body.fileName,
      },
    });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to init multipart upload: ' + e.message }, 500);
  }
});

/**
 * 大文件分片上传 2: 上传单片 Part
 * PUT /api/admin/upload/multipart/part
 */
adminUploadRoutes.put('/api/admin/upload/multipart/part', async (c) => {
  try {
    const uploadId = c.req.query('uploadId') || c.req.query('upload_id');
    const fileKey = c.req.query('fileKey') || c.req.query('file_key');
    const partNumberStr = c.req.query('partNumber') || c.req.query('part_number');

    if (!uploadId || !fileKey || !partNumberStr) {
      return c.json({ code: 400, message: 'Missing uploadId, fileKey or partNumber query parameter' }, 400);
    }

    const partNumber = parseInt(partNumberStr, 10);
    const bodyBuffer = await c.req.arrayBuffer();

    const multipart = StorageService.resumeMultipartUpload(c.env.BUCKET, fileKey, uploadId);
    const uploadedPart = await multipart.uploadPart(partNumber, bodyBuffer);

    return c.json({
      code: 0,
      message: 'Part uploaded',
      data: {
        partNumber: uploadedPart.partNumber,
        etag: uploadedPart.etag,
      },
    });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to upload part: ' + e.message }, 500);
  }
});

/**
 * 大文件分片上传 3: 完成合并 Complete Multipart Upload
 * POST /api/admin/upload/multipart/complete
 */
adminUploadRoutes.post('/api/admin/upload/multipart/complete', async (c) => {
  try {
    const body = await c.req.json<{
      upload_id: string;
      file_key: string;
      parts: Array<{ partNumber: number; etag: string }>;
      file_name: string;
      file_size: number;
      file_md5?: string;
    }>();

    if (!body.upload_id || !body.file_key || !body.parts || body.parts.length === 0) {
      return c.json({ code: 400, message: 'Missing upload_id, file_key or parts array' }, 400);
    }

    // 确保 parts 按 partNumber 升序排列
    const sortedParts = [...body.parts].sort((a, b) => a.partNumber - b.partNumber);

    const multipart = StorageService.resumeMultipartUpload(c.env.BUCKET, body.file_key, body.upload_id);
    const r2Obj = await multipart.complete(sortedParts);

    return c.json({
      code: 0,
      message: 'Multipart upload completed',
      data: {
        file_key: body.file_key,
        file_name: body.file_name,
        file_size: body.file_size || r2Obj.size,
        file_md5: body.file_md5 || r2Obj.httpEtag.replace(/"/g, ''),
      },
    });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to complete multipart upload: ' + e.message }, 500);
  }
});

/**
 * 大文件分片上传 4: 中止取消 Abort Multipart Upload
 * POST /api/admin/upload/multipart/abort
 */
adminUploadRoutes.post('/api/admin/upload/multipart/abort', async (c) => {
  try {
    const body = await c.req.json<{ upload_id: string; file_key: string }>();
    if (!body.upload_id || !body.file_key) {
      return c.json({ code: 400, message: 'Missing upload_id or file_key' }, 400);
    }

    const multipart = StorageService.resumeMultipartUpload(c.env.BUCKET, body.file_key, body.upload_id);
    await multipart.abort();

    return c.json({ code: 0, message: 'Multipart upload aborted successfully' });
  } catch (e: any) {
    return c.json({ code: 500, message: 'Failed to abort multipart upload: ' + e.message }, 500);
  }
});
