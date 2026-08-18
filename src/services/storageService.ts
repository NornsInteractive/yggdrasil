// ==============================================================================
// Yggdrasil (ygg) - Storage Service (Cloudflare R2 & HTTP Range 206 Resumable)
// ==============================================================================

export interface RangeResult {
  response: Response;
}

export class StorageService {
  /**
   * 生成规范化的 R2 存储路径 Key
   */
  static generateFileKey(category: string, originalFilename: string): string {
    const cleanCategory = category.replace(/[^a-zA-Z0-9_-]/g, '') || 'general';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const sanitizedFilename = originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
    return `${cleanCategory}/${timestamp}_${randomStr}_${sanitizedFilename}`;
  }

  /**
   * 流式传输并支持 HTTP Range 206 断点续传响应
   */
  static async serveFileWithRange(
    bucket: R2Bucket,
    key: string,
    downloadFilename: string,
    rangeHeader: string | null | undefined,
    mimeType?: string | null
  ): Promise<Response> {
    let r2Range: R2Range | undefined = undefined;

    // 解析 Range 头部 (例如: bytes=100-200 或 bytes=100- 或 bytes=-200)
    if (rangeHeader && rangeHeader.startsWith('bytes=')) {
      const byteRangeStr = rangeHeader.substring(6).trim();
      const parts = byteRangeStr.split('-');
      
      if (parts.length === 2) {
        if (parts[0] !== '' && parts[1] !== '') {
          // bytes=100-200
          const offset = parseInt(parts[0], 10);
          const end = parseInt(parts[1], 10);
          if (!isNaN(offset) && !isNaN(end) && end >= offset) {
            r2Range = { offset, length: end - offset + 1 };
          }
        } else if (parts[0] !== '' && parts[1] === '') {
          // bytes=100-
          const offset = parseInt(parts[0], 10);
          if (!isNaN(offset)) {
            r2Range = { offset };
          }
        } else if (parts[0] === '' && parts[1] !== '') {
          // bytes=-200 (末尾 200 字节)
          const suffix = parseInt(parts[1], 10);
          if (!isNaN(suffix)) {
            r2Range = { suffix };
          }
        }
      }
    }

    const object = await bucket.get(key, r2Range ? { range: r2Range } : undefined);

    if (!object) {
      return new Response(JSON.stringify({ code: 404, message: 'File object not found in R2 storage' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('ETag', object.httpEtag);
    headers.set('Accept-Ranges', 'bytes');
    
    // 设置下载文件名
    const encodedName = encodeURIComponent(downloadFilename).replace(/['()]/g, escape);
    headers.set('Content-Disposition', `attachment; filename="${downloadFilename}"; filename*=UTF-8''${encodedName}`);

    if (mimeType) {
      headers.set('Content-Type', mimeType);
    } else if (!headers.has('Content-Type')) {
      if (downloadFilename.endsWith('.apk')) {
        headers.set('Content-Type', 'application/vnd.android.package-archive');
      } else {
        headers.set('Content-Type', 'application/octet-stream');
      }
    }

    // 处理 206 Partial Content 或 200 OK
    if (object.range) {
      let offset = 0;
      let length = object.size;

      if ('offset' in object.range && object.range.offset !== undefined) {
        offset = object.range.offset;
        length = object.range.length !== undefined ? object.range.length : object.size - offset;
      } else if ('suffix' in object.range && object.range.suffix !== undefined) {
        const suffix = object.range.suffix;
        offset = Math.max(0, object.size - suffix);
        length = object.size - offset;
      }

      const end = offset + length - 1;
      headers.set('Content-Range', `bytes ${offset}-${end}/${object.size}`);
      headers.set('Content-Length', `${length}`);

      return new Response(object.body as unknown as BodyInit, {
        status: 206,
        headers,
      });
    } else {
      headers.set('Content-Length', `${object.size}`);
      return new Response(object.body as unknown as BodyInit, {
        status: 200,
        headers,
      });
    }
  }

  /**
   * 直传对象到 R2
   */
  static async putObject(
    bucket: R2Bucket,
    key: string,
    data: ReadableStream | ArrayBuffer | string,
    options?: {
      httpMetadata?: R2HTTPMetadata;
      customMetadata?: Record<string, string>;
    }
  ): Promise<R2Object> {
    return await bucket.put(key, data, options);
  }

  /**
   * 删除 R2 对象
   */
  static async deleteObject(bucket: R2Bucket, key: string): Promise<void> {
    try {
      await bucket.delete(key);
    } catch (e) {
      console.warn(`[StorageService] Failed to delete R2 object ${key}:`, e);
    }
  }

  /**
   * 初始化分片上传
   */
  static async createMultipartUpload(
    bucket: R2Bucket,
    key: string,
    httpMetadata?: R2HTTPMetadata
  ): Promise<R2MultipartUpload> {
    return await bucket.createMultipartUpload(key, { httpMetadata });
  }

  /**
   * 恢复已有分片上传句柄
   */
  static resumeMultipartUpload(bucket: R2Bucket, key: string, uploadId: string): R2MultipartUpload {
    return bucket.resumeMultipartUpload(key, uploadId);
  }
}
