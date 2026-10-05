// ==============================================================================
// Yggdrasil (ygg) - Auto Cleanup Service (Old Version Garbage Collection)
// ==============================================================================

import { SETTING_KEYS } from '../config/constants';
import { SettingService } from './settingService';
import { StorageService } from './storageService';

export interface CleanupResult {
  enabled: boolean;
  deleted: number;
  freedBytes: number;
  details: Array<{
    app_id: string;
    version_name: string;
    version_code: number;
    channel: string;
    file_size: number;
    created_at: string;
  }>;
}

export class CleanupService {
  /**
   * 根据系统设置自动清理过期旧版本
   */
  static async runCleanup(db: D1Database, bucket: R2Bucket): Promise<CleanupResult> {
    const settings = await SettingService.getAllSettings(db);
    const enabled = settings[SETTING_KEYS.AUTO_CLEANUP_ENABLED] === 'true';

    if (!enabled) {
      return { enabled: false, deleted: 0, freedBytes: 0, details: [] };
    }

    const days = parseInt(settings[SETTING_KEYS.AUTO_CLEANUP_DAYS] || '90', 10) || 90;
    const keepLatest = parseInt(settings[SETTING_KEYS.AUTO_CLEANUP_KEEP_LATEST] || '3', 10) || 3;

    return await this.executeCleanup(db, bucket, days, keepLatest);
  }

  /**
   * 手动强制清理 (忽略开关状态，直接按参数执行)
   */
  static async forceCleanup(
    db: D1Database,
    bucket: R2Bucket,
    days: number,
    keepLatest: number
  ): Promise<CleanupResult> {
    return await this.executeCleanup(db, bucket, days, keepLatest);
  }

  /**
   * 核心清理执行逻辑
   */
  private static async executeCleanup(
    db: D1Database,
    bucket: R2Bucket,
    days: number,
    keepLatest: number
  ): Promise<CleanupResult> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const result: CleanupResult = { enabled: true, deleted: 0, freedBytes: 0, details: [] };

    try {
      // 1. 获取所有 app + channel 组合
      const { results: groups } = await db.prepare(
        'SELECT DISTINCT app_id, channel FROM app_versions'
      ).all<{ app_id: string; channel: string }>();

      if (!groups || groups.length === 0) return result;

      for (const group of groups) {
        // 2. 获取该 app+channel 下需要保留的最新 N 个版本的 ID
        const { results: keepIds } = await db.prepare(
          `SELECT id FROM app_versions 
           WHERE app_id = ? AND channel = ? 
           ORDER BY version_code DESC, created_at DESC 
           LIMIT ?`
        ).bind(group.app_id, group.channel, keepLatest)
          .all<{ id: string }>();

        const keepSet = new Set((keepIds || []).map(r => r.id));

        // 3. 查找该组合下所有早于截止日期的版本
        const { results: candidates } = await db.prepare(
          `SELECT id, app_id, version_name, version_code, channel, file_key, file_size, created_at 
           FROM app_versions 
           WHERE app_id = ? AND channel = ? AND created_at < ?
           ORDER BY version_code ASC`
        ).bind(group.app_id, group.channel, cutoffDate)
          .all<{
            id: string; app_id: string; version_name: string;
            version_code: number; channel: string;
            file_key: string; file_size: number; created_at: string;
          }>();

        if (!candidates || candidates.length === 0) continue;

        for (const ver of candidates) {
          // 跳过需要保留的版本
          if (keepSet.has(ver.id)) continue;

          // 4. 删除 R2 对象
          if (ver.file_key) {
            try {
              await StorageService.deleteObject(bucket, ver.file_key);
            } catch (e) {
              console.warn(`[CleanupService] Failed to delete R2 object ${ver.file_key}:`, e);
            }
          }

          // 5. 删除 D1 记录
          await db.prepare('DELETE FROM app_versions WHERE id = ?').bind(ver.id).run();

          result.deleted++;
          result.freedBytes += ver.file_size || 0;
          result.details.push({
            app_id: ver.app_id,
            version_name: ver.version_name,
            version_code: ver.version_code,
            channel: ver.channel,
            file_size: ver.file_size || 0,
            created_at: ver.created_at || '',
          });
        }
      }
    } catch (e) {
      console.error('[CleanupService] Cleanup execution error:', e);
    }

    return result;
  }
}
