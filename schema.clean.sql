CREATE TABLE IF NOT EXISTS apps (
    id TEXT PRIMARY KEY,
    app_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    icon_url TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_versions (
    id TEXT PRIMARY KEY,
    app_id TEXT NOT NULL,
    version_code INTEGER NOT NULL,
    version_name TEXT NOT NULL,
    min_version_code INTEGER DEFAULT 0,
    channel TEXT DEFAULT 'default',
    changelog TEXT,
    file_key TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_md5 TEXT,
    file_sha256 TEXT,
    is_force_update INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    download_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(app_id) REFERENCES apps(app_id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_app_versions_lookup 
ON app_versions(app_id, channel, is_published, version_code DESC);

CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    file_key TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT,
    file_md5 TEXT,
    alias TEXT UNIQUE,
    is_public INTEGER DEFAULT 1,
    download_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_files_alias ON files(alias);
CREATE INDEX IF NOT EXISTS idx_files_category ON files(category);

CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO system_settings (key, value, description) VALUES 
('api_token_enabled', 'false', 'Enable API token check globally'),
('api_fixed_token', 'ygg_secret_token_default_2026', 'Fixed API token for client access'),
('app_check_require_token', 'false', 'Require token for app check API'),
('app_download_require_token', 'false', 'Require token for app download API'),
('file_download_require_token', 'false', 'Require token for file download API'),
('site_title', 'Yggdrasil - 分发管理中心', 'Site title');
