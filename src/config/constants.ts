// ==============================================================================
// Yggdrasil (ygg) - System Constants & Defaults
// ==============================================================================

export const DEFAULT_CONFIG = {
  APP_NAME: 'Yggdrasil',
  DEFAULT_ADMIN_PASSWORD: 'admin',
  DEFAULT_JWT_SECRET: 'ygg_secret_jwt_sign_key_default_2026',
  JWT_EXPIRES_IN_SECONDS: 7 * 24 * 3600, // 7 days
  DEFAULT_API_TOKEN: 'ygg_secret_token_default_2026',
  TOKEN_HEADER_NAME: 'x-ygg-token',
  TOKEN_QUERY_NAME: 'token',
  COOKIE_NAME: 'ygg_admin_session',
};

export const SETTING_KEYS = {
  API_TOKEN_ENABLED: 'api_token_enabled',
  API_FIXED_TOKEN: 'api_fixed_token',
  APP_CHECK_REQUIRE_TOKEN: 'app_check_require_token',
  APP_DOWNLOAD_REQUIRE_TOKEN: 'app_download_require_token',
  FILE_DOWNLOAD_REQUIRE_TOKEN: 'file_download_require_token',
  SITE_TITLE: 'site_title',
};
