// ==============================================================================
// Yggdrasil (ygg) - App & Version Service (D1 Query & Update Logic)
// ==============================================================================

import { AppEntity, AppVersionEntity, VersionPackageEntity, VersionCheckData } from '../types';
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
    // 查找该应用下的所有版本主文件以清理 R2
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

    // 查找该应用下所有独立分发包以清理 R2
    try {
      const { results: pkgResults } = await db.prepare('SELECT file_key FROM version_packages WHERE app_id = ?')
        .bind(appId)
        .all<{ file_key: string }>();
      if (pkgResults && pkgResults.length > 0) {
        for (const row of pkgResults) {
          if (row.file_key) {
            await StorageService.deleteObject(bucket, row.file_key);
          }
        }
      }
      await db.prepare('DELETE FROM version_packages WHERE app_id = ?').bind(appId).run();
    } catch (e) {}

    // 级联删除 app_versions 和 apps
    await db.prepare('DELETE FROM app_versions WHERE app_id = ?').bind(appId).run();
    await db.prepare('DELETE FROM apps WHERE app_id = ?').bind(appId).run();
  }

  /**
   * 获取指定 App 的版本列表
   */
  private static schemaEnsured = false;

  /**
   * 自动平滑迁移数据库表结构 (增加外链、反代、清理状态字段及 version_packages 多架构表)
   */
  static async ensureSchema(db: D1Database): Promise<void> {
    if (this.schemaEnsured) return;
    try {
      await db.prepare('ALTER TABLE app_versions ADD COLUMN external_url TEXT').run();
    } catch (e) {}
    try {
      await db.prepare('ALTER TABLE app_versions ADD COLUMN use_proxy INTEGER DEFAULT 0').run();
    } catch (e) {}
    try {
      await db.prepare('ALTER TABLE app_versions ADD COLUMN is_cleaned INTEGER DEFAULT 0').run();
    } catch (e) {}
    try {
      await db.prepare('ALTER TABLE app_versions ADD COLUMN platform TEXT DEFAULT "android"').run();
    } catch (e) {}
    try {
      await db.prepare('ALTER TABLE app_versions ADD COLUMN arch TEXT DEFAULT "universal"').run();
    } catch (e) {}
    try {
      await db.prepare(`
        CREATE TABLE IF NOT EXISTS version_packages (
          id TEXT PRIMARY KEY,
          version_id TEXT NOT NULL,
          app_id TEXT NOT NULL,
          platform TEXT NOT NULL DEFAULT 'android',
          arch TEXT NOT NULL DEFAULT 'universal',
          file_key TEXT,
          file_name TEXT NOT NULL,
          file_size INTEGER NOT NULL DEFAULT 0,
          file_md5 TEXT,
          file_sha256 TEXT,
          external_url TEXT,
          use_proxy INTEGER DEFAULT 0,
          is_cleaned INTEGER DEFAULT 0,
          download_count INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(version_id) REFERENCES app_versions(id) ON DELETE CASCADE
        )
      `).run();
    } catch (e) {}
    try {
      await db.prepare('CREATE INDEX IF NOT EXISTS idx_version_packages_lookup ON version_packages(version_id, platform, arch)').run();
    } catch (e) {}
    try {
      await db.prepare('CREATE INDEX IF NOT EXISTS idx_version_packages_app ON version_packages(app_id, platform, arch)').run();
    } catch (e) {}
    this.schemaEnsured = true;
  }

  /**
   * 获取某应用的所有版本列表 (按版本号降序，并附加所有平台/架构安装包列表)
   */
  static async listVersions(db: D1Database, appId: string, originUrl?: string): Promise<AppVersionEntity[]> {
    await this.ensureSchema(db);
    const { results } = await db.prepare(`
      SELECT * FROM app_versions 
      WHERE app_id = ? 
      ORDER BY version_code DESC, created_at DESC
    `).bind(appId).all<AppVersionEntity>();

    if (!results || results.length === 0) return [];

    let allPackages: VersionPackageEntity[] = [];
    try {
      const pkgRes = await db.prepare(`
        SELECT * FROM version_packages 
        WHERE app_id = ? 
        ORDER BY created_at ASC
      `).bind(appId).all<VersionPackageEntity>();
      allPackages = pkgRes.results || [];
    } catch (e) {}

    const packagesByVersion = new Map<string, VersionPackageEntity[]>();
    for (const pkg of allPackages) {
      if (originUrl) {
        pkg.download_url = `${originUrl}/api/v1/app/download?app_id=${encodeURIComponent(pkg.app_id)}&version_code=${results.find(v => v.id === pkg.version_id)?.version_code || 0}&package_id=${pkg.id}`;
      }
      const list = packagesByVersion.get(pkg.version_id) || [];
      list.push(pkg);
      packagesByVersion.set(pkg.version_id, list);
    }

    for (const ver of results) {
      let pkgs = packagesByVersion.get(ver.id);
      if (!pkgs || pkgs.length === 0) {
        // 兼容处理：若当前版本尚未在 version_packages 建立独立记录，自动生成合成默认包
        const legacyPkg: VersionPackageEntity = {
          id: 'pkg_def_' + ver.id,
          version_id: ver.id,
          app_id: ver.app_id,
          platform: ver.platform || 'android',
          arch: ver.arch || 'universal',
          file_key: ver.file_key || null,
          file_name: ver.file_name || 'app.apk',
          file_size: ver.file_size || 0,
          file_md5: ver.file_md5 || null,
          file_sha256: ver.file_sha256 || null,
          external_url: ver.external_url || null,
          use_proxy: ver.use_proxy || 0,
          is_cleaned: ver.is_cleaned || 0,
          download_count: ver.download_count || 0,
          created_at: ver.created_at,
          download_url: originUrl ? `${originUrl}/api/v1/app/download?app_id=${encodeURIComponent(ver.app_id)}&version_code=${ver.version_code}&channel=${encodeURIComponent(ver.channel)}` : undefined,
        };
        pkgs = [legacyPkg];
      }
      ver.packages = pkgs;
    }

    return results;
  }

  /**
   * 发布新版本 (支持直接上传至 R2 或填写第三方下载外链)
   */
  /**
   * 发布新版本 (支持直接上传至 R2 或填写第三方下载外链，支持多平台与多架构)
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
    }
  ): Promise<AppVersionEntity> {
    await this.ensureSchema(db);

    const id = 'ver_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();
    const channel = data.channel?.trim() || 'default';
    const minVersionCode = data.min_version_code !== undefined ? data.min_version_code : 0;
    const isForce = data.is_force_update ? 1 : 0;
    const isPublished = data.is_published !== undefined ? data.is_published : 1;
    const externalUrl = data.external_url?.trim() || null;
    const useProxy = data.use_proxy ? 1 : 0;
    const fileKey = data.file_key?.trim() || '';
    const platform = (data.platform?.trim().toLowerCase() || 'android');
    const arch = (data.arch?.trim().toLowerCase() || 'universal');
    const fileName = data.file_name?.trim() || (externalUrl ? `app-v${data.version_name}-${platform}-${arch}` : 'app.apk');
    const fileSize = data.file_size || 0;

    await db.prepare(`
      INSERT INTO app_versions (
        id, app_id, version_code, version_name, min_version_code, channel, 
        changelog, file_key, file_name, file_size, file_md5, file_sha256, 
        is_force_update, is_published, download_count, external_url, use_proxy, is_cleaned, platform, arch, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, 0, ?, ?, ?)
    `).bind(
      id,
      data.app_id,
      data.version_code,
      data.version_name.trim(),
      minVersionCode,
      channel,
      data.changelog?.trim() || '',
      fileKey,
      fileName,
      fileSize,
      data.file_md5 || null,
      data.file_sha256 || null,
      isForce,
      isPublished,
      externalUrl,
      useProxy,
      platform,
      arch,
      now
    ).run();

    // 自动在 version_packages 中创建主安装包
    const primaryPkg = await this.createPackage(db, {
      version_id: id,
      app_id: data.app_id,
      platform,
      arch,
      file_key: fileKey || undefined,
      file_name: fileName,
      file_size: fileSize,
      file_md5: data.file_md5,
      file_sha256: data.file_sha256,
      external_url: externalUrl || undefined,
      use_proxy: useProxy,
    });

    const packagesList = [primaryPkg];

    // 如果传入了额外的多平台分发包列表
    if (data.packages && Array.isArray(data.packages)) {
      for (const p of data.packages) {
        if (!p) continue;
        const extraPkg = await this.createPackage(db, {
          version_id: id,
          app_id: data.app_id,
          platform: p.platform || 'universal',
          arch: p.arch || 'universal',
          file_key: p.file_key,
          file_name: p.file_name,
          file_size: p.file_size,
          file_md5: p.file_md5,
          file_sha256: p.file_sha256,
          external_url: p.external_url,
          use_proxy: p.use_proxy,
        });
        packagesList.push(extraPkg);
      }
    }

    return {
      id,
      app_id: data.app_id,
      version_code: data.version_code,
      version_name: data.version_name.trim(),
      min_version_code: minVersionCode,
      channel,
      changelog: data.changelog || '',
      file_key: fileKey,
      file_name: fileName,
      file_size: fileSize,
      file_md5: data.file_md5 || null,
      file_sha256: data.file_sha256 || null,
      is_force_update: isForce,
      is_published: isPublished,
      download_count: 0,
      external_url: externalUrl,
      use_proxy: useProxy,
      is_cleaned: 0,
      platform,
      arch,
      packages: packagesList,
      created_at: now,
    };
  }

  /**
   * 为指定版本创建新的平台/架构安装包
   */
  static async createPackage(
    db: D1Database,
    data: {
      version_id: string;
      app_id: string;
      platform?: string;
      arch?: string;
      file_key?: string;
      file_name?: string;
      file_size?: number;
      file_md5?: string;
      file_sha256?: string;
      external_url?: string;
      use_proxy?: number;
    }
  ): Promise<VersionPackageEntity> {
    await this.ensureSchema(db);

    const id = 'pkg_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();
    const platform = (data.platform?.trim().toLowerCase() || 'android');
    const arch = (data.arch?.trim().toLowerCase() || 'universal');
    const externalUrl = data.external_url?.trim() || null;
    const useProxy = data.use_proxy ? 1 : 0;
    const fileKey = data.file_key?.trim() || null;
    const fileName = data.file_name?.trim() || (externalUrl ? `app-${platform}-${arch}` : 'package.bin');
    const fileSize = data.file_size || 0;

    await db.prepare(`
      INSERT INTO version_packages (
        id, version_id, app_id, platform, arch, file_key, file_name, file_size,
        file_md5, file_sha256, external_url, use_proxy, is_cleaned, download_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)
    `).bind(
      id,
      data.version_id,
      data.app_id,
      platform,
      arch,
      fileKey,
      fileName,
      fileSize,
      data.file_md5 || null,
      data.file_sha256 || null,
      externalUrl,
      useProxy,
      now,
      now
    ).run();

    return {
      id,
      version_id: data.version_id,
      app_id: data.app_id,
      platform,
      arch,
      file_key: fileKey,
      file_name: fileName,
      file_size: fileSize,
      file_md5: data.file_md5 || null,
      file_sha256: data.file_sha256 || null,
      external_url: externalUrl,
      use_proxy: useProxy,
      is_cleaned: 0,
      download_count: 0,
      created_at: now,
      updated_at: now,
    };
  }

  /**
   * 更新指定安装包属性
   */
  static async updatePackage(
    db: D1Database,
    packageId: string,
    data: {
      platform?: string;
      arch?: string;
      file_name?: string;
      file_size?: number;
      file_md5?: string;
      file_sha256?: string;
      external_url?: string;
      use_proxy?: number;
    }
  ): Promise<void> {
    await this.ensureSchema(db);
    const updates: string[] = [];
    const values: any[] = [];
    const now = new Date().toISOString();

    if (data.platform !== undefined) {
      updates.push('platform = ?');
      values.push(data.platform.trim().toLowerCase() || 'android');
    }
    if (data.arch !== undefined) {
      updates.push('arch = ?');
      values.push(data.arch.trim().toLowerCase() || 'universal');
    }
    if (data.file_name !== undefined) {
      updates.push('file_name = ?');
      values.push(data.file_name.trim());
    }
    if (data.file_size !== undefined) {
      updates.push('file_size = ?');
      values.push(Number(data.file_size) || 0);
    }
    if (data.file_md5 !== undefined) {
      updates.push('file_md5 = ?');
      values.push(data.file_md5.trim() || null);
    }
    if (data.file_sha256 !== undefined) {
      updates.push('file_sha256 = ?');
      values.push(data.file_sha256.trim() || null);
    }
    if (data.external_url !== undefined) {
      updates.push('external_url = ?');
      values.push(data.external_url.trim() || null);
    }
    if (data.use_proxy !== undefined) {
      updates.push('use_proxy = ?');
      values.push(data.use_proxy ? 1 : 0);
    }

    if (updates.length === 0) return;
    updates.push('updated_at = ?');
    values.push(now);

    values.push(packageId);
    await db.prepare(`UPDATE version_packages SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  }

  /**
   * 删除指定安装包并清理对应 R2 存储
   */
  static async deletePackage(db: D1Database, bucket: R2Bucket, packageId: string): Promise<void> {
    const pkg = await db.prepare('SELECT file_key FROM version_packages WHERE id = ?')
      .bind(packageId)
      .first<{ file_key: string }>();

    if (pkg && pkg.file_key) {
      await StorageService.deleteObject(bucket, pkg.file_key);
    }

    await db.prepare('DELETE FROM version_packages WHERE id = ?').bind(packageId).run();
  }

  /**
   * 获取指定版本下的所有分发包列表
   */
  static async listPackagesByVersionId(db: D1Database, versionId: string): Promise<VersionPackageEntity[]> {
    await this.ensureSchema(db);
    const { results } = await db.prepare(
      'SELECT * FROM version_packages WHERE version_id = ? ORDER BY created_at ASC'
    ).bind(versionId).all<VersionPackageEntity>();
    return results || [];
  }

  /**
   * 获取单个分发包详情
   */
  static async getPackageById(db: D1Database, packageId: string): Promise<VersionPackageEntity | null> {
    await this.ensureSchema(db);
    const pkg = await db.prepare('SELECT * FROM version_packages WHERE id = ?')
      .bind(packageId)
      .first<VersionPackageEntity>();
    return pkg || null;
  }

  /**
   * 增加分发包下载计数
   */
  static async incrementPackageDownloadCount(db: D1Database, packageId: string): Promise<void> {
    try {
      await db.prepare('UPDATE version_packages SET download_count = download_count + 1 WHERE id = ?')
        .bind(packageId)
        .run();
    } catch (e) {}
  }

  /**
   * 获取单个版本详情
   */
  static async getVersionById(db: D1Database, versionId: string): Promise<AppVersionEntity | null> {
    await this.ensureSchema(db);
    const version = await db.prepare('SELECT * FROM app_versions WHERE id = ?')
      .bind(versionId)
      .first<AppVersionEntity>();
    return version || null;
  }

  /**
   * 更新版本属性 (修改更新日志、是否强更、发布状态、外链与反代设置等)
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
      external_url?: string;
      use_proxy?: number;
      file_name?: string;
    }
  ): Promise<void> {
    await this.ensureSchema(db);

    const updates: string[] = [];
    const values: any[] = [];

    if (data.version_name !== undefined) {
      updates.push('version_name = ?');
      values.push(data.version_name.trim());
    }
    if (data.min_version_code !== undefined) {
      updates.push('min_version_code = ?');
      values.push(data.min_version_code);
    }
    if (data.channel !== undefined) {
      updates.push('channel = ?');
      values.push(data.channel.trim() || 'default');
    }
    if (data.changelog !== undefined) {
      updates.push('changelog = ?');
      values.push(data.changelog);
    }
    if (data.is_force_update !== undefined) {
      updates.push('is_force_update = ?');
      values.push(data.is_force_update);
    }
    if (data.is_published !== undefined) {
      updates.push('is_published = ?');
      values.push(data.is_published);
    }
    if (data.external_url !== undefined) {
      updates.push('external_url = ?');
      values.push(data.external_url.trim() || null);
    }
    if (data.use_proxy !== undefined) {
      updates.push('use_proxy = ?');
      values.push(data.use_proxy);
    }
    if (data.file_name !== undefined) {
      updates.push('file_name = ?');
      values.push(data.file_name.trim() || null);
    }

    if (updates.length === 0) return;

    values.push(versionId);
    await db.prepare(`UPDATE app_versions SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  }

  /**
   * 删除指定版本并清理所有关联分发包与 R2 存储
   */
  static async deleteVersion(db: D1Database, bucket: R2Bucket, versionId: string): Promise<void> {
    // 1. 删除该版本下所有分发包的 R2 文件及记录
    try {
      const { results: pkgs } = await db.prepare('SELECT file_key FROM version_packages WHERE version_id = ?')
        .bind(versionId)
        .all<{ file_key: string }>();
      if (pkgs && pkgs.length > 0) {
        for (const p of pkgs) {
          if (p.file_key) {
            await StorageService.deleteObject(bucket, p.file_key);
          }
        }
      }
      await db.prepare('DELETE FROM version_packages WHERE version_id = ?').bind(versionId).run();
    } catch (e) {}

    // 2. 删除主版本的 R2 文件及 D1 记录
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
   * 为指定版本匹配最适合当前平台与架构的安装包
   */
  static async getPackageForDownload(
    db: D1Database,
    version: AppVersionEntity,
    platform?: string,
    arch?: string,
    packageId?: string
  ): Promise<VersionPackageEntity> {
    await this.ensureSchema(db);

    // 1. 如果显式指定了 packageId，优先精准查找
    if (packageId) {
      const pkg = await this.getPackageById(db, packageId);
      if (pkg && pkg.version_id === version.id) return pkg;
    }

    // 2. 查询该版本名下所有分发包
    const pkgs = await this.listPackagesByVersionId(db, version.id);

    if (pkgs && pkgs.length > 0) {
      const reqPlat = platform?.trim().toLowerCase();
      const reqArch = arch?.trim().toLowerCase();

      // 2.1 平台和架构完全精确匹配 (如 windows + x86_64)
      if (reqPlat && reqArch) {
        const exact = pkgs.find(p => p.platform.toLowerCase() === reqPlat && p.arch.toLowerCase() === reqArch);
        if (exact) return exact;
      }

      // 2.2 平台匹配，架构为 universal 或 all
      if (reqPlat) {
        const platUni = pkgs.find(p => p.platform.toLowerCase() === reqPlat && (p.arch.toLowerCase() === 'universal' || p.arch.toLowerCase() === 'all'));
        if (platUni) return platUni;

        // 2.3 平台匹配的任意安装包
        const platAny = pkgs.find(p => p.platform.toLowerCase() === reqPlat);
        if (platAny) return platAny;
      }

      // 2.4 架构单独匹配
      if (reqArch) {
        const archMatch = pkgs.find(p => p.arch.toLowerCase() === reqArch);
        if (archMatch) return archMatch;
      }

      // 2.5 默认返回该版本名下首个安装包
      return pkgs[0];
    }

    // 3. 兼容历史数据：若无独立分发包记录，从版本主记录字段合成
    return {
      id: 'pkg_def_' + version.id,
      version_id: version.id,
      app_id: version.app_id,
      platform: version.platform || 'android',
      arch: version.arch || 'universal',
      file_key: version.file_key || null,
      file_name: version.file_name || 'app.apk',
      file_size: version.file_size || 0,
      file_md5: version.file_md5 || null,
      file_sha256: version.file_sha256 || null,
      external_url: version.external_url || null,
      use_proxy: version.use_proxy || 0,
      is_cleaned: version.is_cleaned || 0,
      download_count: version.download_count || 0,
      created_at: version.created_at,
    };
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
   * 客户端核心检测逻辑 (支持多平台与多架构匹配，并附带全平台安装包清单)
   */
  static async checkAppUpdate(
    db: D1Database,
    appId: string,
    currentVersionCode: number = 0,
    channel: string = 'default',
    originUrl: string,
    platform?: string,
    arch?: string
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

    // 匹配最适合当前平台与架构的安装包
    const matchedPkg = await this.getPackageForDownload(db, latest, platform, arch);

    // 获取该版本所有可用分发包列表
    const allPkgs = await this.listPackagesByVersionId(db, latest.id);
    const packagesList: VersionPackageEntity[] = (allPkgs && allPkgs.length > 0)
      ? allPkgs.map(p => ({
          ...p,
          download_url: `${originUrl}/api/v1/app/download?app_id=${encodeURIComponent(appId)}&version_code=${latest.version_code}&channel=${encodeURIComponent(latest.channel)}&package_id=${p.id}`
        }))
      : [{
          ...matchedPkg,
          download_url: `${originUrl}/api/v1/app/download?app_id=${encodeURIComponent(appId)}&version_code=${latest.version_code}&channel=${encodeURIComponent(latest.channel)}`
        }];

    let downloadUrl = `${originUrl}/api/v1/app/download?app_id=${encodeURIComponent(appId)}&version_code=${latest.version_code}&channel=${encodeURIComponent(latest.channel)}`;
    if (platform) downloadUrl += `&platform=${encodeURIComponent(platform.trim().toLowerCase())}`;
    if (arch) downloadUrl += `&arch=${encodeURIComponent(arch.trim().toLowerCase())}`;
    if (matchedPkg.id && !matchedPkg.id.startsWith('pkg_def_')) {
      downloadUrl += `&package_id=${encodeURIComponent(matchedPkg.id)}`;
    }

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
      file_name: matchedPkg.file_name,
      file_size: matchedPkg.file_size,
      file_md5: matchedPkg.file_md5,
      file_sha256: matchedPkg.file_sha256,
      platform: matchedPkg.platform,
      arch: matchedPkg.arch,
      packages: packagesList,
      release_time: latest.created_at,
    };
  }
}
