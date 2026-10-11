// ==============================================================================
// Yggdrasil (ygg) - Web Admin Console HTML / CSS / JS Single Page View
// ==============================================================================

export function renderDashboardHtml(siteTitle: string = 'Yggdrasil - 分发管理中心'): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-main: #0b0f19;
      --bg-card: #131b2e;
      --bg-card-hover: #1a243d;
      --bg-input: #0e1626;
      --border: #1e293b;
      --border-focus: #3b82f6;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-dim: #64748b;
      --primary: #10b981;
      --primary-hover: #059669;
      --primary-light: rgba(16, 185, 129, 0.12);
      --accent: #3b82f6;
      --accent-hover: #2563eb;
      --accent-light: rgba(59, 130, 246, 0.12);
      --warning: #f59e0b;
      --danger: #ef4444;
      --danger-hover: #dc2626;
      --radius-sm: 6px;
      --radius-md: 10px;
      --radius-lg: 14px;
      --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.25);
      --shadow-md: 0 4px 12px -2px rgba(0, 0, 0, 0.35);
      --shadow-lg: 0 12px 28px -6px rgba(0, 0, 0, 0.45);
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      --font-mono: 'JetBrains Mono', Consolas, Monaco, monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      background-color: var(--bg-main);
      color: var(--text-main);
      min-height: 100vh;
      line-height: 1.5;
      font-size: 14px;
      -webkit-font-smoothing: antialiased;
    }

    /* Layout */
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    /* Navigation Bar */
    header.navbar {
      background: var(--bg-card);
      border-bottom: 1px solid var(--border);
      padding: 0 1.5rem;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text-main);
    }
    .nav-brand .brand-icon {
      font-size: 1.4rem;
      line-height: 1;
    }
    .nav-brand .brand-tag {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: var(--radius-sm);
      background: var(--primary-light);
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-tab {
      padding: 0.5rem 0.85rem;
      border-radius: var(--radius-md);
      color: var(--text-muted);
      cursor: pointer;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      border: 1px solid transparent;
    }
    .nav-tab:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.04);
    }
    .nav-tab.active {
      color: var(--text-main);
      background: var(--bg-input);
      border-color: var(--border);
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    /* Main Content */
    main.content {
      flex: 1;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 2rem 1.5rem 4rem;
    }

    /* Stats Ribbon */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .stat-title {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .stat-val {
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--text-main);
      letter-spacing: -0.03em;
    }
    .stat-meta {
      font-size: 0.75rem;
      color: var(--text-dim);
    }

    /* Action Toolbar */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .section-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      padding: 0.55rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s ease;
      border: 1px solid transparent;
      white-space: nowrap;
      text-decoration: none;
    }
    .btn-primary {
      background: var(--primary);
      color: #042f1f;
    }
    .btn-primary:hover {
      background: var(--primary-hover);
      color: #021a11;
    }
    .btn-secondary {
      background: var(--bg-input);
      border-color: var(--border);
      color: var(--text-main);
    }
    .btn-secondary:hover {
      background: var(--border);
    }
    .btn-accent {
      background: var(--accent);
      color: #ffffff;
    }
    .btn-accent:hover {
      background: var(--accent-hover);
    }
    .btn-danger {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }
    .btn-danger:hover {
      background: var(--danger);
      color: #ffffff;
    }
    .btn-sm {
      padding: 0.35rem 0.65rem;
      font-size: 0.775rem;
      border-radius: var(--radius-sm);
    }
    .btn-icon {
      padding: 0.45rem;
      line-height: 1;
    }

    /* App Cards & Version List */
    .app-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 1.25rem;
      transition: border-color 0.2s ease;
    }
    .app-card:hover {
      border-color: #2e3d5b;
    }
    .app-card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .app-info {
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    .app-avatar {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: var(--bg-input);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      flex-shrink: 0;
      overflow: hidden;
    }
    .app-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .app-name-wrap {
      display: flex;
      flex-direction: column;
    }
    .app-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .app-pkg {
      font-family: var(--font-mono);
      font-size: 0.775rem;
      color: var(--text-muted);
    }

    .app-meta-badges {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.85rem;
      flex-wrap: wrap;
      align-items: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 3px 8px;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 500;
      background: var(--bg-input);
      border: 1px solid var(--border);
      color: var(--text-muted);
    }
    .badge-success {
      background: var(--primary-light);
      border-color: rgba(16, 185, 129, 0.3);
      color: var(--primary);
    }
    .badge-accent {
      background: var(--accent-light);
      border-color: rgba(59, 130, 246, 0.3);
      color: var(--accent);
    }
    .badge-warning {
      background: rgba(245, 158, 11, 0.12);
      border-color: rgba(245, 158, 11, 0.3);
      color: var(--warning);
    }

    .app-actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    /* Version Dropdown / Table inside App Card */
    .version-container {
      margin-top: 1.25rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border);
    }
    .version-item {
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1rem;
      margin-bottom: 0.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .ver-left {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .ver-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .ver-title {
      font-weight: 700;
      font-size: 0.95rem;
    }
    .ver-code {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-dim);
    }
    .ver-log {
      font-size: 0.8rem;
      color: var(--text-muted);
      white-space: pre-line;
      max-width: 600px;
    }
    .ver-meta {
      display: flex;
      gap: 0.75rem;
      font-size: 0.75rem;
      color: var(--text-dim);
      margin-top: 4px;
    }

    /* Tables */
    .table-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    table.data-table th {
      background: var(--bg-input);
      padding: 0.85rem 1.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border);
    }
    table.data-table td {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border);
      color: var(--text-main);
      vertical-align: middle;
    }
    table.data-table tr:last-child td {
      border-bottom: none;
    }
    table.data-table tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }

    /* Forms & Inputs */
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-label {
      display: block;
      margin-bottom: 0.4rem;
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    .form-control {
      width: 100%;
      padding: 0.65rem 0.85rem;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      color: var(--text-main);
      font-size: 0.875rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.15s ease;
    }
    .form-control:focus {
      border-color: var(--border-focus);
    }
    textarea.form-control {
      min-height: 80px;
      resize: vertical;
    }
    .form-help {
      font-size: 0.75rem;
      color: var(--text-dim);
      margin-top: 0.35rem;
    }
    .form-row {
      display: flex;
      gap: 1rem;
    }
    .form-col {
      flex: 1;
    }

    /* Switch toggle */
    .switch-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1rem;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      margin-bottom: 0.75rem;
    }
    .switch-info {
      display: flex;
      flex-direction: column;
    }
    .switch-title {
      font-weight: 600;
      font-size: 0.875rem;
    }
    .switch-desc {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .switch-checkbox {
      width: 44px;
      height: 24px;
      position: relative;
      appearance: none;
      background: #334155;
      outline: none;
      border-radius: 20px;
      cursor: pointer;
      transition: background 0.2s;
      flex-shrink: 0;
    }
    .switch-checkbox:checked {
      background: var(--primary);
    }
    .switch-checkbox::before {
      content: '';
      position: absolute;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      top: 3px;
      left: 3px;
      background: #ffffff;
      transition: transform 0.2s;
    }
    .switch-checkbox:checked::before {
      transform: translateX(20px);
    }

    /* Drag Drop Upload Zone */
    .upload-zone {
      border: 2px dashed var(--border);
      border-radius: var(--radius-lg);
      padding: 2.5rem 1.5rem;
      text-align: center;
      background: rgba(14, 22, 38, 0.6);
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    .upload-zone:hover, .upload-zone.dragover {
      border-color: var(--primary);
      background: var(--primary-light);
    }
    .upload-icon {
      font-size: 2.5rem;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }
    .upload-text {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-main);
    }
    .upload-hint {
      font-size: 0.8rem;
      color: var(--text-dim);
      margin-top: 0.25rem;
    }

    .progress-bar-wrap {
      margin-top: 1rem;
      background: var(--bg-input);
      border-radius: 10px;
      height: 10px;
      overflow: hidden;
      display: none;
    }
    .progress-bar-inner {
      height: 100%;
      background: var(--primary);
      width: 0%;
      transition: width 0.15s ease;
    }

    /* Modals */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s ease;
      padding: 1.5rem;
    }
    .modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
      padding: 1.75rem;
      transform: translateY(12px);
      transition: transform 0.2s ease;
    }
    .modal-overlay.active .modal-card {
      transform: translateY(0);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    .modal-title {
      font-size: 1.2rem;
      font-weight: 700;
    }
    .modal-close {
      background: none;
      border: none;
      color: var(--text-dim);
      font-size: 1.5rem;
      cursor: pointer;
      line-height: 1;
    }
    .modal-close:hover {
      color: var(--text-main);
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }

    /* Toast Notification */
    .toast-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .toast {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 0.75rem 1.25rem;
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.85rem;
      font-weight: 500;
      animation: slideUp 0.2s ease;
    }
    .toast.success { border-color: rgba(16, 185, 129, 0.4); color: #6ee7b7; }
    .toast.error { border-color: rgba(239, 68, 68, 0.4); color: #fca5a5; }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Code & Pre Box */
    .code-box {
      background: #070b14;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1rem;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: #38bdf8;
      overflow-x: auto;
      line-height: 1.6;
    }

    /* Login Box (Screen) */
    .login-container {
      display: flex;
      min-height: 100vh;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .login-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 2.5rem;
      max-width: 420px;
      width: 100%;
      box-shadow: var(--shadow-lg);
      text-align: center;
    }
    .login-logo {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }
    .login-title {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }
    .login-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 2rem;
    }

    /* Utilities */
    .hidden { display: none !important; }
    .mono { font-family: var(--font-mono); }
    .truncate { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    /* MCP Hub Styles */
    .mcp-hero-banner {
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%);
      border: 1px solid rgba(168, 85, 247, 0.3);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 1.75rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.25rem;
    }
    .mcp-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }
    .mcp-tool-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      transition: all 0.15s ease;
    }
    .mcp-tool-card:hover {
      border-color: rgba(168, 85, 247, 0.45);
      background: rgba(255, 255, 255, 0.02);
    }
    .mcp-client-tabs {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .mcp-client-btn {
      padding: 0.45rem 0.9rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      background: var(--bg-card);
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.825rem;
      font-weight: 600;
      transition: all 0.15s ease;
    }
    .mcp-client-btn:hover {
      color: var(--text-main);
      background: rgba(255, 255, 255, 0.05);
    }
    .mcp-client-btn.active {
      color: #c084fc;
      border-color: rgba(168, 85, 247, 0.5);
      background: rgba(168, 85, 247, 0.12);
    }

    @media (max-width: 768px) {
      header.navbar { padding: 0 1rem; }
      .nav-brand .brand-tag { display: none; }
      main.content { padding: 1.25rem 1rem 3rem; }
      .form-row { flex-direction: column; gap: 0; }
    }
  </style>
</head>
<body>

  <!-- LOGIN SCREEN -->
  <div id="login-view" class="login-container hidden">
    <div class="login-card">
      <div class="login-logo">🌳</div>
      <h1 class="login-title">Yggdrasil 控制台</h1>
      <p class="login-subtitle">Cloudflare 边缘应用版本与文件分发系统</p>
      <form id="login-form" onsubmit="handleLogin(event)">
        <div class="form-group" style="text-align: left;">
          <label class="form-label">管理员访问密码</label>
          <input type="password" id="login-password" class="form-control" placeholder="输入控制台密码..." required autofocus />
        </div>
        <button type="submit" id="btn-login-submit" class="btn btn-primary" style="width: 100%; padding: 0.75rem;">
          登 录 控 制 台
        </button>
      </form>
    </div>
  </div>

  <!-- MAIN APP VIEW -->
  <div id="app-view" class="app-container hidden">
    <header class="navbar">
      <div class="nav-brand">
        <span class="brand-icon">🌳</span>
        <span>Yggdrasil</span>
        <span class="brand-tag">Cloudflare Edge</span>
      </div>

      <nav class="nav-links">
        <div class="nav-tab active" data-tab="apps" onclick="switchTab('apps')">
          <span>📱</span> <span>应用发布</span>
        </div>
        <div class="nav-tab" data-tab="files" onclick="switchTab('files')">
          <span>📁</span> <span>通用文件</span>
        </div>
        <div class="nav-tab" data-tab="settings" onclick="switchTab('settings')">
          <span>⚙️</span> <span>鉴权与设置</span>
        </div>
        <div class="nav-tab" data-tab="playground" onclick="switchTab('playground')">
          <span>🧪</span> <span>接口调试台</span>
        </div>
        <div class="nav-tab" data-tab="docs" onclick="switchTab('docs')">
          <span>📖</span> <span>API 文档</span>
        </div>
        <div class="nav-tab" data-tab="mcp" onclick="switchTab('mcp')">
          <span>🤖</span> <span>MCP / AI 协议</span>
          <span class="badge" style="background: rgba(168, 85, 247, 0.2); color: #c084fc; font-size: 0.65rem; padding: 0.1rem 0.35rem; margin-left: 0.2rem; border-radius: 999px;">新</span>
        </div>
      </nav>

      <div class="nav-user">
        <button class="btn btn-secondary btn-sm" onclick="handleLogout()">登出</button>
      </div>
    </header>

    <main class="content">
      <!-- 全局绑定缺失与系统错误提示横幅 -->
      <div id="global-alert-banner" class="hidden" style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: var(--radius-lg); padding: 1.25rem; margin-bottom: 1.5rem; color: #fca5a5; display: flex; align-items: flex-start; gap: 0.75rem;">
        <span style="font-size: 1.5rem; line-height: 1;">⚠️</span>
        <div style="flex: 1;">
          <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 0.35rem; color: #ef4444;">系统资源配置提示</div>
          <div id="global-alert-text" style="font-size: 0.85rem; line-height: 1.6; color: #fecaca;"></div>
        </div>
      </div>

      <!-- 统计栏 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-title">已托管应用 / 版本</div>
          <div class="stat-val" id="stat-apps">0 / 0</div>
          <div class="stat-meta">活跃应用与发布版本总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">通用文件数</div>
          <div class="stat-val" id="stat-files">0</div>
          <div class="stat-meta">静态文件与归档资源</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">R2 存储占用</div>
          <div class="stat-val" id="stat-storage">0 MB</div>
          <div class="stat-meta">Cloudflare R2 零出口流量费用</div>
        </div>
        <div class="stat-card">
          <div class="stat-title">累积分发下载量</div>
          <div class="stat-val" id="stat-downloads">0</div>
          <div class="stat-meta">支持全量 HTTP Range 续传</div>
        </div>
      </div>

      <!-- TAB 1: 应用发布管理 -->
      <section id="tab-apps">
        <div class="section-header">
          <div>
            <h2 class="section-title">应用与 APK 发布管理</h2>
            <p class="section-subtitle">支持多 App 统一托管、数字版本比对 (versionCode)、渠道隔离与断点续传</p>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="switchTab('mcp')" style="border-color: rgba(168, 85, 247, 0.4); color: #c084fc;">
              🤖 AI / MCP 助手
            </button>
            <button class="btn btn-primary" onclick="openCreateAppModal()">+ 创建新应用</button>
          </div>
        </div>

        <div id="apps-list-container">
          <!-- 动态渲染应用卡片 -->
        </div>
      </section>

      <!-- TAB 2: 通用文件管理 -->
      <section id="tab-files" class="hidden">
        <div class="section-header">
          <div>
            <h2 class="section-title">通用文件分发</h2>
            <p class="section-subtitle">支持配置、文档、安装包等任意文件存储，支持自定义短链别名快捷下载</p>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary" onclick="openUploadFileModal()">+ 上传文件</button>
          </div>
        </div>

        <div class="table-card">
          <table class="data-table">
            <thead>
              <tr>
                <th>文件名称</th>
                <th>分类</th>
                <th>大小</th>
                <th>快捷别名 (短链)</th>
                <th>下载次数</th>
                <th>上传时间</th>
                <th style="text-align: right;">操作</th>
              </tr>
            </thead>
            <tbody id="files-table-body">
              <!-- 动态渲染文件列表 -->
            </tbody>
          </table>
        </div>
      </section>

      <!-- TAB 3: 鉴权与系统设置 -->
      <section id="tab-settings" class="hidden">
        <div class="section-header">
          <div>
            <h2 class="section-title">API 鉴权与系统设置</h2>
            <p class="section-subtitle">在控制台随时开启或关闭开放接口的 Token 校验，设置自定义固定 Token</p>
          </div>
          <button class="btn btn-primary" onclick="saveSettings()">保存配置变更</button>
        </div>

        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 1rem;">🔒 客户端 API Token 鉴权设置</h3>
          
          <div class="switch-wrap">
            <div class="switch-info">
              <span class="switch-title">启用全局 API Token 校验</span>
              <span class="switch-desc">开启后，客户端必须携带正确 Token 才能访问开启了校验的接口</span>
            </div>
            <input type="checkbox" id="cfg-token-enabled" class="switch-checkbox" />
          </div>

          <div class="form-group" style="margin-top: 1rem;">
            <label class="form-label">固定 API 访问 Token (Fixed Token)</label>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" id="cfg-fixed-token" class="form-control mono" placeholder="设置固定 Token 字符串..." />
              <button class="btn btn-secondary" onclick="generateRandomToken()">随机生成</button>
              <button class="btn btn-secondary" onclick="copyText(document.getElementById('cfg-fixed-token').value, 'Token 已复制')">复制</button>
            </div>
            <div class="form-help">客户端可在 Header 传入 <code class="mono">X-Ygg-Token: &lt;token&gt;</code>、<code class="mono">Authorization: Bearer &lt;token&gt;</code> 或 Query 参数 <code class="mono">?token=&lt;token&gt;</code></div>
          </div>

          <h4 style="font-size: 0.9rem; font-weight: 700; margin: 1.25rem 0 0.75rem;">细粒度接口 Token 校验开关</h4>
          
          <div class="switch-wrap">
            <div class="switch-info">
              <span class="switch-title">App 版本检测接口 (/api/v1/app/latest)</span>
              <span class="switch-desc">是否要求手机 App 必须携带 Token 才能检测最新版本</span>
            </div>
            <input type="checkbox" id="cfg-app-check-token" class="switch-checkbox" />
          </div>

          <div class="switch-wrap">
            <div class="switch-info">
              <span class="switch-title">App APK 下载接口 (/api/v1/app/download)</span>
              <span class="switch-desc">是否要求下载 APK 安装包时携带 Token</span>
            </div>
            <input type="checkbox" id="cfg-app-download-token" class="switch-checkbox" />
          </div>

          <div class="switch-wrap">
            <div class="switch-info">
              <span class="switch-title">通用文件下载接口 (/api/v1/files/:id/download, /f/:alias)</span>
              <span class="switch-desc">是否要求下载通用文件资源时携带 Token</span>
            </div>
            <input type="checkbox" id="cfg-file-download-token" class="switch-checkbox" />
          </div>
        </div>

        <div class="stat-card">
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 1rem;">🐙 GitHub 私有仓库 Release 代理鉴权 (可选)</h3>
          <p style="color: var(--text-muted); font-size: 0.825rem; margin-bottom: 1rem;">若您的项目代码为 <strong>Private（私有）</strong>，又希望将 Release 文件对外公开下载，可在此填入 GitHub Personal Access Token (PAT)。反向代理时，系统会自动携带该凭证通过 GitHub API 安全拉取对应私有资产并提供下载，而代码仓库保持 100% 闭源保密。</p>
          
          <div class="form-group">
            <label class="form-label">GitHub Personal Access Token (PAT)</label>
            <input type="password" id="cfg-github-token" class="form-control mono" placeholder="ghp_xxxxxxxxxxxx 或 github_pat_xxxxxxxxxxxx" />
            <div class="form-help">Token 仅保存在您的 Cloudflare D1 数据库中。建议在 GitHub 中生成 Fine-grained Token，权限仅需赋予对应私有仓库的「Contents: Read-only」。留空则代表仅代理公开链接。</div>
          </div>
        </div>

        <div class="stat-card">
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 1rem;">🧹 R2 存储自动清理策略</h3>
          <p style="color: var(--text-muted); font-size: 0.825rem; margin-bottom: 1rem;">自动删除超过指定天数的旧版本安装包，始终保留每个渠道最新 N 个版本，防止 R2 存储被历史包占满。</p>
          
          <div class="switch-wrap">
            <div class="switch-info">
              <span class="switch-title">启用自动清理</span>
              <span class="switch-desc">开启后，系统将每天凌晨自动扫描并清理超期旧版本 APK</span>
            </div>
            <input type="checkbox" id="cfg-auto-cleanup-enabled" class="switch-checkbox" />
          </div>

          <div class="form-row" style="margin-top: 1rem;">
            <div class="form-col form-group">
              <label class="form-label">保留天数 (超过此天数的旧版本将被清理)</label>
              <input type="number" id="cfg-auto-cleanup-days" class="form-control mono" value="90" min="1" max="3650" placeholder="90" />
              <div class="form-help">默认 90 天，建议根据发版频率调整</div>
            </div>
            <div class="form-col form-group">
              <label class="form-label">每个渠道至少保留版本数</label>
              <input type="number" id="cfg-auto-cleanup-keep" class="form-control mono" value="3" min="1" max="100" placeholder="3" />
              <div class="form-help">即使超期，也会保留每个 App 每个渠道最新的 N 个版本</div>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; margin-top: 1.25rem; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="runManualCleanup()">🧹 立即执行清理</button>
            <span id="cleanup-result" style="font-size: 0.825rem; color: var(--text-muted);"></span>
          </div>
        </div>
      </section>

      <!-- TAB 4: 接口调试台 -->
      <section id="tab-playground" class="hidden">
        <div class="section-header">
          <div>
            <h2 class="section-title">客户端接口调试台 & 开发者指南</h2>
            <p class="section-subtitle">一键模拟 Android / iOS / 客户端调用版本检测接口与下载请求</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <div class="stat-card">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;">🧪 模拟版本检测请求</h3>
            
            <div class="form-group">
              <label class="form-label">目标 App</label>
              <select id="pg-app-select" class="form-control" onchange="onPlaygroundAppChange()"></select>
            </div>

            <div class="form-row">
              <div class="form-col form-group">
                <label class="form-label">客户端当前 VersionCode</label>
                <input type="number" id="pg-cur-version" class="form-control mono" value="10000" placeholder="例如 10000" />
              </div>
              <div class="form-col form-group">
                <label class="form-label">渠道 Channel</label>
                <input type="text" id="pg-channel" class="form-control" value="default" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-col form-group">
                <label class="form-label">操作系统平台 (Platform)</label>
                <select id="pg-platform" class="form-control" onchange="updatePlaygroundCurl()">
                  <option value="">全部 / 自动匹配</option>
                  <option value="android">Android</option>
                  <option value="windows">Windows</option>
                  <option value="macos">macOS</option>
                  <option value="linux">Linux</option>
                  <option value="ios">iOS</option>
                  <option value="universal">Universal</option>
                </select>
              </div>
              <div class="form-col form-group">
                <label class="form-label">CPU 架构 (Arch)</label>
                <select id="pg-arch" class="form-control" onchange="updatePlaygroundCurl()">
                  <option value="">全部 / 自动匹配</option>
                  <option value="universal">Universal</option>
                  <option value="arm64-v8a">arm64-v8a</option>
                  <option value="armeabi-v7a">armeabi-v7a</option>
                  <option value="x86_64">x86_64</option>
                  <option value="x86">x86</option>
                  <option value="apple-silicon">apple-silicon</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">API Token (可选)</label>
              <input type="text" id="pg-token" class="form-control mono" placeholder="若开启了鉴权，在此填入 Token" />
            </div>

            <button class="btn btn-primary" style="width: 100%;" onclick="runPlaygroundTest()">发起模拟测试请求</button>

            <div style="margin-top: 1.25rem;">
              <label class="form-label">cURL 命令行代码：</label>
              <div id="pg-curl" class="code-box">curl -i ...</div>
            </div>
          </div>

          <div class="stat-card">
            <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 1rem;">📦 响应结果 (JSON)</h3>
            <div id="pg-response" class="code-box" style="min-height: 280px; white-space: pre-wrap;">点击左侧按钮发起测试...</div>
          </div>
        </div>
      </section>

      <!-- TAB 5: 完整 API 文档 -->
      <section id="tab-docs" class="hidden">
        <div class="section-header">
          <div>
            <h2 class="section-title">API 接口参考文档</h2>
            <p class="section-subtitle">详细的接口协议、参数说明、状态码与移动端多语言客户端接入代码</p>
          </div>
        </div>

        <!-- MCP 快速跳转横幅 -->
        <div style="background: linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%); border: 1px solid rgba(168, 85, 247, 0.35); border-radius: var(--radius-md); padding: 1rem 1.25rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-size: 1.5rem;">🤖</span>
            <div>
              <div style="font-weight: 700; font-size: 0.95rem; color: #c084fc;">需要使用 Cursor、Claude Desktop 等 AI 助手直接调用？</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">Yggdrasil 现已全面支持 Model Context Protocol (MCP) 开放标准，提供 14 项原生管理 Tools</div>
            </div>
          </div>
          <button class="btn btn-primary btn-sm" onclick="switchTab('mcp')">前往 MCP 协议中心 ➔</button>
        </div>

        <!-- 接口 1: 版本检测 -->
        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge badge-success" style="font-weight: 700;">GET</span>
              <span class="mono" style="font-size: 1rem; font-weight: 700;">/api/v1/app/latest</span>
              <span style="color: var(--text-muted); font-size: 0.85rem;">(别名: /api/v1/version/check)</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="copyText(window.location.origin + '/api/v1/app/latest', '接口路径已复制')">复制 URL</button>
          </div>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">
            供手机 App 启动时或点击“检查更新”时调用。服务端根据传入的 <code class="mono">version_code</code> 自动判断是否存在新版本及是否强制更新。
          </p>

          <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);">请求参数 (Query String)</h4>
          <table class="data-table" style="margin-bottom: 1rem;">
            <thead>
              <tr>
                <th>参数名</th>
                <th>类型</th>
                <th>必填</th>
                <th>说明</th>
                <th>示例</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="mono">app_id</td>
                <td>String</td>
                <td><span class="badge badge-warning">是</span></td>
                <td>应用包名或唯一标识</td>
                <td class="mono">com.example.app</td>
              </tr>
              <tr>
                <td class="mono">version_code</td>
                <td>Integer</td>
                <td>否</td>
                <td>客户端当前安装的版本号 (整数)</td>
                <td class="mono">10000</td>
              </tr>
              <tr>
                <td class="mono">channel</td>
                <td>String</td>
                <td>否</td>
                <td>渠道标识，默认 default</td>
                <td class="mono">default / beta</td>
              </tr>
              <tr>
                <td class="mono">platform</td>
                <td>String</td>
                <td>否</td>
                <td>目标操作系统平台 (android, windows, macos, linux, ios, universal)，用于自动匹配最佳安装包</td>
                <td class="mono">windows / android</td>
              </tr>
              <tr>
                <td class="mono">arch</td>
                <td>String</td>
                <td>否</td>
                <td>客户端 CPU 架构 (universal, arm64-v8a, armeabi-v7a, x86_64, x86, apple-silicon)</td>
                <td class="mono">x86_64</td>
              </tr>
              <tr>
                <td class="mono">token</td>
                <td>String</td>
                <td>否</td>
                <td>若开启了 Token 校验，可在此或 Header 传入</td>
                <td class="mono">ygg_sec_xxx</td>
              </tr>
            </tbody>
          </table>

          <h4 style="font-size: 0.85rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-main);">成功响应示例 (JSON)</h4>
          <div class="code-box">{
  "code": 0,
  "message": "success",
  "data": {
    "has_update": true,          // 是否有更新 (latest_version_code > current_version_code)
    "is_force": false,           // 是否强制更新 (标记强更或低于最低兼容版本)
    "app_id": "com.example.app",
    "app_name": "掌上办公",
    "icon_url": "https://example.com/icon.png",
    "current_version_code": 10000,
    "latest_version_code": 10200,
    "latest_version_name": "1.2.0",
    "min_version_code": 10000,
    "channel": "default",
    "platform": "windows",
    "arch": "x86_64",
    "changelog": "- 优化文件下载速度\n- 修复已知崩溃Bug",
    "download_url": "https://your-worker.workers.dev/api/v1/app/download?app_id=com.example.app&version_code=10200&platform=windows&arch=x86_64",
    "file_name": "app-v1.2.0-windows-x86_64.zip",
    "file_size": 45829104,
    "file_md5": "e10adc3949ba59abbe56e057f20f883e",
    "packages": [
      {
        "id": "pkg_win64",
        "platform": "windows",
        "arch": "x86_64",
        "file_name": "app-windows-x64.zip",
        "file_size": 45829104,
        "download_url": "https://your-worker.workers.dev/api/v1/app/download?app_id=com.example.app&version_code=10200&package_id=pkg_win64"
      },
      {
        "id": "pkg_arm64",
        "platform": "android",
        "arch": "arm64-v8a",
        "file_name": "app-android-arm64.apk",
        "file_size": 38401920,
        "download_url": "https://your-worker.workers.dev/api/v1/app/download?app_id=com.example.app&version_code=10200&package_id=pkg_arm64"
      }
    ],
    "release_time": "2026-08-18T10:00:00Z"
  }
}</div>
        </div>

        <!-- 接口 2: 最新安装包下载与分发 -->
        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge badge-success" style="font-weight: 700;">GET</span>
              <span class="mono" style="font-size: 1rem; font-weight: 700;">/api/v1/app/download</span>
              <span class="badge" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; font-weight: 700;">短链: /d/:app_id</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="copyText(window.location.origin + '/api/v1/app/download', '接口路径已复制')">复制 URL</button>
          </div>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.75rem; line-height: 1.6;">
            <b>最新安装包下载接口</b>。无需传递 <code class="mono">version_code</code> 即可默认下载当前应用的最新发布版本。支持加上 <code class="mono">platform</code> 与 <code class="mono">arch</code>（如 Windows x86_64、Android arm64-v8a、macOS apple-silicon 等），自动匹配下载对应的最新安装包；若未传参，Edge 边缘节点将根据访客 User-Agent 智能推断匹配。支持 <b>HTTP Range 206 断点续传</b>。
          </p>
          <div class="code-box"># 1. 显式指定平台与架构下载最新版 (如 Windows 64位)
