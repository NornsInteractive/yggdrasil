// ==============================================================================
// Yggdrasil (ygg) - Type Definitions
// ==============================================================================

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
  ADMIN_PASSWORD?: string;
  JWT_SECRET?: string;
  APP_NAME?: string;
}

// 1. App 实体
export interface AppEntity {
  id: string;
  app_id: string;
  name: string;
  icon_url?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}

// 2. App 版本实体
export interface AppVersionEntity {
  id: string;
  app_id: string;
  version_code: number;
  version_name: string;
  min_version_code: number;
  channel: string;
  changelog?: string | null;
  file_key: string;
  file_name: string;
  file_size: number;
  file_md5?: string | null;
  file_sha256?: string | null;
  is_force_update: number; // 0 or 1
  is_published: number;    // 0 or 1
  download_count: number;
  external_url?: string | null; // 第三方外部直链下载地址
  use_proxy?: number;           // 是否开启反向代理 (0=302重定向跳转, 1=反向代理流式传输)
  is_cleaned?: number;          // 安装包是否已被自动清理策略清理 (0=正常存在, 1=已清理但保留版本日志)
  platform?: string;            // 主包平台标识 (如 android, windows, macos, linux, ios)
  arch?: string;                // 主包架构标识 (如 universal, arm64-v8a, x86_64)
  packages?: VersionPackageEntity[]; // 多平台与多架构分发包列表
  created_at?: string;
}

// 2.1 多平台与多架构分发包实体
export interface VersionPackageEntity {
  id: string;
  version_id: string;
  app_id: string;
  platform: string;             // 目标平台: android / windows / macos / linux / ios / universal
  arch: string;                 // 目标架构: universal / arm64-v8a / armeabi-v7a / x86_64 / x86 / apple-silicon
  file_key?: string | null;     // R2 存储 Key
  file_name: string;            // 真实文件名
  file_size: number;            // 字节大小
  file_md5?: string | null;     // MD5 校验和
  file_sha256?: string | null;  // SHA256 校验和
  external_url?: string | null; // 第三方外部直链下载地址
  use_proxy?: number;           // 是否反代加速 (0: 302跳转, 1: Worker反代)
  is_cleaned?: number;          // 安装包是否已被清理 (0: 正常, 1: 已清理)
  download_count: number;       // 下载统计
  created_at?: string;
  updated_at?: string;
  download_url?: string;        // 运行时动态拼接的下载直链
}

// 3. 通用文件实体
export interface FileEntity {
  id: string;
  name: string;
  category: string;
  file_key: string;
  file_name: string;
  file_size: number;
  mime_type?: string | null;
  file_md5?: string | null;
  alias?: string | null;
  is_public: number; // 0 or 1
  download_count: number;
  created_at?: string;
}

// 4. 系统动态设置
export interface SystemSettingEntity {
  key: string;
  value: string;
  description?: string | null;
  updated_at?: string;
}

// 5. 客户端版本检测响应结构
export interface VersionCheckData {
  has_update: boolean;
  is_force: boolean;
  app_id: string;
  app_name?: string;
  icon_url?: string | null;
  current_version_code?: number;
  latest_version_code: number;
  latest_version_name: string;
  min_version_code: number;
  channel: string;
  changelog: string;
  download_url: string;
  file_name: string;
  file_size: number;
  file_md5?: string | null;
  file_sha256?: string | null;
  platform?: string;
  arch?: string;
  packages?: VersionPackageEntity[];
  release_time?: string;
}

// 6. 标准统一 API 响应格式
export interface ApiResponse<T = any> {
  code: number; // 0 表示成功, 非 0 表示错误码
  message: string;
  data?: T;
}

// 7. JWT Admin Payload
export interface AdminJwtPayload {
  sub: string;
  role: 'admin';
  iat: number;
  exp: number;
}
