// ==============================================================================
// Yggdrasil (ygg) - App & Version Service (D1 Query & Update Logic)
// ==============================================================================

import { AppEntity, AppVersionEntity, VersionCheckData } from '../types';
import { StorageService } from './storageService';

export class AppService {
  /**
   * 获取所有应用列表 (附带最新版本信息及版本总数)
   */
  static async listApps(db: D1Database): Promise<any[]> {
    const { results } = await db.prepare(`
      SELECT 
        a.*,
        (SELECT COUNT(1) FROM app_versions v WHERE v.app_id = a.app_id) AS version_count,
        (SELECT SUM(download_count) FROM app_versions v WHERE v.app_id = a.app_id) AS total_downloads,
        (SELECT version_name FROM app_versions v WHERE v.app_id = a.app_id AND v.is_published = 1 ORDER BY v.version_code DESC LIMIT 1) AS latest_version_name,
        (SELECT version_code FROM app_versions v WHERE v.app_id = a.app_id AND v.is_published = 1 ORDER BY v.version_code DESC LIMIT 1) AS latest_version_code
      FROM apps a
      ORDER BY a.created_at DESC
    `).all();

    return results || [];
  }

  /**
   * 获取单个应用详情
   */
  static async getAppByAppId(db: D1Database, appId: string): Promise<AppEntity | null> {
    const app = await db.prepare('SELECT * FROM apps WHERE app_id = ?')
      .bind(appId)
      .first<AppEntity>();
    return app || null;
  }

