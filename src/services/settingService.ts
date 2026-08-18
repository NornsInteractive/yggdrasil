// ==============================================================================
// Yggdrasil (ygg) - Settings Service (D1 Persistence & Configuration)
// ==============================================================================

import { SETTING_KEYS, DEFAULT_CONFIG } from '../config/constants';
import { SystemSettingEntity } from '../types';

export class SettingService {
  /**
   * 获取单个系统配置值
   */
  static async getSetting(db: D1Database, key: string, defaultValue: string = ''): Promise<string> {
    try {
      const row = await db.prepare('SELECT value FROM system_settings WHERE key = ?')
        .bind(key)
        .first<{ value: string }>();
      return row ? row.value : defaultValue;
    } catch (e) {
      console.warn(`[SettingService] Failed to read setting ${key}:`, e);
      return defaultValue;
    }
  }

  /**
   * 获取所有系统配置为键值对字典
   */
  static async getAllSettings(db: D1Database): Promise<Record<string, string>> {
    const defaults: Record<string, string> = {
      [SETTING_KEYS.API_TOKEN_ENABLED]: 'false',
      [SETTING_KEYS.API_FIXED_TOKEN]: DEFAULT_CONFIG.DEFAULT_API_TOKEN,
      [SETTING_KEYS.APP_CHECK_REQUIRE_TOKEN]: 'false',
      [SETTING_KEYS.APP_DOWNLOAD_REQUIRE_TOKEN]: 'false',
      [SETTING_KEYS.FILE_DOWNLOAD_REQUIRE_TOKEN]: 'false',
      [SETTING_KEYS.SITE_TITLE]: 'Yggdrasil - 应用与文件分发管理中心',
    };

    try {
      const { results } = await db.prepare('SELECT key, value FROM system_settings').all<SystemSettingEntity>();
      if (results && results.length > 0) {
        for (const item of results) {
          defaults[item.key] = item.value;
        }
      }
    } catch (e) {
      console.warn('[SettingService] Failed to query system_settings table:', e);
    }

    return defaults;
  }

  /**
   * 更新或设置单个系统配置
   */
  static async setSetting(db: D1Database, key: string, value: string, description?: string): Promise<void> {
    const now = new Date().toISOString();
    await db.prepare(`
      INSERT INTO system_settings (key, value, description, updated_at) 
      VALUES (?, ?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `).bind(key, value, description || null, now).run();
  }

  /**
   * 批量更新设置
   */
  static async updateSettings(db: D1Database, settings: Record<string, string>): Promise<void> {
    const statements = Object.entries(settings).map(([key, value]) => {
      const now = new Date().toISOString();
      return db.prepare(`
        INSERT INTO system_settings (key, value, updated_at) 
        VALUES (?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
      `).bind(key, String(value), now);
    });

    if (statements.length > 0) {
      await db.batch(statements);
    }
  }

  /**
   * 判断某个操作（app_check / app_download / file_download）是否需要校验 API Token
   */
  static async checkAuthRequirement(
    db: D1Database,
    action: 'app_check' | 'app_download' | 'file_download'
  ): Promise<{ required: boolean; fixedToken: string }> {
    const settings = await this.getAllSettings(db);
    const globalEnabled = settings[SETTING_KEYS.API_TOKEN_ENABLED] === 'true';
    const fixedToken = settings[SETTING_KEYS.API_FIXED_TOKEN] || DEFAULT_CONFIG.DEFAULT_API_TOKEN;

    if (!globalEnabled) {
      return { required: false, fixedToken };
    }

    let actionSpecificKey = '';
    if (action === 'app_check') actionSpecificKey = SETTING_KEYS.APP_CHECK_REQUIRE_TOKEN;
    else if (action === 'app_download') actionSpecificKey = SETTING_KEYS.APP_DOWNLOAD_REQUIRE_TOKEN;
    else if (action === 'file_download') actionSpecificKey = SETTING_KEYS.FILE_DOWNLOAD_REQUIRE_TOKEN;

    const specificRequired = settings[actionSpecificKey] === 'true';
    return {
      required: specificRequired,
      fixedToken,
    };
  }
}
