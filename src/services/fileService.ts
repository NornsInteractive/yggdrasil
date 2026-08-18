// ==============================================================================
// Yggdrasil (ygg) - Generic File Service (D1 Query & Operations)
// ==============================================================================

import { FileEntity } from '../types';
import { StorageService } from './storageService';

export class FileService {
  /**
   * 获取文件列表 (支持分类筛选与关键词搜索)
   */
  static async listFiles(
    db: D1Database,
    options?: { category?: string; search?: string; limit?: number; offset?: number }
  ): Promise<{ files: FileEntity[]; total: number }> {
    let sql = 'SELECT * FROM files WHERE 1=1';
    let countSql = 'SELECT COUNT(1) as total FROM files WHERE 1=1';
    const params: any[] = [];
    const countParams: any[] = [];

    if (options?.category && options.category !== 'all') {
      sql += ' AND category = ?';
      countSql += ' AND category = ?';
      params.push(options.category);
      countParams.push(options.category);
    }

    if (options?.search) {
      const searchTerm = `%${options.search}%`;
      sql += ' AND (name LIKE ? OR file_name LIKE ? OR alias LIKE ?)';
      countSql += ' AND (name LIKE ? OR file_name LIKE ? OR alias LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' ORDER BY created_at DESC';

    const limit = options?.limit || 50;
    const offset = options?.offset || 0;
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const countRes = await db.prepare(countSql).bind(...countParams).first<{ total: number }>();
    const { results } = await db.prepare(sql).bind(...params).all<FileEntity>();

    return {
      files: results || [],
      total: countRes?.total || 0,
    };
  }

  /**
   * 根据 ID 查询文件
   */
  static async getFileById(db: D1Database, id: string): Promise<FileEntity | null> {
    const file = await db.prepare('SELECT * FROM files WHERE id = ?')
      .bind(id)
      .first<FileEntity>();
    return file || null;
  }

  /**
   * 根据短链别名查询文件
   */
  static async getFileByAlias(db: D1Database, alias: string): Promise<FileEntity | null> {
    const file = await db.prepare('SELECT * FROM files WHERE alias = ?')
      .bind(alias)
      .first<FileEntity>();
    return file || null;
  }

  /**
   * 创建通用文件记录
   */
  static async createFile(
    db: D1Database,
    data: {
      name: string;
      category?: string;
      file_key: string;
      file_name: string;
      file_size: number;
      mime_type?: string;
      file_md5?: string;
      alias?: string;
      is_public?: number;
    }
  ): Promise<FileEntity> {
    const id = 'f_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();
    const category = data.category?.trim() || 'general';
    const isPublic = data.is_public !== undefined ? data.is_public : 1;
    const alias = data.alias?.trim() || null;

    await db.prepare(`
      INSERT INTO files (
        id, name, category, file_key, file_name, file_size, 
        mime_type, file_md5, alias, is_public, download_count, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `).bind(
      id,
      data.name.trim(),
      category,
      data.file_key,
      data.file_name,
      data.file_size,
      data.mime_type || null,
      data.file_md5 || null,
      alias,
      isPublic,
      now
    ).run();

    return {
      id,
      name: data.name.trim(),
      category,
      file_key: data.file_key,
      file_name: data.file_name,
      file_size: data.file_size,
      mime_type: data.mime_type || null,
      file_md5: data.file_md5 || null,
      alias,
      is_public: isPublic,
      download_count: 0,
      created_at: now,
    };
  }

  /**
   * 更新文件信息
   */
  static async updateFile(
    db: D1Database,
    id: string,
    data: { name?: string; category?: string; alias?: string; is_public?: number }
  ): Promise<void> {
    await db.prepare(`
      UPDATE files 
      SET name = COALESCE(?, name),
          category = COALESCE(?, category),
          alias = COALESCE(?, alias),
          is_public = COALESCE(?, is_public)
      WHERE id = ?
    `).bind(
      data.name?.trim() || null,
      data.category?.trim() || null,
      data.alias !== undefined ? (data.alias?.trim() || null) : null,
      data.is_public !== undefined ? data.is_public : null,
      id
    ).run();
  }

  /**
   * 删除通用文件并清理 R2
   */
  static async deleteFile(db: D1Database, bucket: R2Bucket, id: string): Promise<void> {
    const file = await this.getFileById(db, id);
    if (file && file.file_key) {
      await StorageService.deleteObject(bucket, file.file_key);
    }
    await db.prepare('DELETE FROM files WHERE id = ?').bind(id).run();
  }

  /**
   * 增加文件下载计数
   */
  static async incrementDownloadCount(db: D1Database, id: string): Promise<void> {
    try {
      await db.prepare('UPDATE files SET download_count = download_count + 1 WHERE id = ?')
        .bind(id)
        .run();
    } catch (e) {
      console.warn('[FileService] Failed to increment download count:', e);
    }
  }

  /**
   * 获取所有现有分类列表
   */
  static async getCategories(db: D1Database): Promise<string[]> {
    const { results } = await db.prepare('SELECT DISTINCT category FROM files WHERE category IS NOT NULL').all<{ category: string }>();
    return (results || []).map(r => r.category).filter(Boolean);
  }
}