  /**
   * 创建新应用
   */
  static async createApp(
    db: D1Database,
    data: { app_id: string; name: string; icon_url?: string; description?: string }
  ): Promise<AppEntity> {
    const id = 'app_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();

    await db.prepare(`
      INSERT INTO apps (id, app_id, name, icon_url, description, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      data.app_id.trim(),
      data.name.trim(),
      data.icon_url?.trim() || null,
      data.description?.trim() || null,
      now,
      now
    ).run();

    return {
      id,
      app_id: data.app_id.trim(),
      name: data.name.trim(),
      icon_url: data.icon_url || null,
      description: data.description || null,
      created_at: now,
      updated_at: now,
    };
  }

  /**
   * 更新应用信息
   */
  static async updateApp(
    db: D1Database,
    appId: string,
    data: { name?: string; icon_url?: string; description?: string }
  ): Promise<void> {
    const now = new Date().toISOString();
    await db.prepare(`
      UPDATE apps 
      SET name = COALESCE(?, name),
          icon_url = COALESCE(?, icon_url),
          description = COALESCE(?, description),
          updated_at = ?
      WHERE app_id = ?
    `).bind(
      data.name?.trim() || null,
      data.icon_url?.trim() || null,
      data.description?.trim() || null,
      now,
      appId
    ).run();
  }

  /**
   * 删除应用及所有版本和对应 R2 存储
   */
  static async deleteApp(db: D1Database, bucket: R2Bucket, appId: string): Promise<void> {
    // 查找该应用下的所有版本以清理 R2
    const { results } = await db.prepare('SELECT file_key FROM app_versions WHERE app_id = ?')
      .bind(appId)
      .all<{ file_key: string }>();

    if (results && results.length > 0) {
      for (const row of results) {
        if (row.file_key) {
          await StorageService.deleteObject(bucket, row.file_key);
        }
      }
    }

    // 级联删除 app_versions 和 apps
    await db.prepare('DELETE FROM app_versions WHERE app_id = ?').bind(appId).run();
    await db.prepare('DELETE FROM apps WHERE app_id = ?').bind(appId).run();
  }

  /**
   * 获取指定 App 的版本列表
   */
  static async listVersions(db: D1Database, appId: string): Promise<AppVersionEntity[]> {
    const { results } = await db.prepare(`
      SELECT * FROM app_versions 
      WHERE app_id = ? 
      ORDER BY version_code DESC, created_at DESC
    `).bind(appId).all<AppVersionEntity>();

    return results || [];
  }

  /**
   * 发布新版本
   */
  static async createVersion(
    db: D1Database,
    data: {
      app_id: string;
      version_code: number;
      version_name: string;
      min_version_code?: number;
      channel?: string;
      changelog?: string;
      file_key: string;
      file_name: string;
      file_size: number;
      file_md5?: string;
      file_sha256?: string;
      is_force_update?: number;
      is_published?: number;
    }
  ): Promise<AppVersionEntity> {
    const id = 'ver_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();
    const channel = data.channel?.trim() || 'default';
    const minVersionCode = data.min_version_code !== undefined ? data.min_version_code : 0;
    const isForce = data.is_force_update ? 1 : 0;
    const isPublished = data.is_published !== undefined ? data.is_published : 1;

    await db.prepare(`
      INSERT INTO app_versions (
        id, app_id, version_code, version_name, min_version_code, channel, 
        changelog, file_key, file_name, file_size, file_md5, file_sha256, 
        is_force_update, is_published, download_count, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    `).bind(
      id,
      data.app_id,
      data.version_code,
      data.version_name.trim(),
      minVersionCode,
      channel,
      data.changelog?.trim() || '',
      data.file_key,
      data.file_name,
      data.file_size,
      data.file_md5 || null,
      data.file_sha256 || null,
      isForce,
      isPublished,
      now
    ).run();

    return {
      id,
      app_id: data.app_id,
      version_code: data.version_code,
      version_name: data.version_name.trim(),
      min_version_code: minVersionCode,
      channel,
      changelog: data.changelog || '',
      file_key: data.file_key,
      file_name: data.file_name,
      file_size: data.file_size,
      file_md5: data.file_md5 || null,
      file_sha256: data.file_sha256 || null,
      is_force_update: isForce,
      is_published: isPublished,
      download_count: 0,
      created_at: now,
    };
  }

  /**
   * 更新版本属性 (修改更新日志、是否强更、发布状态等)
   */
  static async updateVersion(
    db: D1Database,
    versionId: string,
    data: {
      version_name?: string;
      min_version_code?: number;
      channel?: string;
      changelog?: string;
      is_force_update?: number;
      is_published?: number;
    }
  ): Promise<void> {
    await db.prepare(`
      UPDATE app_versions 
      SET version_name = COALESCE(?, version_name),
          min_version_code = COALESCE(?, min_version_code),
          channel = COALESCE(?, channel),
          changelog = COALESCE(?, changelog),
          is_force_update = COALESCE(?, is_force_update),
          is_published = COALESCE(?, is_published)
      WHERE id = ?
    `).bind(
      data.version_name?.trim() || null,
      data.min_version_code !== undefined ? data.min_version_code : null,
      data.channel?.trim() || null,
      data.changelog !== undefined ? data.changelog : null,
      data.is_force_update !== undefined ? data.is_force_update : null,
      data.is_published !== undefined ? data.is_published : null,
      versionId
    ).run();
  }

  /**
   * 删除指定版本并清理 R2
   */
  static async deleteVersion(db: D1Database, bucket: R2Bucket, versionId: string): Promise<void> {
    const version = await db.prepare('SELECT file_key FROM app_versions WHERE id = ?')
      .bind(versionId)
      .first<{ file_key: string }>();

    if (version && version.file_key) {
      await StorageService.deleteObject(bucket, version.file_key);
    }

    await db.prepare('DELETE FROM app_versions WHERE id = ?').bind(versionId).run();
  }

  /**
   * 获取指定的最新已发布版本 (供客户端检测更新)
   */
  static async getLatestPublishedVersion(
    db: D1Database,
    appId: string,
    channel: string = 'default'
  ): Promise<AppVersionEntity | null> {
    let version = await db.prepare(`
      SELECT * FROM app_versions 
      WHERE app_id = ? AND channel = ? AND is_published = 1 
      ORDER BY version_code DESC, created_at DESC 
      LIMIT 1
    `).bind(appId, channel).first<AppVersionEntity>();

    // 若指定渠道无版本且不是 default，则回退到 default 渠道
    if (!version && channel !== 'default') {
      version = await db.prepare(`
        SELECT * FROM app_versions 
        WHERE app_id = ? AND channel = 'default' AND is_published = 1 
        ORDER BY version_code DESC, created_at DESC 
        LIMIT 1
      `).bind(appId).first<AppVersionEntity>();
    }

    return version || null;
  }

  /**
   * 根据版本号获取指定版本的下载元数据
   */
  static async getVersionForDownload(
    db: D1Database,
    appId: string,
    versionCode?: number,
    channel: string = 'default'
  ): Promise<AppVersionEntity | null> {
    if (versionCode !== undefined && !isNaN(versionCode) && versionCode > 0) {
      const ver = await db.prepare(`
        SELECT * FROM app_versions 
        WHERE app_id = ? AND version_code = ? AND is_published = 1 
        ORDER BY created_at DESC LIMIT 1
      `).bind(appId, versionCode).first<AppVersionEntity>();
      if (ver) return ver;
    }

    return await this.getLatestPublishedVersion(db, appId, channel);
  }

  /**
   * 增加版本下载计数
   */
  static async incrementDownloadCount(db: D1Database, versionId: string): Promise<void> {
    try {
      await db.prepare('UPDATE app_versions SET download_count = download_count + 1 WHERE id = ?')
        .bind(versionId)
        .run();
    } catch (e) {
      console.warn('[AppService] Failed to increment download count:', e);
    }
  }

  /**
   * 客户端核心检测逻辑
   */
  static async checkAppUpdate(
    db: D1Database,
    appId: string,
    currentVersionCode: number = 0,
    channel: string = 'default',
    originUrl: string
  ): Promise<VersionCheckData | null> {
    const app = await this.getAppByAppId(db, appId);
    if (!app) return null;

    const latest = await this.getLatestPublishedVersion(db, appId, channel);
    if (!latest) return null;

    const hasUpdate = latest.version_code > currentVersionCode;
    
    // 强制更新判断逻辑：
    // 1. 本版本标记了 is_force_update == 1
    // 2. 或客户端当前版本号低于本版本设定的最低支持版本 min_version_code
    let isForce = false;
    if (hasUpdate) {
      if (latest.is_force_update === 1) {
        isForce = true;
      } else if (latest.min_version_code > 0 && currentVersionCode < latest.min_version_code) {
        isForce = true;
      }
    }

    const downloadUrl = `${originUrl}/api/v1/app/download?app_id=${encodeURIComponent(appId)}&version_code=${latest.version_code}&channel=${encodeURIComponent(latest.channel)}`;

    return {
      has_update: hasUpdate,
      is_force: isForce,
      app_id: app.app_id,
      app_name: app.name,
      icon_url: app.icon_url,
      current_version_code: currentVersionCode > 0 ? currentVersionCode : undefined,
      latest_version_code: latest.version_code,
      latest_version_name: latest.version_name,
      min_version_code: latest.min_version_code,
      channel: latest.channel,
      changelog: latest.changelog || '',
      download_url: downloadUrl,
      file_name: latest.file_name,
      file_size: latest.file_size,
      file_md5: latest.file_md5,
      file_sha256: latest.file_sha256,
      release_time: latest.created_at,
    };
  }
}
