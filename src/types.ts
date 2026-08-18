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
  created_at?: string;
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
