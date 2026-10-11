// ==============================================================================
// Yggdrasil (ygg) - MCP Direct Tool Execution Handler
// ==============================================================================

import { AppService } from '../services/appService';
import { FileService } from '../services/fileService';
import { CleanupService } from '../services/cleanupService';

export async function executeMcpTool(
  db: D1Database,
  bucket: R2Bucket,
  name: string,
  args: Record<string, any>,
  originUrl: string
): Promise<any> {
  switch (name) {
    case 'ygg_list_apps': {
      const apps = await AppService.listApps(db);
      const search = args.search ? String(args.search).trim().toLowerCase() : '';
      const filtered = search
        ? apps.filter((a: any) =>
            (a.app_id && a.app_id.toLowerCase().includes(search)) ||
            (a.name && a.name.toLowerCase().includes(search)) ||
            (a.description && a.description.toLowerCase().includes(search))
          )
        : apps;

      return {
        total: filtered.length,
        apps: filtered.map((a: any) => ({
          app_id: a.app_id,
          name: a.name,
          icon_url: a.icon_url,
          description: a.description,
          version_count: a.version_count || 0,
          total_downloads: a.total_downloads || 0,
          latest_version_code: a.latest_version_code || null,
          latest_version_name: a.latest_version_name || null,
          created_at: a.created_at,
          updated_at: a.updated_at,
        })),
      };
    }

    case 'ygg_get_app_details': {
      const appId = args.app_id ? String(args.app_id).trim() : '';
      if (!appId) throw new Error('Missing required argument: app_id');

      const app = await AppService.getAppByAppId(db, appId);
      if (!app) throw new Error(`App not found: ${appId}`);

      const versions = await AppService.listVersions(db, appId);
      return {
        app,
        total_versions: versions.length,
        versions: versions.map((v) => ({
          id: v.id,
          app_id: v.app_id,
          version_code: v.version_code,
          version_name: v.version_name,
          min_version_code: v.min_version_code,
          channel: v.channel,
          changelog: v.changelog,
          external_url: v.external_url || null,
          use_proxy: Boolean(v.use_proxy),
          is_cleaned: Boolean(v.is_cleaned),
          is_force_update: Boolean(v.is_force_update),
          is_published: Boolean(v.is_published),
          download_count: v.download_count,
          file_name: v.file_name,
          file_size: v.file_size,
          created_at: v.created_at,
          download_url: `${originUrl}/api/v1/app/download?app_id=${encodeURIComponent(v.app_id)}&version_code=${v.version_code}&channel=${encodeURIComponent(v.channel)}`,
        })),
      };
    }

    case 'ygg_check_update': {
      const appId = args.app_id ? String(args.app_id).trim() : '';
      if (!appId) throw new Error('Missing required argument: app_id');

      const currentVersionCode = Number(args.current_version_code) || 0;
      const channel = args.channel ? String(args.channel).trim() : 'default';

      const updateData = await AppService.checkAppUpdate(
        db,
        appId,
        currentVersionCode,
        channel,
        originUrl
      );

      if (!updateData) {
        return {
          has_update: false,
          message: `No published version found for app '${appId}' in channel '${channel}'`,
        };
      }
      return updateData;
    }

    case 'ygg_create_app': {
      const appId = args.app_id ? String(args.app_id).trim() : '';
      const name = args.name ? String(args.name).trim() : '';
      if (!appId || !name) throw new Error('Missing required arguments: app_id and name');

      const existing = await AppService.getAppByAppId(db, appId);
      if (existing) throw new Error(`App with app_id '${appId}' already exists`);

      const newApp = await AppService.createApp(db, {
        app_id: appId,
        name,
        icon_url: args.icon_url ? String(args.icon_url).trim() : undefined,
        description: args.description ? String(args.description).trim() : undefined,
      });

      return {
        message: 'App created successfully',
        app: newApp,
      };
    }

    case 'ygg_update_app': {
      const appId = args.app_id ? String(args.app_id).trim() : '';
      if (!appId) throw new Error('Missing required argument: app_id');

      const existing = await AppService.getAppByAppId(db, appId);
      if (!existing) throw new Error(`App not found: ${appId}`);

      await AppService.updateApp(db, appId, {
        name: args.name !== undefined ? String(args.name).trim() : undefined,
        icon_url: args.icon_url !== undefined ? String(args.icon_url).trim() : undefined,
        description: args.description !== undefined ? String(args.description).trim() : undefined,
      });

      const updated = await AppService.getAppByAppId(db, appId);
      return {
        message: 'App updated successfully',
        app: updated,
      };
    }

    case 'ygg_delete_app': {
      const appId = args.app_id ? String(args.app_id).trim() : '';
      if (!appId) throw new Error('Missing required argument: app_id');

      const existing = await AppService.getAppByAppId(db, appId);
      if (!existing) throw new Error(`App not found: ${appId}`);

      await AppService.deleteApp(db, bucket, appId);
      return {
        message: `App '${appId}' and all its versions were deleted successfully`,
      };
    }

    case 'ygg_publish_version': {
      const appId = args.app_id ? String(args.app_id).trim() : '';
      const versionCode = Number(args.version_code);
      const versionName = args.version_name ? String(args.version_name).trim() : '';

      if (!appId || isNaN(versionCode) || !versionName) {
        throw new Error('Missing required arguments: app_id, version_code, version_name');
      }

      const app = await AppService.getAppByAppId(db, appId);
      if (!app) throw new Error(`App not found: ${appId}`);

      if (args.external_url && String(args.external_url).trim()) {
        const ext = String(args.external_url).trim();
        if (!ext.startsWith('http://') && !ext.startsWith('https://')) {
          throw new Error('external_url must start with http:// or https://');
        }
        if (ext.includes('/api/v1/app/download')) {
          throw new Error('external_url cannot point to the gateway download endpoint');
        }
      }

      const newVersion = await AppService.createVersion(db, {
        app_id: appId,
        version_code: versionCode,
        version_name: versionName,
        min_version_code: args.min_version_code !== undefined ? Number(args.min_version_code) : 0,
        channel: args.channel ? String(args.channel).trim() : 'default',
        changelog: args.changelog ? String(args.changelog).trim() : '',
        external_url: args.external_url ? String(args.external_url).trim() : undefined,
        use_proxy: args.use_proxy ? 1 : 0,
        is_force_update: args.is_force_update ? 1 : 0,
        file_name: args.file_name ? String(args.file_name).trim() : undefined,
        file_size: args.file_size ? Number(args.file_size) : 0,
        is_published: 1,
      });

      return {
        message: 'Version published successfully',
        version: newVersion,
        download_url: `${originUrl}/api/v1/app/download?app_id=${encodeURIComponent(newVersion.app_id)}&version_code=${newVersion.version_code}&channel=${encodeURIComponent(newVersion.channel)}`,
      };
    }

    case 'ygg_update_version': {
      const versionId = args.version_id ? String(args.version_id).trim() : '';
      if (!versionId) throw new Error('Missing required argument: version_id');

      if (args.external_url && String(args.external_url).trim()) {
        const ext = String(args.external_url).trim();
        if (!ext.startsWith('http://') && !ext.startsWith('https://')) {
          throw new Error('external_url must start with http:// or https://');
        }
        if (ext.includes('/api/v1/app/download')) {
          throw new Error('external_url cannot point to the gateway download endpoint');
        }
      }

      await AppService.updateVersion(db, versionId, {
        version_name: args.version_name !== undefined ? String(args.version_name).trim() : undefined,
        channel: args.channel !== undefined ? String(args.channel).trim() : undefined,
        min_version_code: args.min_version_code !== undefined ? Number(args.min_version_code) : undefined,
        changelog: args.changelog !== undefined ? String(args.changelog) : undefined,
        external_url: args.external_url !== undefined ? String(args.external_url).trim() : undefined,
        use_proxy: args.use_proxy !== undefined ? (args.use_proxy ? 1 : 0) : undefined,
        is_force_update: args.is_force_update !== undefined ? (args.is_force_update ? 1 : 0) : undefined,
        is_published: args.is_published !== undefined ? (args.is_published ? 1 : 0) : undefined,
        file_name: args.file_name !== undefined ? String(args.file_name).trim() : undefined,
      });

      return {
        message: `Version '${versionId}' updated successfully`,
      };
    }

    case 'ygg_delete_version': {
      const versionId = args.version_id ? String(args.version_id).trim() : '';
      if (!versionId) throw new Error('Missing required argument: version_id');

      await AppService.deleteVersion(db, bucket, versionId);
      return {
        message: `Version '${versionId}' deleted successfully`,
      };
    }

    case 'ygg_get_system_stats': {
      const appStats = await db.prepare(`
        SELECT 
          (SELECT COUNT(1) FROM apps) AS total_apps,
          (SELECT COUNT(1) FROM app_versions) AS total_versions,
          (SELECT COALESCE(SUM(file_size), 0) FROM app_versions) AS app_storage_bytes,
          (SELECT COALESCE(SUM(download_count), 0) FROM app_versions) AS app_downloads
      `).first<{ total_apps: number; total_versions: number; app_storage_bytes: number; app_downloads: number }>();

      const fileStats = await db.prepare(`
        SELECT 
          (SELECT COUNT(1) FROM files) AS total_files,
          (SELECT COALESCE(SUM(file_size), 0) FROM files) AS file_storage_bytes,
          (SELECT COALESCE(SUM(download_count), 0) FROM files) AS file_downloads
      `).first<{ total_files: number; file_storage_bytes: number; file_downloads: number }>();

      const totalApps = appStats?.total_apps || 0;
      const totalVersions = appStats?.total_versions || 0;
      const totalFiles = fileStats?.total_files || 0;
      const totalStorageBytes = (appStats?.app_storage_bytes || 0) + (fileStats?.file_storage_bytes || 0);
      const totalDownloads = (appStats?.app_downloads || 0) + (fileStats?.file_downloads || 0);

      return {
        total_apps: totalApps,
        total_versions: totalVersions,
        total_files: totalFiles,
        total_storage_bytes: totalStorageBytes,
        total_storage_mb: (totalStorageBytes / (1024 * 1024)).toFixed(2),
        total_downloads: totalDownloads,
      };
    }

    case 'ygg_trigger_cleanup': {
      const days = Number(args.days) || 90;
      const keepLatest = Number(args.keep_latest) || 3;
      let cleanupResult;
      if (args.force) {
        cleanupResult = await CleanupService.forceCleanup(db, bucket, days, keepLatest);
      } else {
        cleanupResult = await CleanupService.runCleanup(db, bucket);
      }

      return {
        message: `Cleanup completed: ${cleanupResult.deleted} old version package(s) cleaned, ${(cleanupResult.freedBytes / (1024 * 1024)).toFixed(2)} MB freed`,
        result: cleanupResult,
      };
    }

    case 'ygg_list_files': {
      const category = args.category ? String(args.category).trim() : undefined;
      const result = await FileService.listFiles(db, { category });
      return {
        total: result.total,
        files: result.files.map((f) => ({
          id: f.id,
          name: f.name,
          category: f.category,
          file_name: f.file_name,
          file_size: f.file_size,
          mime_type: f.mime_type,
          alias: f.alias,
          download_count: f.download_count,
          is_public: Boolean(f.is_public),
          created_at: f.created_at,
          download_url: f.alias
            ? `${originUrl}/f/${f.alias}`
            : `${originUrl}/api/v1/files/download/${f.id}`,
        })),
      };
    }

    default:
      throw new Error(`Unknown MCP tool: ${name}`);
  }
}
