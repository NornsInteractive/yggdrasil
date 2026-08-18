// ==============================================================================
// Yggdrasil (ygg) - Main Entry Point (Cloudflare Workers + Hono)
// ==============================================================================

import { Hono } from 'hono';
import { Env } from './types';
import { corsMiddleware } from './middleware/cors';
import { clientAppRoutes } from './routes/clientApp';
import { clientFilesRoutes } from './routes/clientFiles';
import { adminAuthRoutes } from './routes/adminAuth';
import { adminAppsRoutes } from './routes/adminApps';
import { adminFilesRoutes } from './routes/adminFiles';
import { adminUploadRoutes } from './routes/adminUpload';
import { adminSettingsRoutes } from './routes/adminSettings';
import { renderDashboardHtml } from './views/dashboard';

const app = new Hono<{ Bindings: Env }>();

// 1. 全局 CORS 处理
app.use('*', corsMiddleware);

// 2. 挂载客户端对外 API
app.route('/', clientAppRoutes);
app.route('/', clientFilesRoutes);

// 3. 挂载管理员后台 API
app.route('/', adminAuthRoutes);
app.route('/', adminAppsRoutes);
app.route('/', adminFilesRoutes);
app.route('/', adminUploadRoutes);
app.route('/', adminSettingsRoutes);

// 4. Web 控制台前端页面路由
const serveDashboard = (c: any) => {
  const siteTitle = c.env.APP_NAME 
    ? `${c.env.APP_NAME} - 分发管理中心` 
    : 'Yggdrasil - 应用与文件分发管理中心';
  return c.html(renderDashboardHtml(siteTitle));
};

app.get('/', serveDashboard);
app.get('/admin', serveDashboard);
app.get('/dashboard', serveDashboard);

// 5. 健康检查接口
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    system: 'Yggdrasil (ygg)',
    timestamp: new Date().toISOString(),
  });
});

// 6. 全局 404 处理
app.notFound((c) => {
  return c.json({
    code: 404,
    message: `Resource not found: ${c.req.method} ${c.req.url}`,
  }, 404);
});

// 7. 全局异常处理
app.onError((err, c) => {
  console.error('[Yggdrasil Edge Error]:', err);
  return c.json({
    code: 500,
    message: 'Internal Edge Server Error: ' + (err.message || 'Unknown'),
  }, 500);
});

export default app;
