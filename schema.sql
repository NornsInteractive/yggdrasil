-- ==============================================================================
-- Yggdrasil (ygg) - Cloudflare D1 Database Schema
-- Project: App Release Management & File Distribution System
-- ==============================================================================

-- 1. 应用主体表 (支持多 App 统一管理)
CREATE TABLE IF NOT EXISTS apps (
    id TEXT PRIMARY KEY,                   -- 应用内部唯一ID (如 uuid 或时间戳短ID)
    app_id TEXT NOT NULL UNIQUE,           -- 包名/标识符 (如: com.example.app)
    name TEXT NOT NULL,                    -- 应用显示名称 (如: 掌上办公)
    icon_url TEXT,                         -- 图标 URL
    description TEXT,                      -- 应用描述
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. 应用版本表 (支持多版本、渠道、强制更新、更新日志与文件元数据)
CREATE TABLE IF NOT EXISTS app_versions (
    id TEXT PRIMARY KEY,                   -- 版本记录唯一ID
    app_id TEXT NOT NULL,                  -- 关联的应用标识符 (apps.app_id)
    version_code INTEGER NOT NULL,         -- 版本号数字 (用于比对大小, 如 10200)
    version_name TEXT NOT NULL,            -- 版本名称 (用于展示, 如 "1.2.0")
    min_version_code INTEGER DEFAULT 0,    -- 触发强制更新的最低支持版本号 (低于此版本必须强更)
    channel TEXT DEFAULT 'default',        -- 渠道标识 (default / beta / googleplay / official)
    changelog TEXT,                        -- 更新日志内容 (支持 Markdown / 纯文本换行)
    file_key TEXT NOT NULL,                -- R2 存储桶中的对象 Key
    file_name TEXT NOT NULL,               -- 原始文件名 (如 app-release-v1.2.0.apk)
    file_size INTEGER NOT NULL,            -- 文件字节大小
    file_md5 TEXT,                         -- 文件 MD5 (用于客户端校验完整性)
    file_sha256 TEXT,                      -- 文件 SHA256 (可选)
    is_force_update INTEGER DEFAULT 0,     -- 是否强制更新 (0: 否, 1: 是)
    is_published INTEGER DEFAULT 1,        -- 发布状态 (0: 禁用/草稿, 1: 已发布)
    download_count INTEGER DEFAULT 0,      -- 下载计数
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(app_id) REFERENCES apps(app_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_app_versions_lookup 
ON app_versions(app_id, channel, is_published, version_code DESC);

-- 3. 通用文件表 (支持任意非 APK 文件的存储、分类与短链别名分发)
CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,                   -- 文件记录唯一ID
    name TEXT NOT NULL,                    -- 文件显示名称
    category TEXT DEFAULT 'general',       -- 文件分类 (如: config, document, media, package, tools)
    file_key TEXT NOT NULL,                -- R2 中的对象 Key
    file_name TEXT NOT NULL,               -- 存储的文件名
    file_size INTEGER NOT NULL,            -- 文件大小 (字节)
    mime_type TEXT,                        -- MIME 类型
    file_md5 TEXT,                         -- MD5 校验和
    alias TEXT UNIQUE,                     -- 短链接/快捷访问别名 (如: /f/my-config)
    is_public INTEGER DEFAULT 1,           -- 是否公开 (1: 是, 0: 否)
    download_count INTEGER DEFAULT 0,      -- 下载次数
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_files_alias ON files(alias);
CREATE INDEX IF NOT EXISTS idx_files_category ON files(category);

-- 4. 系统动态配置表 (支持在 Web 管理界面热更新 Token、鉴权开关等)
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,                  -- 配置项键名
    value TEXT NOT NULL,                   -- 配置项值 (JSON 或 字符串)
    description TEXT,                      -- 配置描述
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 初始化默认系统配置项
INSERT OR IGNORE INTO system_settings (key, value, description) VALUES 
('api_token_enabled', 'false', '是否开启公共接口全局 Token 校验 (true/false)'),
('api_fixed_token', 'ygg_secret_token_default_2026', '客户端公共接口访问的固定 API Token'),
('app_check_require_token', 'false', 'App 版本检测接口是否强制校验 Token (true/false)'),
('app_download_require_token', 'false', 'App APK 下载接口是否强制校验 Token (true/false)'),
('file_download_require_token', 'false', '通用文件下载是否强制校验 Token (true/false)'),
('site_title', 'Yggdrasil - 分发管理中心', '控制台网站标题');
