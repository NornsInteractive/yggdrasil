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

// 2. 检查 Cloudflare D1 与 R2 资源绑定是否已在控制台配置
app.use('/api/*', async (c, next) => {
  // 登录与登出不需要 D1
  if (c.req.path === '/api/admin/login' || c.req.path === '/api/admin/logout') {
    return await next();
  }

  if (!c.env || !c.env.DB) {
    return c.json({
      code: 500,
      message: '【Cloudflare 绑定缺失】未检测到 D1 数据库绑定。请前往 Cloudflare 控制台 -> Workers -> yggdrasil -> Settings -> Bindings -> 添加 D1 数据库绑定，变量名称必须填写为 "DB"（大写），并选择您的 D1 数据库（如 ygg-db）。',
    }, 500);
  }

  if (c.req.path.startsWith('/api/admin/upload') && !c.env.BUCKET) {
    return c.json({
      code: 500,
      message: '【Cloudflare 绑定缺失】未检测到 R2 存储桶绑定。请前往 Cloudflare 控制台 -> Workers -> yggdrasil -> Settings -> Bindings -> 添加 R2 存储桶绑定，变量名称必须填写为 "BUCKET"（大写），并选择您的 R2 桶（如 ygg-storage）。',
    }, 500);
  }

  await next();
});

// 2. Web 控制台前端页面路由 (直接返回单页 Web Dashboard)
const serveDashboard = (c: any) => {
  const siteTitle = c.env?.APP_NAME 
    ? `${c.env.APP_NAME} - 分发管理中心` 
    : 'Yggdrasil - 应用与文件分发管理中心';
  return c.html(renderDashboardHtml(siteTitle));
};

app.get('/', serveDashboard);
app.get('/admin', serveDashboard);
app.get('/dashboard', serveDashboard);

// 3. 挂载客户端对外 API
app.route('/', clientAppRoutes);
app.route('/', clientFilesRoutes);

// 4. 挂载管理员后台 API
app.route('/', adminAuthRoutes);
app.route('/', adminAppsRoutes);
app.route('/', adminFilesRoutes);
app.route('/', adminUploadRoutes);
app.route('/', adminSettingsRoutes);

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