curl -L -O "https://your-worker.workers.dev/api/v1/app/download?app_id=com.example.app&platform=windows&arch=x86_64"

# 2. 显式指定平台与架构下载最新版 (如 Android arm64)
curl -L -O "https://your-worker.workers.dev/api/v1/app/download?app_id=com.example.app&platform=android&arch=arm64-v8a"

# 3. 极简短链自适应下载 (自动识别系统或下载默认包)
curl -L -O "https://your-worker.workers.dev/d/com.example.app"

# 4. 断点续传测试 (分片请求 Range: bytes=0-1023)
curl -i -H "Range: bytes=0-1023" "https://your-worker.workers.dev/api/v1/app/download?app_id=com.example.app&platform=windows&arch=x86_64"</div>
        </div>

        <!-- 接口 3: 通用文件 -->
        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">📁 通用文件下载与检测接口</h3>
          <ul style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.8; margin-left: 1.25rem;">
            <li><b>元数据检测</b>: <code class="mono">GET /api/v1/files/check?alias=xxx</code> 或 <code class="mono">GET /api/v1/files/:id/check</code></li>
            <li><b>通过 ID 下载</b>: <code class="mono">GET /api/v1/files/:id/download</code></li>
            <li><b>通过短链别名下载</b>: <code class="mono">GET /f/:alias</code> (例如: <code class="mono">/f/my-config</code>)</li>
          </ul>
        </div>

        <!-- 客户端接入代码 -->
        <div class="stat-card">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">💻 客户端接入代码模版 (Android Kotlin)</h3>
          <div class="code-box" style="max-height: 380px;">// 1. 版本检测
val url = "https://your-worker.workers.dev/api/v1/app/latest?app_id=com.example.app&version_code=10000"
val request = Request.Builder().url(url).addHeader("X-Ygg-Token", "your_token").build()

client.newCall(request).enqueue(object : Callback {
    override fun onResponse(call: Call, response: Response) {
        val json = JSONObject(response.body?.string() ?: "")
        val data = json.getJSONObject("data")
        val hasUpdate = data.getBoolean("has_update")
        val downloadUrl = data.getString("download_url")
        // 若有更新，引导用户下载或自动拉起下载
    }
})

// 2. 断点续传下载
val downloadReq = Request.Builder()
    .url(downloadUrl)
    .addHeader("Range", "bytes=\${existingFile.length()}-")
    .build()</div>
        </div>

        <!-- 接口 4: MCP AI 助手接入 -->
        <div class="stat-card" style="margin-top: 1.5rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge" style="background: rgba(168, 85, 247, 0.15); color: #c084fc; font-weight: 700;">MCP</span>
              <span class="mono" style="font-size: 1rem; font-weight: 700;">/api/mcp</span>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="copyText(window.location.origin + '/api/mcp', 'MCP URL 已复制')">复制 MCP URL</button>
          </div>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.75rem;">
            原生支持 <b>Model Context Protocol (MCP)</b> 协议。Cursor、Claude Desktop、Antigravity CLI、Windsurf 等 AI 助手可直接连接并调用 14 项管理工具。
          </p>
          <div class="code-box"># Cursor / Claude Desktop 配置模版 (claude_desktop_config.json / mcp.json):
{
  "mcpServers": {
    "yggdrasil": {
      "command": "node",
      "args": ["dist/mcp-server.js"],
      "env": {
        "YGG_ENDPOINT": "https://your-worker.workers.dev",
        "YGG_TOKEN": "your_token_here"
      }
    }
  }
}</div>
        </div>
      </section>

      <!-- TAB 6: MCP (Model Context Protocol) 协议接入中心 -->
      <section id="tab-mcp" class="hidden">
        <div class="mcp-hero-banner">
          <div>
            <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
              <span style="font-size: 1.4rem;">🤖</span>
              <h2 style="font-size: 1.3rem; font-weight: 800; margin: 0; letter-spacing: -0.02em;">Model Context Protocol (MCP) 智能调用中心</h2>
              <span class="badge" style="background: rgba(16, 185, 129, 0.2); color: #6ee7b7; font-weight: 700;">🟢 服务已就绪</span>
              <span class="badge" style="background: rgba(168, 85, 247, 0.2); color: #c084fc; font-weight: 700;">14 项原生 Tools</span>
            </div>
            <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0; max-width: 720px; line-height: 1.6;">
              Yggdrasil 现已全面接入 MCP 开放协议标准！AI 助手（Cursor、Claude Desktop、Antigravity CLI、Windsurf、Cline 等）可原生感知并直接控制应用发版、版本检测、存储监控与旧包清理。
            </p>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            <button class="btn btn-secondary" onclick="testMcpHandshake()">⚡ 实时测试 MCP 握手</button>
            <button class="btn btn-primary" onclick="copyCurrentMcpConfig()">📋 复制客户端配置</button>
          </div>
        </div>

        <!-- 服务端点概览卡片 -->
        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.75rem;">🌐 核心连接端点与参数</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
            <div style="background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.85rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">远程 HTTP JSON-RPC 端点</div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
                <code class="mono" id="mcp-endpoint-val" style="color: var(--primary); font-size: 0.85rem; word-break: break-all;">/api/mcp</code>
                <button class="btn btn-secondary btn-sm" onclick="copyText(document.getElementById('mcp-endpoint-val').innerText, '端点 URL 已复制')">复制</button>
              </div>
            </div>
            <div style="background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.85rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem;">本地 STDIO CLI 执行命令</div>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
                <code class="mono" style="color: #c084fc; font-size: 0.85rem;">node dist/mcp-server.js</code>
                <button class="btn btn-secondary btn-sm" onclick="copyText('node dist/mcp-server.js', '命令已复制')">复制</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 客户端一键配置卡片 -->
        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.2rem;">🖥️ AI 客户端配置向导</h3>
              <p style="color: var(--text-muted); font-size: 0.825rem; margin: 0;">点击下方标签切换不同 AI 客户端，获取自动注入当前站点域名与 Token 的专属配置</p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="copyCurrentMcpConfig()">📋 复制当前代码</button>
          </div>

          <div class="mcp-client-tabs">
            <button class="mcp-client-btn active" data-client="cursor" onclick="selectMcpClient('cursor')">🖥️ Cursor</button>
            <button class="mcp-client-btn" data-client="claude" onclick="selectMcpClient('claude')">💬 Claude Desktop</button>
            <button class="mcp-client-btn" data-client="agy" onclick="selectMcpClient('agy')">🚀 Antigravity CLI</button>
            <button class="mcp-client-btn" data-client="windsurf" onclick="selectMcpClient('windsurf')">🏄 Windsurf / Cline</button>
            <button class="mcp-client-btn" data-client="http" onclick="selectMcpClient('http')">🌐 cURL / HTTP RPC</button>
          </div>

          <div id="mcp-config-guide" style="color: var(--text-muted); font-size: 0.825rem; margin-bottom: 0.65rem; line-height: 1.5;"></div>
          <div class="code-box" id="mcp-config-code" style="max-height: 280px; margin: 0; white-space: pre-wrap;"></div>
        </div>

        <!-- 在线测试 MCP 工具调用 -->
        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem;">🧪 在线 MCP 工具调用调试器</h3>
          <p style="color: var(--text-muted); font-size: 0.825rem; margin-bottom: 1rem;">直接在浏览器中实时调用 14 项 MCP Tools，验证边缘执行与响应结果</p>

          <div class="form-row">
            <div class="form-col form-group">
              <label class="form-label">选择测试工具</label>
              <select id="mcp-test-tool-select" class="form-control" onchange="onMcpToolSelectChange()">
                <option value="ygg_list_apps">ygg_list_apps (列出所有应用与发版概况)</option>
                <option value="ygg_get_app_details">ygg_get_app_details (获取指定应用详情与版本历史)</option>
                <option value="ygg_get_system_stats">ygg_get_system_stats (获取全局系统统计与存储占用)</option>
                <option value="ygg_check_update">ygg_check_update (检测版本更新模拟)</option>
                <option value="ygg_add_version_package">ygg_add_version_package (为版本新增分发安装包)</option>
                <option value="ygg_delete_version_package">ygg_delete_version_package (删除指定分发安装包)</option>
                <option value="ygg_list_files">ygg_list_files (列出通用文件)</option>
                <option value="ygg_trigger_cleanup">ygg_trigger_cleanup (执行旧版本存储清理)</option>
              </select>
            </div>
            <div class="form-col form-group">
              <label class="form-label">调用参数 JSON (arguments)</label>
              <input type="text" id="mcp-test-tool-args" class="form-control mono" value="{}" placeholder="{}" />
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; align-items: center; margin-top: 0.5rem; flex-wrap: wrap;">
            <button class="btn btn-primary" onclick="runOnlineMcpToolTest()">🚀 发送调用请求</button>
            <span id="mcp-test-status" style="font-size: 0.825rem; color: var(--text-muted);"></span>
          </div>

          <div style="margin-top: 1rem;">
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.4rem;">返回结果 (JSON-RPC 2.0 Response)</div>
            <div class="code-box" id="mcp-test-result" style="max-height: 240px; color: #a7f3d0;">// 点击上方“发送调用请求”测试工具返回结果</div>
          </div>
        </div>

        <!-- 14 项 MCP 工具全览 (卡片 Bento 列表) -->
        <div class="stat-card" style="margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.2rem;">🛠️ 原生可用 MCP Tools 全览 (共 14 项)</h3>
              <p style="color: var(--text-muted); font-size: 0.825rem; margin: 0;">AI 代理连接后将自动识别以下能力，可在对话中直接指示 AI 调用</p>
            </div>
            <input type="text" id="mcp-tool-filter" class="form-control" style="width: 240px;" placeholder="🔍 快速过滤工具名称..." oninput="filterMcpToolCards(this.value)" />
          </div>

          <div class="mcp-grid" id="mcp-tools-container">
            <!-- 动态渲染 14 项工具卡片 -->
          </div>
        </div>

        <!-- 实用 AI 对话 Prompt 场景模版 -->
        <div class="stat-card">
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.25rem;">💡 常用 AI 指令模版 (开箱即用)</h3>
          <p style="color: var(--text-muted); font-size: 0.825rem; margin-bottom: 1rem;">配置完成后，您可以直接在与 AI 对话中发出以下指令：</p>

          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <div style="flex: 1;">
                <div style="font-weight: 700; font-size: 0.85rem; color: #c084fc; margin-bottom: 0.25rem;">📦 自动化版本发布</div>
                <div class="mono" style="font-size: 0.825rem; color: var(--text-main);">“帮我将 Valhalla (com.norns.valhalla) 发布新版本 1.0.2，版本号为 10002，下载链接指向 GitHub Release 资产并开启边缘反代加速，更新日志写‘修复渲染卡顿’”</div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="copyText('帮我将 Valhalla (com.norns.valhalla) 发布新版本 1.0.2，版本号为 10002，下载链接指向 GitHub Release 资产并开启边缘反代加速，更新日志写‘修复渲染卡顿’', 'Prompt 已复制')">复制 Prompt</button>
            </div>

            <div style="background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <div style="flex: 1;">
                <div style="font-weight: 700; font-size: 0.85rem; color: #60a5fa; margin-bottom: 0.25rem;">🔍 状态巡检与版本体检</div>
                <div class="mono" style="font-size: 0.825rem; color: var(--text-main);">“查询 Yggdrasil 当前管理的所有移动应用，列出每个应用最新版本名称、版本号与累计下载量”</div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="copyText('查询 Yggdrasil 当前管理的所有移动应用，列出每个应用最新版本名称、版本号与累计下载量', 'Prompt 已复制')">复制 Prompt</button>
            </div>

            <div style="background: rgba(0, 0, 0, 0.2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.85rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap;">
              <div style="flex: 1;">
                <div style="font-weight: 700; font-size: 0.85rem; color: #34d399; margin-bottom: 0.25rem;">🧹 存储垃圾回收清理</div>
                <div class="mono" style="font-size: 0.825rem; color: var(--text-main);">“帮我查看当前系统的存储占用情况，并触发清理 60 天前的历史旧版本，每个渠道至少保留最新的 2 个版本”</div>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="copyText('帮我查看当前系统的存储占用情况，并触发清理 60 天前的历史旧版本，每个渠道至少保留最新的 2 个版本', 'Prompt 已复制')">复制 Prompt</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>

  <!-- MODAL: 创建应用 -->
  <div id="modal-create-app" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">创建新应用</h3>
        <button class="modal-close" onclick="closeModal('modal-create-app')">&times;</button>
      </div>
      <form onsubmit="handleCreateApp(event)">
        <div class="form-group">
          <label class="form-label">应用包名 / 唯一标识 (app_id) *</label>
          <input type="text" id="app-form-id" class="form-control mono" placeholder="com.example.myapp" required />
          <div class="form-help">客户端检测更新的核心标识符，创建后不可修改</div>
        </div>
        <div class="form-group">
          <label class="form-label">应用显示名称 *</label>
          <input type="text" id="app-form-name" class="form-control" placeholder="掌上办公" required />
        </div>
        <div class="form-group">
          <label class="form-label">应用图标 URL (可选)</label>
          <input type="url" id="app-form-icon" class="form-control" placeholder="https://example.com/icon.png" />
        </div>
        <div class="form-group">
          <label class="form-label">应用描述 (可选)</label>
          <textarea id="app-form-desc" class="form-control" placeholder="应用简介或备注..."></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal('modal-create-app')">取消</button>
          <button type="submit" class="btn btn-primary">立即创建</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: 发布新版本 (APK 上传) -->
  <div id="modal-release-version" class="modal-overlay">
    <div class="modal-card" style="max-width: 680px;">
      <div class="modal-header">
        <h3 class="modal-title" id="ver-modal-title">发布新版本</h3>
        <button class="modal-close" onclick="closeModal('modal-release-version')">&times;</button>
      </div>
      <form id="form-release-version" onsubmit="handleReleaseVersion(event)">
        <input type="hidden" id="ver-form-appid" />
        
        <!-- 安装包来源切换 -->
        <div class="form-group">
          <label class="form-label">安装包来源方式 *</label>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" id="pkg-mode-upload" class="btn btn-primary btn-sm" onclick="switchPackageMode('upload')" style="flex: 1;">📦 上传 APK 到 R2 存储</button>
            <button type="button" id="pkg-mode-external" class="btn btn-secondary btn-sm" onclick="switchPackageMode('external')" style="flex: 1;">🌐 填写第三方直链 (免上传)</button>
          </div>
        </div>

        <!-- 模式 1: R2 本地文件上传 -->
        <div id="pkg-sec-upload" class="form-group">
          <label class="form-label">选择 APK 安装包 *</label>
          <div id="drop-apk-zone" class="upload-zone" onclick="document.getElementById('file-apk-input').click()">
            <div class="upload-icon">📦</div>
            <div class="upload-text" id="drop-apk-text">点击或将 APK 文件拖拽至此区域</div>
            <div class="upload-hint">支持大文件自动分块直传 Cloudflare R2</div>
            <input type="file" id="file-apk-input" style="display: none;" onchange="onFileSelected(this, 'apk')" />
          </div>
          <div id="apk-progress-wrap" class="progress-bar-wrap">
            <div id="apk-progress-bar" class="progress-bar-inner"></div>
          </div>
          <div id="apk-upload-status" class="form-help" style="margin-top: 6px;"></div>
        </div>

        <!-- 模式 2: 第三方直链与反代设置 -->
        <div id="pkg-sec-external" class="form-group hidden">
          <label class="form-label">第三方 APK 下载直链 (URL) *</label>
          <input type="url" id="ver-form-exturl" class="form-control mono" placeholder="https://cdn.example.com/apps/app-v1.2.0.apk" oninput="checkReleaseSubmitReady()" />
          <div class="form-help" style="color: #fbbf24;">⚠️ 请填写外部源站真实公开文件直链（如 GitHub Release、自建 CDN、对象存储等）。切勿填写当前网关自身的 /api/v1/app/download 地址！</div>

          <div class="switch-wrap" style="margin-top: 0.75rem;">
            <div class="switch-info">
              <span class="switch-title">开启边缘反向代理加速 (Reverse Proxy)</span>
              <span class="switch-desc">默认关闭为 302 重定向跳转到第三方下载；开启后由当前 Worker 节点代理流式传输，隐藏源站真实 IP 并支持断点续传</span>
            </div>
            <input type="checkbox" id="ver-form-useproxy" class="switch-checkbox" />
          </div>

          <div class="form-row" style="margin-top: 0.75rem;">
            <div class="form-col form-group">
              <label class="form-label">文件名 (可选)</label>
              <input type="text" id="ver-form-extfilename" class="form-control" placeholder="如 app-v1.2.0.apk" />
            </div>
            <div class="form-col form-group">
              <label class="form-label">文件大小 (字节，可选)</label>
              <input type="number" id="ver-form-extsize" class="form-control mono" placeholder="如 45829104" />
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">分发平台 (Platform)</label>
            <select id="ver-form-platform" class="form-control">
              <option value="android" selected>🤖 Android (安卓)</option>
              <option value="windows">💻 Windows (微软桌面)</option>
              <option value="macos">🍎 macOS (苹果桌面)</option>
              <option value="linux">🐧 Linux (桌面/服务端)</option>
              <option value="ios">📱 iOS (苹果手机)</option>
              <option value="universal">🌐 Universal (跨平台通用)</option>
            </select>
          </div>
          <div class="form-col form-group">
            <label class="form-label">CPU 架构 (Architecture)</label>
            <select id="ver-form-arch" class="form-control">
              <option value="universal" selected>🌐 Universal (全架构通用)</option>
              <option value="arm64-v8a">ARM64 (arm64-v8a / aarch64)</option>
              <option value="armeabi-v7a">ARM32 (armeabi-v7a)</option>
              <option value="x86_64">x86_64 (Intel / AMD 64位)</option>
              <option value="x86">x86 (Intel 32位)</option>
              <option value="apple-silicon">Apple Silicon (M1/M2/M3/M4)</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">版本名称 (versionName) *</label>
            <input type="text" id="ver-form-name" class="form-control" placeholder="1.2.0" required />
          </div>
          <div class="form-col form-group">
            <label class="form-label">版本号 (versionCode 整数) *</label>
            <input type="number" id="ver-form-code" class="form-control mono" placeholder="10200" required />
            <div class="form-help">必须大于旧版本号</div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">发布渠道 (channel)</label>
            <input type="text" id="ver-form-channel" class="form-control" value="default" placeholder="default / beta / googleplay" />
          </div>
          <div class="form-col form-group">
            <label class="form-label">最低兼容版本号 (minVersionCode)</label>
            <input type="number" id="ver-form-mincode" class="form-control mono" value="0" placeholder="低于此版本将强制更新" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">版本更新日志 (Changelog)</label>
          <textarea id="ver-form-log" class="form-control" placeholder="- 优化下载性能与断点续传&#10;- 修复已知崩溃Bug"></textarea>
        </div>

        <div class="switch-wrap">
          <div class="switch-info">
            <span class="switch-title">是否设为强制更新 (Force Update)</span>
            <span class="switch-desc">勾选后，客户端检测更新时将标记必须升级</span>
          </div>
          <input type="checkbox" id="ver-form-force" class="switch-checkbox" />
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal('modal-release-version')">取消</button>
          <button type="submit" id="btn-release-submit" class="btn btn-primary" disabled>上传并发布新版本</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: 编辑历史版本信息 -->
  <div id="modal-edit-version" class="modal-overlay">
    <div class="modal-card" style="max-width: 650px;">
      <div class="modal-header">
        <h3 class="modal-title" id="edit-ver-modal-title">编辑版本信息</h3>
        <button class="modal-close" onclick="closeModal('modal-edit-version')">&times;</button>
      </div>
      <form id="form-edit-version" onsubmit="handleUpdateVersion(event)">
        <input type="hidden" id="edit-ver-id" />
        <input type="hidden" id="edit-ver-appid" />

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">版本名称 (versionName) *</label>
            <input type="text" id="edit-ver-name" class="form-control" placeholder="1.2.0" required />
          </div>
          <div class="form-col form-group">
            <label class="form-label">版本号 (versionCode 整数)</label>
            <input type="number" id="edit-ver-code" class="form-control mono" readonly disabled style="opacity: 0.7; cursor: not-allowed;" />
            <div class="form-help">版本号作为唯一标识不可修改</div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">发布渠道 (channel)</label>
            <input type="text" id="edit-ver-channel" class="form-control" placeholder="default / beta" />
          </div>
          <div class="form-col form-group">
            <label class="form-label">最低兼容版本号 (minVersionCode)</label>
            <input type="number" id="edit-ver-mincode" class="form-control mono" placeholder="低于此版本将强制更新" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">下载保存文件名 (fileName)</label>
          <input type="text" id="edit-ver-filename" class="form-control" placeholder="app-v1.2.0.apk" />
        </div>

        <div class="form-group">
          <label class="form-label">第三方 APK 下载直链 (URL)</label>
          <input type="url" id="edit-ver-exturl" class="form-control mono" placeholder="https://cdn.example.com/apps/app-v1.2.0.apk" />
          <div class="form-help" style="color: #fbbf24;">⚠️ 填写外部源站真实公开文件直链；切勿填写当前网关自身的 /api/v1/app/download 地址。留空代表使用 R2 存储原安装包。</div>
        </div>

        <div class="switch-wrap" style="margin-bottom: 1rem;">
          <div class="switch-info">
            <span class="switch-title">开启边缘反向代理加速 (Reverse Proxy)</span>
            <span class="switch-desc">默认关闭为 302 重定向到第三方直链；开启后由 Edge 节点代理流式传输，隐藏源站并支持断点续传</span>
          </div>
          <input type="checkbox" id="edit-ver-useproxy" class="switch-checkbox" />
        </div>

        <div class="form-group">
          <label class="form-label">版本更新日志 (Changelog)</label>
          <textarea id="edit-ver-log" class="form-control" style="min-height: 80px;" placeholder="- 优化下载性能与断点续传&#10;- 修复已知Bug"></textarea>
        </div>

        <div class="form-row">
          <div class="form-col switch-wrap">
            <div class="switch-info">
              <span class="switch-title">强制更新</span>
            </div>
            <input type="checkbox" id="edit-ver-force" class="switch-checkbox" />
          </div>
          <div class="form-col switch-wrap">
            <div class="switch-info">
              <span class="switch-title">上架发布状态</span>
            </div>
            <input type="checkbox" id="edit-ver-published" class="switch-checkbox" />
          </div>
        </div>

        <div class="modal-footer" style="margin-top: 1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="closeModal('modal-edit-version')">取消</button>
          <button type="submit" class="btn btn-primary" id="btn-edit-ver-submit">保存修改</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: 为版本添加分发安装包 -->
  <div id="modal-add-package" class="modal-overlay">
    <div class="modal-card" style="max-width: 650px;">
      <div class="modal-header">
        <h3 class="modal-title" id="add-pkg-modal-title">添加分发安装包</h3>
        <button class="modal-close" onclick="closeModal('modal-add-package')">&times;</button>
      </div>
      <form id="form-add-package" onsubmit="handleAddPackage(event)">
        <input type="hidden" id="add-pkg-verid" />
        <input type="hidden" id="add-pkg-appid" />

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">目标平台 (Platform) *</label>
            <select id="add-pkg-platform" class="form-control" required>
              <option value="android">🤖 Android (安卓)</option>
              <option value="windows" selected>💻 Windows (微软桌面)</option>
              <option value="macos">🍎 macOS (苹果桌面)</option>
              <option value="linux">🐧 Linux (桌面/服务端)</option>
              <option value="ios">📱 iOS (苹果手机)</option>
              <option value="universal">🌐 Universal (跨平台通用)</option>
            </select>
          </div>
          <div class="form-col form-group">
            <label class="form-label">CPU 架构 (Architecture) *</label>
            <select id="add-pkg-arch" class="form-control" required>
              <option value="universal">🌐 Universal (全架构通用)</option>
              <option value="x86_64" selected>x86_64 (Intel / AMD 64位)</option>
              <option value="x86">x86 (Intel 32位)</option>
              <option value="arm64-v8a">ARM64 (arm64-v8a / aarch64)</option>
              <option value="armeabi-v7a">ARM32 (armeabi-v7a)</option>
              <option value="apple-silicon">Apple Silicon (M1/M2/M3/M4)</option>
            </select>
          </div>
        </div>

        <!-- 安装包来源切换 -->
        <div class="form-group">
          <label class="form-label">安装包来源方式 *</label>
          <div style="display: flex; gap: 0.5rem;">
            <button type="button" id="add-pkg-mode-upload" class="btn btn-secondary btn-sm" onclick="switchAddPkgMode('upload')" style="flex: 1;">📦 上传文件到 R2 存储</button>
            <button type="button" id="add-pkg-mode-external" class="btn btn-primary btn-sm" onclick="switchAddPkgMode('external')" style="flex: 1;">🌐 填写第三方直链 (免上传)</button>
          </div>
        </div>

        <!-- 模式 1: R2 本地文件上传 -->
        <div id="add-pkg-sec-upload" class="form-group hidden">
          <label class="form-label">选择安装包文件 *</label>
          <div id="drop-add-pkg-zone" class="upload-zone" onclick="document.getElementById('file-add-pkg-input').click()">
            <div class="upload-icon">📦</div>
            <div class="upload-text" id="drop-add-pkg-text">点击或将安装包拖拽至此区域</div>
            <div class="upload-hint">支持 .apk, .exe, .msi, .dmg, .pkg, .deb, .zip, .tar.gz 等文件格式</div>
            <input type="file" id="file-add-pkg-input" style="display: none;" onchange="onAddPkgFileSelected(this)" />
          </div>
          <div id="add-pkg-progress-wrap" class="progress-bar-wrap">
            <div id="add-pkg-progress-bar" class="progress-bar-inner"></div>
          </div>
          <div id="add-pkg-upload-status" class="form-help" style="margin-top: 6px;"></div>
        </div>

        <!-- 模式 2: 第三方直链与反代设置 -->
        <div id="add-pkg-sec-external" class="form-group">
          <label class="form-label">第三方安装包下载直链 (URL) *</label>
          <input type="url" id="add-pkg-exturl" class="form-control mono" placeholder="https://github.com/.../valhalla-windows-x64.zip" oninput="checkAddPkgSubmitReady()" />
          <div class="form-help" style="color: #fbbf24;">⚠️ 请填写外部源站真实公开文件直链（如 GitHub Release、自建 CDN、网盘直链等）。切勿填写当前网关自身接口！</div>

          <div class="switch-wrap" style="margin-top: 0.75rem;">
            <div class="switch-info">
              <span class="switch-title">开启边缘反向代理加速 (Reverse Proxy)</span>
              <span class="switch-desc">关闭为 302 重定向；开启后由当前 Worker 节点代理流式传输，隐藏源站并支持断点续传</span>
            </div>
            <input type="checkbox" id="add-pkg-useproxy" class="switch-checkbox" />
          </div>

          <div class="form-row" style="margin-top: 0.75rem;">
            <div class="form-col form-group">
              <label class="form-label">文件名 (可选)</label>
              <input type="text" id="add-pkg-filename" class="form-control" placeholder="如 valhalla-windows-x64.zip" />
            </div>
            <div class="form-col form-group">
              <label class="form-label">文件大小 (字节，可选)</label>
              <input type="number" id="add-pkg-filesize" class="form-control mono" placeholder="如 52428800" />
            </div>
          </div>
        </div>

        <div class="modal-footer" style="margin-top: 1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="closeModal('modal-add-package')">取消</button>
          <button type="submit" id="btn-add-pkg-submit" class="btn btn-primary">确认添加安装包</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: 编辑分发安装包 -->
  <div id="modal-edit-package" class="modal-overlay">
    <div class="modal-card" style="max-width: 600px;">
      <div class="modal-header">
        <h3 class="modal-title" id="edit-pkg-modal-title">编辑分发安装包</h3>
        <button class="modal-close" onclick="closeModal('modal-edit-package')">&times;</button>
      </div>
      <form id="form-edit-package" onsubmit="handleUpdatePackage(event)">
        <input type="hidden" id="edit-pkg-id" />
        <input type="hidden" id="edit-pkg-appid" />

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">目标平台 (Platform)</label>
            <select id="edit-pkg-platform" class="form-control">
              <option value="android">🤖 Android</option>
              <option value="windows">💻 Windows</option>
              <option value="macos">🍎 macOS</option>
              <option value="linux">🐧 Linux</option>
              <option value="ios">📱 iOS</option>
              <option value="universal">🌐 Universal</option>
            </select>
          </div>
          <div class="form-col form-group">
            <label class="form-label">CPU 架构 (Architecture)</label>
            <select id="edit-pkg-arch" class="form-control">
              <option value="universal">Universal</option>
              <option value="x86_64">x86_64</option>
              <option value="x86">x86</option>
              <option value="arm64-v8a">ARM64</option>
              <option value="armeabi-v7a">ARM32</option>
              <option value="apple-silicon">Apple Silicon</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">文件名</label>
          <input type="text" id="edit-pkg-filename" class="form-control" />
        </div>

        <div class="form-group">
          <label class="form-label">文件大小 (字节)</label>
          <input type="number" id="edit-pkg-filesize" class="form-control mono" />
        </div>

        <div class="form-group">
          <label class="form-label">第三方下载直链 (可选)</label>
          <input type="url" id="edit-pkg-exturl" class="form-control mono" />
        </div>

        <div class="switch-wrap">
          <div class="switch-info">
            <span class="switch-title">开启边缘反向代理加速</span>
            <span class="switch-desc">由 Worker 代理流式传输，隐藏源站并支持断点续传</span>
          </div>
          <input type="checkbox" id="edit-pkg-useproxy" class="switch-checkbox" />
        </div>

        <div class="modal-footer" style="margin-top: 1.5rem;">
          <button type="button" class="btn btn-secondary" onclick="closeModal('modal-edit-package')">取消</button>
          <button type="submit" class="btn btn-primary" id="btn-edit-pkg-submit">保存修改</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: 上传通用文件 -->
  <div id="modal-upload-file" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <h3 class="modal-title">上传通用文件</h3>
        <button class="modal-close" onclick="closeModal('modal-upload-file')">&times;</button>
      </div>
      <form onsubmit="handleUploadGenericFile(event)">
        <div class="form-group">
          <label class="form-label">选择文件 *</label>
          <div class="upload-zone" onclick="document.getElementById('file-generic-input').click()">
            <div class="upload-icon">📄</div>
            <div class="upload-text" id="drop-gen-text">点击或将文件拖拽至此</div>
            <div class="upload-hint">支持配置文件、文档、媒体、安装包等任意类型</div>
            <input type="file" id="file-generic-input" style="display: none;" onchange="onFileSelected(this, 'generic')" />
          </div>
          <div id="gen-progress-wrap" class="progress-bar-wrap">
            <div id="gen-progress-bar" class="progress-bar-inner"></div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">文件显示名称 *</label>
          <input type="text" id="gen-form-name" class="form-control" placeholder="app-config.json" required />
        </div>

        <div class="form-row">
          <div class="form-col form-group">
            <label class="form-label">分类 (Category)</label>
            <input type="text" id="gen-form-cat" class="form-control" value="general" placeholder="config / document / tool" />
          </div>
          <div class="form-col form-group">
            <label class="form-label">自定义短链别名 (Alias)</label>
            <input type="text" id="gen-form-alias" class="form-control mono" placeholder="如 my-config" />
            <div class="form-help">可通过 /f/&lt;alias&gt; 直接下载</div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal('modal-upload-file')">取消</button>
          <button type="submit" id="btn-gen-submit" class="btn btn-primary" disabled>开始上传</button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL: 获取应用最新版多平台下载链接 -->
  <div id="modal-app-download" class="modal-overlay">
    <div class="modal-card" style="max-width: 680px;">
      <div class="modal-header">
        <h3 class="modal-title" id="dl-modal-title">📥 获取应用最新版下载链接</h3>
        <button class="modal-close" onclick="closeModal('modal-app-download')">&times;</button>
      </div>
      <div style="padding: 1.25rem 1.5rem;">
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.25rem; line-height: 1.6;">
          以下直链始终<b>永久指向该应用的最新发布版本</b>。后续发布新版本时无需更换外部下载地址。支持通过添加 <code class="mono" style="color: #38bdf8;">platform</code> 和 <code class="mono" style="color: #38bdf8;">arch</code> 参数自动下载对应平台与架构的安装包。
        </p>

        <!-- 常用平台快捷直链 -->
        <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 0.6rem; color: var(--text-main); display: flex; align-items: center; justify-content: space-between;">
          <span>🌟 常用平台与架构快捷链接</span>
          <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">点击复制或直接测试</span>
        </div>
        <div id="dl-quick-links" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.25rem; max-height: 240px; overflow-y: auto; padding-right: 2px;">
          <!-- JS 动态渲染 -->
        </div>

        <!-- 自定义参数生成器 -->
        <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem;">
          <div style="font-weight: 700; font-size: 0.875rem; margin-bottom: 0.75rem; color: var(--text-main);">
            ⚙️ 定制特定平台与架构下载链接
          </div>
          <div class="form-row">
            <div class="form-col form-group">
              <label class="form-label">操作系统平台 (Platform)</label>
              <select id="dl-custom-platform" class="form-control" onchange="updateCustomDownloadUrl()">
                <option value="">（不限 / 自动识别访客系统）</option>
                <option value="windows">Windows</option>
                <option value="android">Android</option>
                <option value="macos">macOS</option>
                <option value="linux">Linux</option>
                <option value="ios">iOS</option>
                <option value="universal">Universal (通用)</option>
              </select>
            </div>
            <div class="form-col form-group">
              <label class="form-label">CPU 架构 (Arch)</label>
              <select id="dl-custom-arch" class="form-control" onchange="updateCustomDownloadUrl()">
                <option value="">（不限 / 默认架构）</option>
                <option value="universal">universal (通用架构)</option>
                <option value="x86_64">x86_64 (64位 Intel/AMD)</option>
                <option value="arm64-v8a">arm64-v8a (64位 ARM)</option>
                <option value="armeabi-v7a">armeabi-v7a (32位 ARM)</option>
                <option value="apple-silicon">apple-silicon (M系列芯片)</option>
                <option value="x86">x86 (32位 PC)</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-col form-group" style="margin-bottom: 0.5rem;">
              <label class="form-label">发布渠道 (Channel)</label>
              <input type="text" id="dl-custom-channel" class="form-control mono" value="default" placeholder="default" oninput="updateCustomDownloadUrl()" />
            </div>
          </div>

          <div style="margin-top: 0.75rem;">
            <label class="form-label">标准 API 下载链接：</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <input type="text" id="dl-result-url" class="form-control mono" readonly style="font-size: 0.8rem; background: var(--bg-card);" />
              <button class="btn btn-secondary btn-sm" onclick="copyInput('dl-result-url', '标准最新版下载链接已复制')">复制</button>
              <a id="dl-result-btn" href="#" target="_blank" class="btn btn-primary btn-sm" style="text-decoration: none;">直接下载</a>
            </div>
          </div>

          <div style="margin-top: 0.75rem;">
            <label class="form-label">极简短链 (Short Link)：</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <input type="text" id="dl-short-url" class="form-control mono" readonly style="font-size: 0.8rem; background: var(--bg-card);" />
              <button class="btn btn-secondary btn-sm" onclick="copyInput('dl-short-url', '极简短链已复制')">复制</button>
              <a id="dl-short-btn" href="#" target="_blank" class="btn btn-secondary btn-sm" style="text-decoration: none;">直接下载</a>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="margin-top: 1.25rem;">
          <button type="button" class="btn btn-secondary" onclick="closeModal('modal-app-download')">关闭</button>
        </div>
      </div>
    </div>
  </div>

  <!-- TOAST CONTAINER -->
  <div id="toast-container" class="toast-container"></div>

  <!-- CLIENT SCRIPTS -->
  <script>
    // State
    let currentUser = null;
    let appsData = [];
    let filesData = [];
    let settingsData = {};
    let activeTab = 'apps';
    let pendingUploadResult = null; // { file_key, file_name, file_size, file_md5, mime_type }

    // Helpers
    function showToast(msg, type = 'success') {
      const c = document.getElementById('toast-container');
      const t = document.createElement('div');
      t.className = 'toast ' + type;
      t.innerText = msg;
      c.appendChild(t);
      setTimeout(() => { t.remove(); }, 3000);
    }

    function formatBytes(bytes, decimals = 2) {
      if (!+bytes) return '0 B';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return \`\${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} \${sizes[i]}\`;
    }

    function copyText(text, successMsg = '已复制到剪贴板') {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        const input = document.createElement('input');
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
        showToast(successMsg);
      });
    }

    function copyInput(id, successMsg = '已复制') {
      const el = document.getElementById(id);
      if (el) copyText(el.value, successMsg);
    }

    let currentDlModalAppId = '';
    function openAppDownloadModal(appId, appName) {
      currentDlModalAppId = appId;
      document.getElementById('dl-modal-title').textContent = '📥 ' + appName + ' - 最新版下载链接';
      document.getElementById('dl-custom-platform').value = '';
      document.getElementById('dl-custom-arch').value = '';
      document.getElementById('dl-custom-channel').value = 'default';

      const origin = window.location.origin;
      const presets = [
        { label: '🌐 全平台自适应 (自动识别 User-Agent)', desc: '直接访问，系统自动识别访客的操作系统与架构匹配下载', plat: '', arch: '' },
        { label: '🪟 Windows (x86_64)', desc: '自动匹配下载最新 Windows 64位安装包', plat: 'windows', arch: 'x86_64' },
        { label: '🤖 Android (arm64-v8a)', desc: '自动匹配下载最新主流 Android 64位 APK', plat: 'android', arch: 'arm64-v8a' },
        { label: '🤖 Android (通用/Universal)', desc: '自动匹配下载最新 Android 通用 APK', plat: 'android', arch: 'universal' },
        { label: '🍏 macOS (Apple Silicon M系列)', desc: '自动匹配下载最新 Mac M系列芯片安装包', plat: 'macos', arch: 'apple-silicon' },
        { label: '🍏 macOS (Intel x86_64)', desc: '自动匹配下载最新 Mac Intel芯片安装包', plat: 'macos', arch: 'x86_64' },
        { label: '🐧 Linux (x86_64)', desc: '自动匹配下载最新 Linux 64位软件包', plat: 'linux', arch: 'x86_64' },
        { label: '📦 Universal (全架构通用)', desc: '下载全平台/架构通用分发包', plat: 'universal', arch: 'universal' },
      ];

      const container = document.getElementById('dl-quick-links');
      container.innerHTML = presets.map(p => {
        let url = \`\${origin}/api/v1/app/download?app_id=\${encodeURIComponent(appId)}\`;
        if (p.plat) url += \`&platform=\${encodeURIComponent(p.plat)}\`;
        if (p.arch) url += \`&arch=\${encodeURIComponent(p.arch)}\`;

        return \`
          <div style="background: var(--bg-hover); border: 1px solid var(--border-color); border-radius: 6px; padding: 0.6rem 0.8rem; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
            <div>
              <div style="font-weight: 600; font-size: 0.825rem; color: var(--text-main);">\${p.label}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">\${p.desc}</div>
            </div>
            <div style="display: flex; gap: 0.4rem;">
              <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.25rem 0.6rem;" onclick="copyText('\${url}', '\${p.label} 下载链接已复制')">复制链接</button>
              <a href="\${url}" target="_blank" class="btn btn-primary btn-sm" style="font-size: 0.75rem; padding: 0.25rem 0.6rem; text-decoration: none;">直接下载</a>
            </div>
          </div>
        \`;
      }).join('');

      updateCustomDownloadUrl();
      openModal('modal-app-download');
    }

    function updateCustomDownloadUrl() {
      if (!currentDlModalAppId) return;
      const plat = document.getElementById('dl-custom-platform').value;
      const arch = document.getElementById('dl-custom-arch').value;
      const channel = (document.getElementById('dl-custom-channel').value || '').trim();

      const origin = window.location.origin;
      let params = new URLSearchParams();
      params.set('app_id', currentDlModalAppId);
      if (channel && channel !== 'default') params.set('channel', channel);
      if (plat) params.set('platform', plat);
      if (arch) params.set('arch', arch);

      const fullUrl = \`\${origin}/api/v1/app/download?\${params.toString()}\`;
      document.getElementById('dl-result-url').value = fullUrl;
      document.getElementById('dl-result-btn').href = fullUrl;

      let shortParams = new URLSearchParams();
      if (channel && channel !== 'default') shortParams.set('channel', channel);
      if (plat) shortParams.set('platform', plat);
      if (arch) shortParams.set('arch', arch);
      const qStr = shortParams.toString();
      const shortUrl = \`\${origin}/d/\${encodeURIComponent(currentDlModalAppId)}\${qStr ? '?' + qStr : ''}\`;
      document.getElementById('dl-short-url').value = shortUrl;
      document.getElementById('dl-short-btn').href = shortUrl;
    }

    function openModal(id) {
      document.getElementById(id).classList.add('active');
    }
    function closeModal(id) {
      document.getElementById(id).classList.remove('active');
    }

    // Tab Switching
    function switchTab(tabId) {
      activeTab = tabId;
      document.querySelectorAll('.nav-tab').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-tab') === tabId);
      });
      ['apps', 'files', 'settings', 'playground', 'docs', 'mcp'].forEach(t => {
        const el = document.getElementById('tab-' + t);
        if (el) el.classList.toggle('hidden', t !== tabId);
      });

      if (tabId === 'apps') loadApps();
      if (tabId === 'files') loadFiles();
      if (tabId === 'settings') loadSettings();
      if (tabId === 'playground') setupPlayground();
      if (tabId === 'mcp') renderMcpTab();
    }

    // API Helper with credentials
    async function apiRequest(url, options = {}) {
      options.headers = options.headers || {};
      const token = localStorage.getItem('ygg_jwt');
      if (token) {
        options.headers['Authorization'] = 'Bearer ' + token;
      }
      const res = await fetch(url, options);
      if (res.status === 401 && !url.includes('/api/admin/login')) {
        showLoginView();
        throw new Error('Unauthorized');
      }
      return res;
    }

    // Check Login
    async function checkAuth() {
      try {
        const res = await apiRequest('/api/admin/me');
        if (res.ok) {
          currentUser = 'admin';
          showAppView();
          loadStats();
          loadApps();
        } else {
          showLoginView();
        }
      } catch (e) {
        showLoginView();
      }
    }

    function showLoginView() {
      document.getElementById('login-view').classList.remove('hidden');
      document.getElementById('app-view').classList.add('hidden');
    }
    function showAppView() {
      document.getElementById('login-view').classList.add('hidden');
      document.getElementById('app-view').classList.remove('hidden');
    }

    // Login & Logout
    async function handleLogin(e) {
      e.preventDefault();
      const pwd = document.getElementById('login-password').value;
      const btn = document.getElementById('btn-login-submit');
      btn.disabled = true;
      btn.innerText = '登录中...';

      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pwd })
        });
        const data = await res.json();
        if (data.code === 0 && data.data?.token) {
          localStorage.setItem('ygg_jwt', data.data.token);
          showToast('登录成功');
          checkAuth();
        } else {
          showToast(data.message || '密码错误', 'error');
        }
      } catch (err) {
        showToast('登录失败: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerText = '登 录 控 制 台';
      }
    }

    async function handleLogout() {
      await apiRequest('/api/admin/logout', { method: 'POST' });
      localStorage.removeItem('ygg_jwt');
      showLoginView();
      showToast('已登出');
    }

    function showGlobalAlert(msg) {
      const banner = document.getElementById('global-alert-banner');
      const text = document.getElementById('global-alert-text');
      if (banner && text) {
        text.innerText = msg;
        banner.classList.remove('hidden');
      }
    }

    // Stats
    async function loadStats() {
      try {
        const res = await apiRequest('/api/admin/stats');
        const data = await res.json();
        if (data.code === 0 && data.data) {
          document.getElementById('stat-apps').innerText = \`\${data.data.totalApps} / \${data.data.totalVersions}\`;
          document.getElementById('stat-files').innerText = data.data.totalFiles;
          document.getElementById('stat-storage').innerText = formatBytes(data.data.totalStorageBytes);
          document.getElementById('stat-downloads').innerText = data.data.totalDownloads;
        } else if (data.message && (data.message.includes('绑定缺失') || data.message.includes('D1'))) {
          showGlobalAlert(data.message);
        }
      } catch (e) {}
    }

    // Apps Management
    async function loadApps() {
      try {
        const res = await apiRequest('/api/admin/apps');
        const data = await res.json();
        if (data.code === 0) {
          appsData = data.data || [];
          renderApps();
        } else if (data.message && (data.message.includes('绑定缺失') || data.message.includes('D1'))) {
          showGlobalAlert(data.message);
        }
      } catch (e) {}
    }

    function renderApps() {
      const c = document.getElementById('apps-list-container');
      if (!appsData.length) {
        c.innerHTML = \`
          <div class="stat-card" style="text-align: center; padding: 3rem 1rem;">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📱</div>
            <div style="font-size: 1.1rem; font-weight: 700;">暂未创建任何应用</div>
            <p style="color: var(--text-muted); margin: 0.5rem 0 1.25rem;">点击上方“创建新应用”开始托管你的第一个 App / APK 发布</p>
            <button class="btn btn-primary" onclick="openCreateAppModal()">+ 立即创建应用</button>
          </div>
        \`;
        return;
      }

      const origin = window.location.origin;

      c.innerHTML = appsData.map(app => {
        const checkApiUrl = \`\${origin}/api/v1/app/latest?app_id=\${encodeURIComponent(app.app_id)}\`;
        const downloadUrl = \`\${origin}/api/v1/app/download?app_id=\${encodeURIComponent(app.app_id)}\`;
        const avatar = app.icon_url ? \`<img src="\${app.icon_url}" alt="\${app.name}" />\` : '📱';

        return \`
          <div class="app-card" id="app-card-\${app.app_id}">
            <div class="app-card-top">
              <div class="app-info">
                <div class="app-avatar">\${avatar}</div>
                <div class="app-name-wrap">
                  <div class="app-name">
                    \${app.name}
                    \${app.latest_version_name ? \`<span class="badge badge-success">最新: v\${app.latest_version_name}</span>\` : '<span class="badge badge-warning">暂无发布版本</span>'}
                  </div>
                  <div class="app-pkg">\${app.app_id}</div>
                </div>
              </div>

              <div class="app-actions">
                <button class="btn btn-primary btn-sm" onclick="openReleaseModal('\${app.app_id}', '\${app.name.replace(/'/g, "\\'")}')">+ 发布新版本</button>
                <button class="btn btn-secondary btn-sm" onclick="toggleVersionsDrawer('\${app.app_id}')">历史版本 (\${app.version_count || 0})</button>
                <button class="btn btn-secondary btn-sm" onclick="openAppDownloadModal('\${app.app_id}', '\${(app.name || app.app_id).replace(/'/g, "\\'")}')">📥 最新下载链接</button>
                <button class="btn btn-secondary btn-sm" onclick="copyText('\${checkApiUrl}', '版本检测接口 URL 已复制')">复制检测 API</button>
                <button class="btn btn-secondary btn-sm" onclick="copyText('\${downloadUrl}', '最新版下载链接已复制')">复制直链</button>
                <button class="btn btn-danger btn-sm" onclick="deleteApp('\${app.app_id}')">删除应用</button>
              </div>
            </div>

            <div class="app-meta-badges">
              <span class="badge">总下载量: \${app.total_downloads || 0}</span>
              <span class="badge">创建时间: \${(app.created_at || '').substring(0, 10)}</span>
              \${app.description ? \`<span style="color: var(--text-dim); font-size: 0.8rem; margin-left: 0.5rem;">\${app.description}</span>\` : ''}
            </div>

            <!-- 动态折叠的历史版本列表容器 -->
            <div id="versions-box-\${app.app_id.replace(/\\./g, '_')}" class="version-container hidden">
              <div style="font-weight: 600; margin-bottom: 0.75rem; color: var(--text-muted);">📦 历史发布版本记录</div>
              <div class="versions-content" id="versions-content-\${app.app_id.replace(/\\./g, '_')}">
                加载版本列表中...
              </div>
            </div>
          </div>
        \`;
      }).join('');
    }

    function openCreateAppModal() {
      document.getElementById('app-form-id').value = '';
      document.getElementById('app-form-name').value = '';
      document.getElementById('app-form-icon').value = '';
      document.getElementById('app-form-desc').value = '';
      openModal('modal-create-app');
    }

    async function handleCreateApp(e) {
      e.preventDefault();
      const appId = document.getElementById('app-form-id').value.trim();
      const name = document.getElementById('app-form-name').value.trim();
      const iconUrl = document.getElementById('app-form-icon').value.trim();
      const desc = document.getElementById('app-form-desc').value.trim();

      try {
        const res = await apiRequest('/api/admin/apps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ app_id: appId, name, icon_url: iconUrl, description: desc })
        });
        const data = await res.json();
        if (data.code === 0) {
          showToast('应用创建成功');
          closeModal('modal-create-app');
          loadApps();
          loadStats();
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('创建失败: ' + err.message, 'error');
      }
    }

    async function deleteApp(appId) {
      if (!confirm(\`确定要删除应用 \${appId} 吗？所有历史版本及对应的 APK 文件将被永久清理！\`)) return;

      try {
        const res = await apiRequest('/api/admin/apps/' + encodeURIComponent(appId), { method: 'DELETE' });
        const data = await res.json();
        if (data.code === 0) {
          showToast('应用已删除');
          loadApps();
          loadStats();
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('删除失败: ' + err.message, 'error');
      }
    }

    // Versions Drawer
    async function toggleVersionsDrawer(appId) {
      const safeId = appId.replace(/\\./g, '_');
      const box = document.getElementById('versions-box-' + safeId);
      const content = document.getElementById('versions-content-' + safeId);

      if (!box.classList.contains('hidden')) {
        box.classList.add('hidden');
        return;
      }

      box.classList.remove('hidden');
      content.innerHTML = '正在加载版本记录...';

      try {
        const res = await apiRequest('/api/admin/apps/' + encodeURIComponent(appId) + '/versions');
        const data = await res.json();
        if (data.code === 0) {
          const versions = data.data || [];
          window.__appVersions = window.__appVersions || {};
          window.__appVersions[appId] = versions;

          if (!versions.length) {
            content.innerHTML = '<div style="color: var(--text-dim); font-size: 0.85rem;">该应用暂无发布任何版本</div>';
            return;
          }

          content.innerHTML = versions.map(v => {
            const defaultDlUrl = \`\${window.location.origin}/api/v1/app/download?app_id=\${encodeURIComponent(v.app_id)}&version_code=\${v.version_code}\`;
            const isCleaned = v.is_cleaned === 1;
            const isExternal = !!v.external_url;
            const useProxy = v.use_proxy === 1;
            const pkgs = v.packages || [];

            const pkgsHtml = pkgs.length > 0 ? \`
              <div style="margin-top: 0.85rem; background: rgba(15, 23, 42, 0.6); border: 1px solid var(--border); border-radius: 8px; padding: 0.75rem 0.85rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.35rem;">
                  <span style="font-size: 0.8rem; font-weight: 700; color: #cbd5e1;">📦 多平台 / 架构安装包分发清单 (\${pkgs.length} 个)</span>
                  <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;" onclick="openAddPackageModal('\${v.id}', '\${v.app_id}', '\${v.version_name}', \${v.version_code})">➕ 附加安装包</button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  \${pkgs.map(p => {
                    const pDownloadUrl = p.download_url || \`\${window.location.origin}/api/v1/app/download?app_id=\${encodeURIComponent(v.app_id)}&version_code=\${v.version_code}&package_id=\${p.id}\`;
                    const pCleaned = p.is_cleaned === 1;
                    const pExternal = !!p.external_url;
                    let pIcon = '🌐';
                    if (p.platform === 'windows') pIcon = '💻';
                    else if (p.platform === 'macos') pIcon = '🍎';
                    else if (p.platform === 'linux') pIcon = '🐧';
                    else if (p.platform === 'ios') pIcon = '📱';
                    else if (p.platform === 'android') pIcon = '🤖';

                    return \`
                      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(30, 41, 59, 0.45); border: 1px solid rgba(255, 255, 255, 0.05); padding: 0.45rem 0.65rem; border-radius: 6px; font-size: 0.8rem; flex-wrap: wrap; gap: 0.4rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                          <span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc; font-weight: 700;">\${pIcon} \${p.platform} · \${p.arch}</span>
                          <span class="mono" style="color: #f1f5f9; font-size: 0.8rem;">\${p.file_name}</span>
                          <span style="color: var(--text-muted); font-size: 0.75rem;">\${p.file_size ? formatBytes(p.file_size) : ''}</span>
                          \${pCleaned ? '<span class="badge badge-warning" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24; font-size: 0.7rem;">安装包已清理</span>' : ''}
                          \${pExternal ? \`<span class="badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-size: 0.7rem;">🌐 \${p.use_proxy ? '反代外链' : '302外链'}</span>\` : '<span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.7rem;">R2存储</span>'}
                          <span style="color: var(--text-muted); font-size: 0.75rem;">下载: \${p.download_count || 0} 次</span>
                        </div>
                        <div style="display: flex; gap: 0.35rem; align-items: center; flex-wrap: wrap;">
                          \${pCleaned ? '' : \`<button class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.2rem 0.45rem;" onclick="copyText('\${pDownloadUrl}', '\${p.platform} (\${p.arch}) 下载链接已复制')">复制直链</button>\`}
                          \${pCleaned ? '' : \`<a href="\${pDownloadUrl}" target="_blank" class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.2rem 0.45rem; text-decoration: none;">直接下载</a>\`}
                          \${p.id && !p.id.startsWith('pkg_def_') ? \`
                            <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem; padding: 0.2rem 0.45rem;" onclick="openEditPackageModal('\${p.id}', '\${v.app_id}')">编辑包</button>
                            <button class="btn btn-danger btn-sm" style="font-size: 0.75rem; padding: 0.2rem 0.45rem;" onclick="deletePackage('\${p.id}', '\${v.app_id}')">删除包</button>
                          \` : ''}
                        </div>
                      </div>
                    \`;
                  }).join('')}
                </div>
              </div>
            \` : \`
              <div style="margin-top: 0.6rem;">
                <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem;" onclick="openAddPackageModal('\${v.id}', '\${v.app_id}', '\${v.version_name}', \${v.version_code})">➕ 添加不同平台/架构安装包</button>
              </div>
            \`;

            return \`
              <div class="version-item" style="\${isCleaned ? 'opacity: 0.9; border-left: 3px solid #f59e0b;' : ''}">
                <div class="ver-left" style="width: 100%;">
                  <div class="ver-header">
                    <span class="ver-title">v\${v.version_name}</span>
                    <span class="ver-code">(Code: \${v.version_code})</span>
                    <span class="badge badge-accent">\${v.channel}</span>
                    \${v.platform ? \`<span class="badge" style="background: rgba(99, 102, 241, 0.2); color: #a5b4fc;">\${v.platform} · \${v.arch || 'universal'}</span>\` : ''}
                    \${v.is_force_update ? '<span class="badge badge-warning">强制更新</span>' : ''}
                    \${v.is_published ? '<span class="badge badge-success">已发布</span>' : '<span class="badge">已下架</span>'}
                    \${isCleaned ? '<span class="badge badge-warning" style="background: rgba(245, 158, 11, 0.2); color: #fbbf24;">📦 安装包已清理</span>' : ''}
                    \${isExternal ? \`<span class="badge" style="background: rgba(56, 189, 248, 0.15); color: #38bdf8;">🌐 \${useProxy ? '反代外链' : '302外链'}</span>\` : ''}
                  </div>
                  \${v.changelog ? \`<div class="ver-log">\${v.changelog}</div>\` : ''}
                  <div class="ver-meta">
                    <span>主文件: \${v.file_name || 'app.apk'} \${v.file_size ? \`(\${formatBytes(v.file_size)})\` : ''}</span>
                    <span>总下载: \${v.download_count} 次</span>
                    <span>发布于: \${v.created_at ? v.created_at.substring(0, 19).replace('T', ' ') : ''}</span>
                    \${v.file_md5 ? \`<span>MD5: \${v.file_md5}</span>\` : ''}
                    \${isExternal ? \`<span style="max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">外链: <a href="\${v.external_url}" target="_blank" style="color: #38bdf8;">\${v.external_url}</a></span>\` : ''}
                  </div>
                  \${isCleaned ? '<div style="font-size: 0.75rem; color: #fbbf24; margin-top: 4px;">⚠️ 该版本历史 APK 已被存储自动清理策略物理清理，历史发布记录完整保留。</div>' : ''}
                  \${pkgsHtml}
                </div>

                <div style="display: flex; gap: 0.5rem; align-items: flex-start; flex-wrap: wrap; margin-top: 0.5rem;">
                  <button class="btn btn-secondary btn-sm" onclick="openAddPackageModal('\${v.id}', '\${v.app_id}', '\${v.version_name}', \${v.version_code})">➕ 添加安装包</button>
                  <button class="btn btn-secondary btn-sm" onclick="openEditVersionModal('\${v.id}', '\${v.app_id}')">编辑版本</button>
                  \${isCleaned 
                    ? '<button class="btn btn-secondary btn-sm" disabled style="opacity: 0.5; cursor: not-allowed;" title="安装包已被自动策略清理">安装包已清理</button>'
                    : \`<button class="btn btn-secondary btn-sm" onclick="copyText('\${defaultDlUrl}', '指定版本默认下载链接已复制')">复制默认下载链接</button>\`
                  }
                  <button class="btn btn-danger btn-sm" onclick="deleteVersion('\${v.id}', '\${v.app_id}')">删除记录</button>
                </div>
              </div>
            \`;
          }).join('');
        }
      } catch (err) {
        content.innerHTML = '<div style="color: var(--danger);">加载失败</div>';
      }
    }

    function openEditVersionModal(versionId, appId) {
      const versions = (window.__appVersions && window.__appVersions[appId]) || [];
      const v = versions.find(item => item.id === versionId);
      if (!v) {
        showToast('未找到该版本记录', 'error');
        return;
      }

      document.getElementById('edit-ver-modal-title').innerText = \`编辑版本 - v\${v.version_name} (Code: \${v.version_code})\`;
      document.getElementById('edit-ver-id').value = v.id;
      document.getElementById('edit-ver-appid').value = v.app_id;
      document.getElementById('edit-ver-name').value = v.version_name || '';
      document.getElementById('edit-ver-code').value = v.version_code || 0;
      document.getElementById('edit-ver-channel').value = v.channel || 'default';
      document.getElementById('edit-ver-mincode').value = v.min_version_code || 0;
      document.getElementById('edit-ver-filename').value = v.file_name || '';
      document.getElementById('edit-ver-exturl').value = v.external_url || '';
      document.getElementById('edit-ver-useproxy').checked = v.use_proxy === 1;
      document.getElementById('edit-ver-log').value = v.changelog || '';
      document.getElementById('edit-ver-force').checked = v.is_force_update === 1;
      document.getElementById('edit-ver-published').checked = v.is_published === 1;

      openModal('modal-edit-version');
    }

    async function handleUpdateVersion(e) {
      e.preventDefault();
      const versionId = document.getElementById('edit-ver-id').value;
      const appId = document.getElementById('edit-ver-appid').value;
      const extUrl = document.getElementById('edit-ver-exturl').value.trim();

      if (extUrl && (extUrl.startsWith(window.location.origin) || extUrl.includes('/api/v1/app/download'))) {
        showToast('第三方直链不能填写当前网关自身的 /api/v1/app/download 地址，否则会造成死循环！', 'error');
        return;
      }

      const payload = {
        version_name: document.getElementById('edit-ver-name').value.trim(),
        channel: document.getElementById('edit-ver-channel').value.trim() || 'default',
        min_version_code: parseInt(document.getElementById('edit-ver-mincode').value, 10) || 0,
        file_name: document.getElementById('edit-ver-filename').value.trim(),
        external_url: extUrl,
        use_proxy: document.getElementById('edit-ver-useproxy').checked ? 1 : 0,
        changelog: document.getElementById('edit-ver-log').value.trim(),
        is_force_update: document.getElementById('edit-ver-force').checked ? 1 : 0,
        is_published: document.getElementById('edit-ver-published').checked ? 1 : 0
      };

      const btn = document.getElementById('btn-edit-ver-submit');
      btn.disabled = true;
      btn.innerText = '正在保存...';

      try {
        const res = await apiRequest('/api/admin/versions/' + encodeURIComponent(versionId), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.code === 0) {
          showToast('版本信息更新成功！');
          closeModal('modal-edit-version');
          // 重新刷新版本抽屉和应用列表
          const safeId = appId.replace(/\\./g, '_');
          const box = document.getElementById('versions-box-' + safeId);
          if (box) box.classList.add('hidden');
          await toggleVersionsDrawer(appId);
          loadApps();
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('更新失败: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerText = '保存修改';
      }
    }

    async function deleteVersion(versionId, appId) {
      if (!confirm('确定要删除该版本及对应的 APK 存储文件吗？')) return;
      try {
        const res = await apiRequest('/api/admin/versions/' + versionId, { method: 'DELETE' });
        const data = await res.json();
        if (data.code === 0) {
          showToast('版本已删除');
          loadApps();
          loadStats();
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('删除失败: ' + err.message, 'error');
      }
    }

    // Package Management Functions
    let currentAddPkgMode = 'external';
    let pendingAddPkgUploadResult = null;

    function switchAddPkgMode(mode) {
      currentAddPkgMode = mode;
      const btnUpload = document.getElementById('add-pkg-mode-upload');
      const btnExt = document.getElementById('add-pkg-mode-external');
      const secUpload = document.getElementById('add-pkg-sec-upload');
      const secExt = document.getElementById('add-pkg-sec-external');

      if (btnUpload && btnExt && secUpload && secExt) {
        if (mode === 'upload') {
          btnUpload.className = 'btn btn-primary btn-sm';
          btnExt.className = 'btn btn-secondary btn-sm';
          secUpload.classList.remove('hidden');
          secExt.classList.add('hidden');
        } else {
          btnUpload.className = 'btn btn-secondary btn-sm';
          btnExt.className = 'btn btn-primary btn-sm';
          secUpload.classList.add('hidden');
          secExt.classList.remove('hidden');
        }
      }
      checkAddPkgSubmitReady();
    }

    function checkAddPkgSubmitReady() {
      const btn = document.getElementById('btn-add-pkg-submit');
      if (!btn) return;
      if (currentAddPkgMode === 'external') {
        const extUrl = document.getElementById('add-pkg-exturl')?.value.trim();
        btn.disabled = !extUrl;
      } else {
        btn.disabled = !pendingAddPkgUploadResult;
      }
    }

    async function onAddPkgFileSelected(input) {
      const file = input.files[0];
      if (!file) return;
      document.getElementById('drop-add-pkg-text').innerText = \`已选择: \${file.name} (\${formatBytes(file.size)})\`;
      if (!document.getElementById('add-pkg-filename').value) {
        document.getElementById('add-pkg-filename').value = file.name;
      }
      await uploadFileToR2(file, 'general', 'add-pkg-progress-wrap', 'add-pkg-progress-bar', 'add-pkg-upload-status', 'btn-add-pkg-submit');
      pendingAddPkgUploadResult = pendingUploadResult;
      checkAddPkgSubmitReady();
    }

    function openAddPackageModal(versionId, appId, versionName, versionCode) {
      pendingAddPkgUploadResult = null;
      document.getElementById('add-pkg-modal-title').innerText = \`添加分发安装包 - v\${versionName} (Code: \${versionCode})\`;
      document.getElementById('add-pkg-verid').value = versionId;
      document.getElementById('add-pkg-appid').value = appId;
      document.getElementById('add-pkg-platform').value = 'windows';
      document.getElementById('add-pkg-arch').value = 'x86_64';
      document.getElementById('add-pkg-exturl').value = '';
      document.getElementById('add-pkg-useproxy').checked = false;
      document.getElementById('add-pkg-filename').value = '';
      document.getElementById('add-pkg-filesize').value = '';
      document.getElementById('drop-add-pkg-text').innerText = '点击或将安装包拖拽至此区域';
      document.getElementById('add-pkg-progress-wrap').style.display = 'none';
      document.getElementById('add-pkg-upload-status').innerText = '';
      document.getElementById('file-add-pkg-input').value = '';
      switchAddPkgMode('external');
      openModal('modal-add-package');
    }

    async function handleAddPackage(e) {
      e.preventDefault();
      const versionId = document.getElementById('add-pkg-verid').value;
      const appId = document.getElementById('add-pkg-appid').value;
      const platform = document.getElementById('add-pkg-platform').value;
      const arch = document.getElementById('add-pkg-arch').value;
      const isExternalMode = currentAddPkgMode === 'external';
      const extUrl = document.getElementById('add-pkg-exturl')?.value.trim();
      const useProxy = document.getElementById('add-pkg-useproxy')?.checked ? 1 : 0;
      const fileName = document.getElementById('add-pkg-filename')?.value.trim();
      const fileSize = parseInt(document.getElementById('add-pkg-filesize')?.value, 10) || 0;

      if (isExternalMode) {
        if (!extUrl) {
          showToast('请填写第三方下载直链', 'error');
          return;
        }
        if (extUrl.startsWith(window.location.origin) || extUrl.includes('/api/v1/app/download')) {
          showToast('第三方直链不能填写当前网关自身的 /api/v1/app/download 地址！', 'error');
          return;
        }
      } else {
        if (!pendingAddPkgUploadResult) {
          showToast('请先选择并上传安装包文件', 'error');
          return;
        }
      }

      const payload = {
        platform,
        arch,
        file_key: isExternalMode ? '' : pendingAddPkgUploadResult.file_key,
        file_name: fileName || (isExternalMode ? \`app-\${platform}-\${arch}\` : pendingAddPkgUploadResult.file_name),
        file_size: isExternalMode ? fileSize : pendingAddPkgUploadResult.file_size,
        file_md5: isExternalMode ? undefined : pendingAddPkgUploadResult.file_md5,
        external_url: isExternalMode ? extUrl : undefined,
        use_proxy: isExternalMode ? useProxy : 0
      };

      const btn = document.getElementById('btn-add-pkg-submit');
      btn.disabled = true;
      btn.innerText = '正在添加...';

      try {
        const res = await apiRequest(\`/api/admin/versions/\${encodeURIComponent(versionId)}/packages\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.code === 0) {
          showToast('安装包添加成功！');
          closeModal('modal-add-package');
          const safeId = appId.replace(/\\./g, '_');
          const box = document.getElementById('versions-box-' + safeId);
          if (box) box.classList.add('hidden');
          await toggleVersionsDrawer(appId);
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('添加安装包失败: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerText = '确认添加安装包';
      }
    }

    function openEditPackageModal(packageId, appId) {
      const versions = (window.__appVersions && window.__appVersions[appId]) || [];
      let foundPkg = null;
      for (const v of versions) {
        if (v.packages) {
          const p = v.packages.find(item => item.id === packageId);
          if (p) {
            foundPkg = p;
            break;
          }
        }
      }
      if (!foundPkg) {
        showToast('未找到该安装包记录', 'error');
        return;
      }

      document.getElementById('edit-pkg-modal-title').innerText = \`编辑分发包 - \${foundPkg.platform} · \${foundPkg.arch}\`;
      document.getElementById('edit-pkg-id').value = foundPkg.id;
      document.getElementById('edit-pkg-appid').value = appId;
      document.getElementById('edit-pkg-platform').value = foundPkg.platform || 'universal';
      document.getElementById('edit-pkg-arch').value = foundPkg.arch || 'universal';
      document.getElementById('edit-pkg-filename').value = foundPkg.file_name || '';
      document.getElementById('edit-pkg-filesize').value = foundPkg.file_size || 0;
      document.getElementById('edit-pkg-exturl').value = foundPkg.external_url || '';
      document.getElementById('edit-pkg-useproxy').checked = foundPkg.use_proxy === 1;

      openModal('modal-edit-package');
    }

    async function handleUpdatePackage(e) {
      e.preventDefault();
      const packageId = document.getElementById('edit-pkg-id').value;
      const appId = document.getElementById('edit-pkg-appid').value;
      const extUrl = document.getElementById('edit-pkg-exturl').value.trim();

      if (extUrl && (extUrl.startsWith(window.location.origin) || extUrl.includes('/api/v1/app/download'))) {
        showToast('第三方直链不能填写当前网关自身的 /api/v1/app/download 地址！', 'error');
        return;
      }

      const payload = {
        platform: document.getElementById('edit-pkg-platform').value,
        arch: document.getElementById('edit-pkg-arch').value,
        file_name: document.getElementById('edit-pkg-filename').value.trim(),
        file_size: parseInt(document.getElementById('edit-pkg-filesize').value, 10) || 0,
        external_url: extUrl || undefined,
        use_proxy: document.getElementById('edit-pkg-useproxy').checked ? 1 : 0
      };

      const btn = document.getElementById('btn-edit-pkg-submit');
      btn.disabled = true;
      btn.innerText = '正在保存...';

      try {
        const res = await apiRequest(\`/api/admin/packages/\${encodeURIComponent(packageId)}\`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.code === 0) {
          showToast('安装包更新成功！');
          closeModal('modal-edit-package');
          const safeId = appId.replace(/\\./g, '_');
          const box = document.getElementById('versions-box-' + safeId);
          if (box) box.classList.add('hidden');
          await toggleVersionsDrawer(appId);
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('更新失败: ' + err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerText = '保存修改';
      }
    }

    async function deletePackage(packageId, appId) {
      if (!confirm('确定要删除该分发安装包吗？若文件保存在 R2 存储中也将一并清理。')) return;
      try {
        const res = await apiRequest('/api/admin/packages/' + packageId, { method: 'DELETE' });
        const data = await res.json();
        if (data.code === 0) {
          showToast('安装包已删除');
          const safeId = appId.replace(/\\./g, '_');
          const box = document.getElementById('versions-box-' + safeId);
          if (box) box.classList.add('hidden');
          await toggleVersionsDrawer(appId);
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('删除失败: ' + err.message, 'error');
      }
    }

    // Release Version Modal & Upload
    let currentPkgMode = 'upload';
    function switchPackageMode(mode) {
      currentPkgMode = mode;
      const btnUpload = document.getElementById('pkg-mode-upload');
      const btnExt = document.getElementById('pkg-mode-external');
      const secUpload = document.getElementById('pkg-sec-upload');
      const secExt = document.getElementById('pkg-sec-external');

      if (btnUpload && btnExt && secUpload && secExt) {
        if (mode === 'upload') {
          btnUpload.className = 'btn btn-primary btn-sm';
          btnExt.className = 'btn btn-secondary btn-sm';
          secUpload.classList.remove('hidden');
          secExt.classList.add('hidden');
        } else {
          btnUpload.className = 'btn btn-secondary btn-sm';
          btnExt.className = 'btn btn-primary btn-sm';
          secUpload.classList.add('hidden');
          secExt.classList.remove('hidden');
        }
      }
      checkReleaseSubmitReady();
    }

    function checkReleaseSubmitReady() {
      const submitBtn = document.getElementById('btn-release-submit');
      if (!submitBtn) return;
      if (currentPkgMode === 'external') {
        const url = document.getElementById('ver-form-exturl')?.value.trim();
        submitBtn.disabled = !url;
        submitBtn.innerText = '发布新版本 (第三方直链)';
      } else {
        submitBtn.disabled = !pendingUploadResult;
        submitBtn.innerText = '上传并发布新版本';
      }
    }

    function openReleaseModal(appId, appName) {
      pendingUploadResult = null;
      document.getElementById('ver-modal-title').innerText = \`发布新版本 - \${appName}\`;
      document.getElementById('ver-form-appid').value = appId;
      if (document.getElementById('ver-form-platform')) document.getElementById('ver-form-platform').value = 'android';
      if (document.getElementById('ver-form-arch')) document.getElementById('ver-form-arch').value = 'universal';
      document.getElementById('ver-form-name').value = '';
      document.getElementById('ver-form-code').value = '';
      document.getElementById('ver-form-mincode').value = '0';
      document.getElementById('ver-form-channel').value = 'default';
      document.getElementById('ver-form-log').value = '';
      document.getElementById('ver-form-force').checked = false;
      document.getElementById('ver-form-exturl').value = '';
      document.getElementById('ver-form-useproxy').checked = false;
      document.getElementById('ver-form-extfilename').value = '';
      document.getElementById('ver-form-extsize').value = '';
      document.getElementById('drop-apk-text').innerText = '点击或将 APK 文件拖拽至此区域';
      document.getElementById('apk-progress-wrap').style.display = 'none';
      document.getElementById('apk-upload-status').innerText = '';
      document.getElementById('file-apk-input').value = '';
      switchPackageMode('upload');
      openModal('modal-release-version');
    }

    // File selection & Direct/Multipart upload handler
    async function onFileSelected(input, type) {
      const file = input.files[0];
      if (!file) return;

      if (type === 'apk') {
        document.getElementById('drop-apk-text').innerText = \`已选择: \${file.name} (\${formatBytes(file.size)})\`;
        await uploadFileToR2(file, 'apk', 'apk-progress-wrap', 'apk-progress-bar', 'apk-upload-status', 'btn-release-submit');
      } else {
        document.getElementById('drop-gen-text').innerText = \`已选择: \${file.name} (\${formatBytes(file.size)})\`;
        document.getElementById('gen-form-name').value = file.name;
        await uploadFileToR2(file, 'general', 'gen-progress-wrap', 'gen-progress-bar', null, 'btn-gen-submit');
      }
    }

    async function uploadFileToR2(file, category, progressWrapId, progressBarId, statusTextId, submitBtnId) {
      const wrap = document.getElementById(progressWrapId);
      const bar = document.getElementById(progressBarId);
      const submitBtn = document.getElementById(submitBtnId);
      wrap.style.display = 'block';
      bar.style.width = '0%';
      if (statusTextId) document.getElementById(statusTextId).innerText = '准备上传中...';

      try {
        // 大文件分片上传 (大于 80MB) 或标准直接直传
        if (file.size > 80 * 1024 * 1024) {
          if (statusTextId) document.getElementById(statusTextId).innerText = '大文件分片初始化中...';
          const initRes = await apiRequest('/api/admin/upload/multipart/init', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: file.name, category, mimeType: file.type })
          });
          const initData = await initRes.json();
          if (initData.code !== 0) throw new Error(initData.message);

          const { upload_id, file_key } = initData.data;
          const chunkSize = 10 * 1024 * 1024; // 10MB per part
          const totalParts = Math.ceil(file.size / chunkSize);
          const parts = [];

          for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
            const start = (partNumber - 1) * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);

            if (statusTextId) {
              document.getElementById(statusTextId).innerText = \`正在上传分片 \${partNumber}/\${totalParts} (\${Math.round((start / file.size) * 100)}%)...\`;
            }

            const partRes = await apiRequest(\`/api/admin/upload/multipart/part?uploadId=\${upload_id}&fileKey=\${encodeURIComponent(file_key)}&partNumber=\${partNumber}\`, {
              method: 'PUT',
              body: chunk
            });
            const partData = await partRes.json();
            if (partData.code !== 0) throw new Error(partData.message);

            parts.push({ partNumber, etag: partData.data.etag });
            bar.style.width = Math.round((end / file.size) * 100) + '%';
          }

          if (statusTextId) document.getElementById(statusTextId).innerText = '分片完成，正在合并文件...';
          const compRes = await apiRequest('/api/admin/upload/multipart/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              upload_id,
              file_key,
              parts,
              file_name: file.name,
              file_size: file.size
            })
          });
          const compData = await compRes.json();
          if (compData.code !== 0) throw new Error(compData.message);

          pendingUploadResult = compData.data;
        } else {
          // 常规文件单次直传
          if (statusTextId) document.getElementById(statusTextId).innerText = '正在流式上传到 Cloudflare R2...';
          const formData = new FormData();
          formData.append('file', file);
          formData.append('category', category);

          bar.style.width = '50%';
          const res = await apiRequest('/api/admin/upload/direct', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.code !== 0) throw new Error(data.message);

          bar.style.width = '100%';
          pendingUploadResult = data.data;
        }

        if (statusTextId) document.getElementById(statusTextId).innerText = '✅ 上传成功并已就绪';
        showToast('文件已上传至 R2');
        checkReleaseSubmitReady();
      } catch (err) {
        if (statusTextId) document.getElementById(statusTextId).innerText = '❌ 上传失败: ' + err.message;
        showToast('上传失败: ' + err.message, 'error');
      }
    }

    async function handleReleaseVersion(e) {
      e.preventDefault();
      const isExternalMode = currentPkgMode === 'external';
      const extUrl = document.getElementById('ver-form-exturl')?.value.trim();
      const useProxy = document.getElementById('ver-form-useproxy')?.checked ? 1 : 0;
      const extFileName = document.getElementById('ver-form-extfilename')?.value.trim();
      const extSize = parseInt(document.getElementById('ver-form-extsize')?.value, 10) || 0;

      if (isExternalMode) {
        if (!extUrl) {
          showToast('请填写第三方下载直链', 'error');
          return;
        }
        if (extUrl.startsWith(window.location.origin) || extUrl.includes('/api/v1/app/download')) {
          showToast('第三方直链不能填写当前网关自身的 /api/v1/app/download 地址，否则会造成死循环！', 'error');
          return;
        }
      } else {
        if (!pendingUploadResult) {
          showToast('请先选择并上传 APK 文件', 'error');
          return;
        }
      }

      const appId = document.getElementById('ver-form-appid').value;
      const versionName = document.getElementById('ver-form-name').value.trim();
      const versionCode = parseInt(document.getElementById('ver-form-code').value, 10);
      const minVersionCode = parseInt(document.getElementById('ver-form-mincode').value, 10) || 0;
      const channel = document.getElementById('ver-form-channel').value.trim() || 'default';
      const changelog = document.getElementById('ver-form-log').value.trim();
      const isForce = document.getElementById('ver-form-force').checked ? 1 : 0;
      const platform = document.getElementById('ver-form-platform')?.value || 'android';
      const arch = document.getElementById('ver-form-arch')?.value || 'universal';

      const payload = {
        version_name: versionName,
        version_code: versionCode,
        min_version_code: minVersionCode,
        channel,
        changelog,
        is_force_update: isForce,
        is_published: 1,
        platform,
        arch,
        external_url: isExternalMode ? extUrl : undefined,
        use_proxy: isExternalMode ? useProxy : 0,
        file_key: isExternalMode ? '' : pendingUploadResult.file_key,
        file_name: isExternalMode ? (extFileName || (\`app-v\${versionName}-\${platform}-\${arch}\` + (platform === 'windows' ? '.zip' : '.apk'))) : pendingUploadResult.file_name,
        file_size: isExternalMode ? extSize : pendingUploadResult.file_size,
        file_md5: isExternalMode ? null : pendingUploadResult.file_md5
      };

      try {
        const res = await apiRequest('/api/admin/apps/' + encodeURIComponent(appId) + '/versions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.code === 0) {
          showToast('版本发布成功！');
          closeModal('modal-release-version');
          loadApps();
          loadStats();
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('发布失败: ' + err.message, 'error');
      }
    }

    // Generic Files Management
    async function loadFiles() {
      try {
        const res = await apiRequest('/api/admin/files');
        const data = await res.json();
        if (data.code === 0) {
          filesData = data.data?.files || [];
          renderFiles();
        }
      } catch (e) {}
    }

    function renderFiles() {
      const tbody = document.getElementById('files-table-body');
      if (!filesData.length) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-dim); padding: 2rem;">暂无通用文件记录</td></tr>';
        return;
      }

      const origin = window.location.origin;

      tbody.innerHTML = filesData.map(f => {
        const directUrl = \`\${origin}/api/v1/files/\${f.id}/download\`;
        const aliasUrl = f.alias ? \`\${origin}/f/\${f.alias}\` : null;

        return \`
          <tr>
            <td>
              <div style="font-weight: 600;">\${f.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);">\${f.file_name}</div>
            </td>
            <td><span class="badge">\${f.category || 'general'}</span></td>
            <td class="mono" style="font-size: 0.8rem;">\${formatBytes(f.file_size)}</td>
            <td>
              \${aliasUrl ? \`<a href="\${aliasUrl}" target="_blank" class="mono" style="color: var(--accent); text-decoration: none;">/f/\${f.alias}</a>\` : '<span style="color: var(--text-dim);">-</span>'}
            </td>
            <td>\${f.download_count}</td>
            <td style="font-size: 0.8rem; color: var(--text-dim);">\${(f.created_at || '').substring(0, 10)}</td>
            <td style="text-align: right;">
              <button class="btn btn-secondary btn-sm" onclick="copyText('\${aliasUrl || directUrl}', '下载链接已复制')">复制链接</button>
              <button class="btn btn-danger btn-sm" onclick="deleteFile('\${f.id}')">删除</button>
            </td>
          </tr>
        \`;
      }).join('');
    }

    function openUploadFileModal() {
      pendingUploadResult = null;
      document.getElementById('drop-gen-text').innerText = '点击或将文件拖拽至此';
      document.getElementById('gen-progress-wrap').style.display = 'none';
      document.getElementById('gen-form-name').value = '';
      document.getElementById('gen-form-cat').value = 'general';
      document.getElementById('gen-form-alias').value = '';
      document.getElementById('btn-gen-submit').disabled = true;
      document.getElementById('file-generic-input').value = '';
      openModal('modal-upload-file');
    }

    async function handleUploadGenericFile(e) {
      e.preventDefault();
      if (!pendingUploadResult) {
        showToast('请先选择文件', 'error');
        return;
      }

      const name = document.getElementById('gen-form-name').value.trim();
      const category = document.getElementById('gen-form-cat').value.trim() || 'general';
      const alias = document.getElementById('gen-form-alias').value.trim() || undefined;

      try {
        const res = await apiRequest('/api/admin/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            category,
            alias,
            file_key: pendingUploadResult.file_key,
            file_name: pendingUploadResult.file_name,
            file_size: pendingUploadResult.file_size,
            mime_type: pendingUploadResult.mime_type,
            file_md5: pendingUploadResult.file_md5
          })
        });
        const data = await res.json();
        if (data.code === 0) {
          showToast('通用文件已保存');
          closeModal('modal-upload-file');
          loadFiles();
          loadStats();
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('保存失败: ' + err.message, 'error');
      }
    }

    async function deleteFile(id) {
      if (!confirm('确定要删除此文件吗？')) return;
      try {
        const res = await apiRequest('/api/admin/files/' + id, { method: 'DELETE' });
        const data = await res.json();
        if (data.code === 0) {
          showToast('文件已删除');
          loadFiles();
          loadStats();
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('删除失败: ' + err.message, 'error');
      }
    }

    // Settings Management
    async function loadSettings() {
      try {
        const res = await apiRequest('/api/admin/settings');
        const data = await res.json();
        if (data.code === 0 && data.data) {
          settingsData = data.data;
          document.getElementById('cfg-token-enabled').checked = settingsData['api_token_enabled'] === 'true';
          document.getElementById('cfg-fixed-token').value = settingsData['api_fixed_token'] || '';
          document.getElementById('cfg-app-check-token').checked = settingsData['app_check_require_token'] === 'true';
          document.getElementById('cfg-app-download-token').checked = settingsData['app_download_require_token'] === 'true';
          document.getElementById('cfg-file-download-token').checked = settingsData['file_download_require_token'] === 'true';
          document.getElementById('cfg-auto-cleanup-enabled').checked = settingsData['auto_cleanup_enabled'] === 'true';
          document.getElementById('cfg-auto-cleanup-days').value = settingsData['auto_cleanup_days'] || '90';
          document.getElementById('cfg-auto-cleanup-keep').value = settingsData['auto_cleanup_keep_latest'] || '3';
          document.getElementById('cfg-github-token').value = settingsData['github_token'] || '';
        }
      } catch (e) {}
    }

    async function generateRandomToken() {
      try {
        const res = await apiRequest('/api/admin/settings/generate-token', { method: 'POST' });
        const data = await res.json();
        if (data.code === 0 && data.data?.token) {
          document.getElementById('cfg-fixed-token').value = data.data.token;
          showToast('已生成新 Token，请点击右上角保存');
        }
      } catch (e) {}
    }

    async function saveSettings() {
      const payload = {
        api_token_enabled: document.getElementById('cfg-token-enabled').checked ? 'true' : 'false',
        api_fixed_token: document.getElementById('cfg-fixed-token').value.trim(),
        app_check_require_token: document.getElementById('cfg-app-check-token').checked ? 'true' : 'false',
        app_download_require_token: document.getElementById('cfg-app-download-token').checked ? 'true' : 'false',
        file_download_require_token: document.getElementById('cfg-file-download-token').checked ? 'true' : 'false',
        auto_cleanup_enabled: document.getElementById('cfg-auto-cleanup-enabled').checked ? 'true' : 'false',
        auto_cleanup_days: document.getElementById('cfg-auto-cleanup-days').value.trim() || '90',
        auto_cleanup_keep_latest: document.getElementById('cfg-auto-cleanup-keep').value.trim() || '3',
        github_token: document.getElementById('cfg-github-token').value.trim()
      };

      try {
        const res = await apiRequest('/api/admin/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.code === 0) {
          showToast('系统设置保存成功！');
          settingsData = data.data;
        } else {
          showToast(data.message, 'error');
        }
      } catch (err) {
        showToast('保存失败: ' + err.message, 'error');
      }
    }

    async function runManualCleanup() {
      const resultEl = document.getElementById('cleanup-result');
      resultEl.textContent = '⏳ 正在执行清理...';
      resultEl.style.color = 'var(--text-muted)';
      try {
        const res = await apiRequest('/api/admin/cleanup', { method: 'POST' });
        const data = await res.json();
        if (data.code === 0) {
          const r = data.data;
          if (!r.enabled) {
            resultEl.textContent = '⚠️ 自动清理未启用，请先开启开关并保存设置后再执行';
            resultEl.style.color = '#fbbf24';
          } else if (r.deleted === 0) {
            resultEl.textContent = '✅ 扫描完成，没有发现需要清理的过期版本';
            resultEl.style.color = '#6ee7b7';
          } else {
            const freedMB = (r.freedBytes / 1024 / 1024).toFixed(2);
            resultEl.textContent = '✅ 清理完成！已删除 ' + r.deleted + ' 个旧版本，释放 ' + freedMB + ' MB 存储空间';
            resultEl.style.color = '#6ee7b7';
            loadApps();
            loadStats();
          }
          showToast(resultEl.textContent);
        } else {
          resultEl.textContent = '❌ ' + data.message;
          resultEl.style.color = '#fca5a5';
          showToast(data.message, 'error');
        }
      } catch (err) {
        resultEl.textContent = '❌ 清理失败: ' + err.message;
        resultEl.style.color = '#fca5a5';
        showToast('清理失败', 'error');
      }
    }

    // Playground
    function setupPlayground() {
      const select = document.getElementById('pg-app-select');
      select.innerHTML = appsData.map(a => \`<option value="\${a.app_id}">\${a.name} (\${a.app_id})</option>\`).join('');
      if (!appsData.length) {
        select.innerHTML = '<option value="">暂无应用，请先创建</option>';
      }
      onPlaygroundAppChange();
    }

    function onPlaygroundAppChange() {
      updatePlaygroundCurl();
    }

    function updatePlaygroundCurl() {
      const appId = document.getElementById('pg-app-select').value;
      const curVersion = document.getElementById('pg-cur-version').value;
      const channel = document.getElementById('pg-channel').value;
      const platform = document.getElementById('pg-platform')?.value;
      const arch = document.getElementById('pg-arch')?.value;
      const token = document.getElementById('pg-token').value.trim();

      const origin = window.location.origin;
      let url = \`\${origin}/api/v1/app/latest?app_id=\${encodeURIComponent(appId)}&version_code=\${curVersion}&channel=\${encodeURIComponent(channel)}\`;
      if (platform) url += \`&platform=\${encodeURIComponent(platform)}\`;
      if (arch) url += \`&arch=\${encodeURIComponent(arch)}\`;
      
      let dlUrl = \`\${origin}/api/v1/app/download?app_id=\${encodeURIComponent(appId)}\`;
      if (channel && channel !== 'default') dlUrl += \`&channel=\${encodeURIComponent(channel)}\`;
      if (platform) dlUrl += \`&platform=\${encodeURIComponent(platform)}\`;
      if (arch) dlUrl += \`&arch=\${encodeURIComponent(arch)}\`;

      let cmd = \`# 1. 客户端版本检测请求\\ncurl -s "\${url}"\`;
      if (token) {
        cmd = \`# 1. 客户端版本检测请求\\ncurl -s -H "X-Ygg-Token: \${token}" "\${url}"\`;
      }
      cmd += \`\\n\\n# 2. 最新安装包直接下载 (支持多平台/架构匹配)\\ncurl -L -O "\${dlUrl}"\`;
      if (token) {
        cmd += \` -H "X-Ygg-Token: \${token}"\`;
      }
      cmd += \`\\n\\n# 3. 极简短链下载\\ncurl -L -O "\${origin}/d/\${encodeURIComponent(appId)}\${platform ? '?platform=' + encodeURIComponent(platform) : ''}"\`;

      document.getElementById('pg-curl').innerText = cmd;
    }

    async function runPlaygroundTest() {
      updatePlaygroundCurl();
      const appId = document.getElementById('pg-app-select').value;
      if (!appId) {
        showToast('请先选择一个应用', 'error');
        return;
      }

      const curVersion = document.getElementById('pg-cur-version').value;
      const channel = document.getElementById('pg-channel').value;
      const platform = document.getElementById('pg-platform')?.value;
      const arch = document.getElementById('pg-arch')?.value;
      const token = document.getElementById('pg-token').value.trim();

      let url = \`/api/v1/app/latest?app_id=\${encodeURIComponent(appId)}&version_code=\${curVersion}&channel=\${encodeURIComponent(channel)}\`;
      if (platform) url += \`&platform=\${encodeURIComponent(platform)}\`;
      if (arch) url += \`&arch=\${encodeURIComponent(arch)}\`;

      const headers = {};
      if (token) headers['X-Ygg-Token'] = token;

      document.getElementById('pg-response').innerText = '正在请求中...';

      try {
        const res = await fetch(url, { headers });
        const data = await res.json();
        document.getElementById('pg-response').innerText = JSON.stringify(data, null, 2);
      } catch (err) {
        document.getElementById('pg-response').innerText = '请求出错: ' + err.message;
      }
    }

    // MCP Hub Functionality
    let currentMcpClient = 'cursor';
    const MCP_TOOLS_LIST = [
      { name: 'ygg_list_apps', desc: '列出所有托管应用与各渠道最新版本及下载统计', params: 'search? (string)' },
      { name: 'ygg_get_app_details', desc: '查看指定包名应用的详细配置与完整历史发布版本', params: 'app_id* (string)' },
      { name: 'ygg_check_update', desc: '客户端更新检测模拟，支持平台与架构匹配，返回直链与全包列表', params: 'app_id* (string), current_version_code? (number), channel? (string), platform? (string), arch? (string)' },
      { name: 'ygg_create_app', desc: '注册创建新应用项目', params: 'app_id* (string), name* (string), icon_url? (string), description? (string)' },
      { name: 'ygg_update_app', desc: '更新应用展示名称、图标链接或简介', params: 'app_id* (string), name? (string), icon_url? (string), description? (string)' },
      { name: 'ygg_delete_app', desc: '彻底删除应用及名下所有历史版本和 R2 存储文件', params: 'app_id* (string)' },
      { name: 'ygg_publish_version', desc: '发布新版本（支持多平台/架构、GitHub/CDN 直链免上传与边缘反代加速）', params: 'app_id* (string), version_code* (number), version_name* (string), platform? (string), arch? (string), external_url? (string), use_proxy? (boolean)' },
      { name: 'ygg_update_version', desc: '修改已有版本属性（更新日志、外链、反代、上架状态）', params: 'version_id* (string), changelog? (string), external_url? (string), use_proxy? (boolean)' },
      { name: 'ygg_delete_version', desc: '物理删除指定版本记录及对应的 R2 存储文件', params: 'version_id* (string)' },
      { name: 'ygg_add_version_package', desc: '为指定版本新增不同平台或架构的分发安装包（如 Windows x64、Android ARM64）', params: 'version_id* (string), platform* (string), arch* (string), external_url? (string), use_proxy? (boolean)' },
      { name: 'ygg_delete_version_package', desc: '删除指定版本名下的某个分发安装包并物理删除 R2 存储', params: 'package_id* (string)' },
      { name: 'ygg_get_system_stats', desc: '获取全局运行概况（总应用数、总版本数、累计下载量、存储占用）', params: '无参数' },
      { name: 'ygg_trigger_cleanup', desc: '触发旧版本存储清理（释放 R2 空间并保留历史记录）', params: 'days? (number), keep_latest? (number), force? (boolean)' },
      { name: 'ygg_list_files', desc: '查询通用文件管理列表中的所有资源', params: 'category? (string)' }
    ];

    function renderMcpTab() {
      const origin = window.location.origin;
      const endpointEl = document.getElementById('mcp-endpoint-val');
      if (endpointEl) endpointEl.innerText = origin + '/api/mcp';
      selectMcpClient(currentMcpClient);
      renderMcpToolCards(MCP_TOOLS_LIST);
    }

    function renderMcpToolCards(tools) {
      const container = document.getElementById('mcp-tools-container');
      if (!container) return;
      container.innerHTML = tools.map(t => \`
        <div class="mcp-tool-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
            <div>
              <span class="badge" style="background: rgba(168, 85, 247, 0.15); color: #c084fc; font-weight: 700; font-size: 0.7rem;">Tool</span>
              <div class="mono" style="font-weight: 700; font-size: 0.925rem; color: #a7f3d0; margin-top: 0.25rem;">\${t.name}</div>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="copyText('\${t.name}', '工具名已复制')">复制名</button>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-main); line-height: 1.5;">\${t.desc}</div>
          <div style="font-size: 0.725rem; color: var(--text-muted); background: rgba(0,0,0,0.25); padding: 0.35rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
            <span style="color: #93c5fd; font-weight: 600;">参数:</span> <span class="mono">\${t.params}</span>
          </div>
        </div>
      \`).join('');
    }

    function filterMcpToolCards(keyword) {
      const kw = (keyword || '').trim().toLowerCase();
      if (!kw) {
        renderMcpToolCards(MCP_TOOLS_LIST);
        return;
      }
      const filtered = MCP_TOOLS_LIST.filter(t => t.name.toLowerCase().includes(kw) || t.desc.toLowerCase().includes(kw));
      renderMcpToolCards(filtered);
    }

    function selectMcpClient(client) {
      currentMcpClient = client;
      document.querySelectorAll('.mcp-client-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-client') === client);
      });

      const origin = window.location.origin;
      const token = (settingsData && settingsData['api_fixed_token']) || 'ygg_secret_token_default_2026';
      const codeEl = document.getElementById('mcp-config-code');
      const guideEl = document.getElementById('mcp-config-guide');
      if (!codeEl || !guideEl) return;

      if (client === 'cursor') {
        guideEl.innerHTML = '在 <b>Cursor</b> 设置中点击 <b>Settings -> Features -> MCP</b>，点击 <b>+ Add New MCP Server</b>，选择 <b>command</b> 类型，或在 <code class="mono">~/.cursor/mcp.json</code> 中粘贴：';
        codeEl.innerText = JSON.stringify({
          mcpServers: {
            yggdrasil: {
              command: "node",
              args: ["/绝对路径/dist/mcp-server.js"],
              env: {
                YGG_ENDPOINT: origin,
                YGG_TOKEN: token
              }
            }
          }
        }, null, 2);
      } else if (client === 'claude') {
        guideEl.innerHTML = '在 <b>Claude Desktop</b> 配置文件中配置（macOS: <code class="mono">~/Library/Application Support/Claude/claude_desktop_config.json</code>，Windows: <code class="mono">%APPDATA%\\\\Claude\\\\claude_desktop_config.json</code>）：';
        codeEl.innerText = JSON.stringify({
          mcpServers: {
            yggdrasil: {
              command: "node",
              args: ["/绝对路径/dist/mcp-server.js"],
              env: {
                YGG_ENDPOINT: origin,
                YGG_TOKEN: token
              }
            }
          }
        }, null, 2);
      } else if (client === 'agy') {
        guideEl.innerHTML = '在 <b>Google Antigravity CLI</b> 配置文件中声明（支持全局或项目级别 mcpServers 配置）：';
        codeEl.innerText = JSON.stringify({
          mcpServers: {
            yggdrasil: {
              command: "node",
              args: ["dist/mcp-server.js"],
              env: {
                YGG_ENDPOINT: origin,
                YGG_TOKEN: token
              }
            }
          }
        }, null, 2);
      } else if (client === 'windsurf') {
        guideEl.innerHTML = '在 <b>Windsurf</b> 或 <b>Cline</b> 扩展的 MCP 配置文件中添加：';
        codeEl.innerText = JSON.stringify({
          mcpServers: {
            yggdrasil: {
              command: "node",
              args: ["dist/mcp-server.js"],
              env: {
                YGG_ENDPOINT: origin,
                YGG_TOKEN: token
              }
            }
          }
        }, null, 2);
      } else if (client === 'http') {
        guideEl.innerHTML = '直接通过 <b>HTTP POST</b> 远程调用边缘端点，协议格式为标准 <b>JSON-RPC 2.0</b>：';
        codeEl.innerText = \`curl -X POST \${origin}/api/mcp \\\\
  -H "Content-Type: application/json" \\\\
  -H "X-Ygg-Token: \${token}" \\\\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "ygg_list_apps",
      "arguments": {}
    }
  }'\`;
      }
    }

    function copyCurrentMcpConfig() {
      const code = document.getElementById('mcp-config-code').innerText;
      copyText(code, '客户端 MCP 配置已复制到剪贴板');
    }

    async function testMcpHandshake() {
      showToast('正在向 /api/mcp 发送协议握手测试...');
      try {
        const res = await fetch('/api/mcp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'initialize',
            params: {
              protocolVersion: '2024-11-05',
              capabilities: {},
              clientInfo: { name: 'Yggdrasil-Dashboard', version: '1.0.0' }
            }
          })
        });
        const data = await res.json();
        if (data.result && data.result.serverInfo) {
          showToast(\`✅ MCP 握手成功！服务: \${data.result.serverInfo.name} v\${data.result.serverInfo.version}\`);
        } else {
          showToast('⚠️ MCP 响应格式异常: ' + JSON.stringify(data), 'error');
        }
      } catch (e) {
        showToast('❌ MCP 握手失败: ' + e.message, 'error');
      }
    }

    function onMcpToolSelectChange() {
      const tool = document.getElementById('mcp-test-tool-select').value;
      const argsInput = document.getElementById('mcp-test-tool-args');
      if (tool === 'ygg_list_apps') argsInput.value = '{}';
      else if (tool === 'ygg_get_app_details') argsInput.value = '{"app_id": "com.norns.valhalla"}';
      else if (tool === 'ygg_get_system_stats') argsInput.value = '{}';
      else if (tool === 'ygg_check_update') argsInput.value = '{"app_id": "com.norns.valhalla", "current_version_code": 0}';
      else if (tool === 'ygg_list_files') argsInput.value = '{"category": "general"}';
      else if (tool === 'ygg_trigger_cleanup') argsInput.value = '{"days": 90, "keep_latest": 3, "force": false}';
    }

    async function runOnlineMcpToolTest() {
      const tool = document.getElementById('mcp-test-tool-select').value;
      const rawArgs = document.getElementById('mcp-test-tool-args').value.trim() || '{}';
      const statusEl = document.getElementById('mcp-test-status');
      const resultEl = document.getElementById('mcp-test-result');

      let argsObj = {};
      try {
        argsObj = JSON.parse(rawArgs);
      } catch (e) {
        showToast('参数 JSON 格式解析错误', 'error');
        return;
      }

      statusEl.innerText = '⏳ 请求中...';
      resultEl.innerText = '// 执行中...';

      const token = (settingsData && settingsData['api_fixed_token']) || '';
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['X-Ygg-Token'] = token;

      try {
        const res = await fetch('/api/mcp', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'tools/call',
            params: {
              name: tool,
              arguments: argsObj
            }
          })
        });

        const data = await res.json();
        statusEl.innerText = \`HTTP \${res.status}\`;
        resultEl.innerText = JSON.stringify(data, null, 2);
        showToast('MCP 工具调用成功');
      } catch (err) {
        statusEl.innerText = '调用失败';
        resultEl.innerText = 'Error: ' + err.message;
        showToast('调用失败: ' + err.message, 'error');
      }
    }

    // Init
    window.addEventListener('DOMContentLoaded', () => {
      checkAuth();
    });
  </script>
</body>
</html>`;
}
