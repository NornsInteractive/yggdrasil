// ==============================================================================
// Yggdrasil (ygg) - Token Guard Middleware (Dynamic API Token Checker)
// ==============================================================================

import { MiddlewareHandler } from 'hono';
import { Env } from '../types';
import { SettingService } from '../services/settingService';
import { DEFAULT_CONFIG } from '../config/constants';

export type TokenProtectedAction = 'app_check' | 'app_download' | 'file_download';

export function tokenGuard(action: TokenProtectedAction): MiddlewareHandler<{ Bindings: Env }> {
  return async (c, next) => {
    // 查询系统数据库中是否为此行为开启了 Token 校验要求
    const { required, fixedToken } = await SettingService.checkAuthRequirement(c.env.DB, action);

    // 如果未开启校验，直接放行
    if (!required) {
      return await next();
    }

    // 提取客户端携带的 Token (支持 Header: X-Ygg-Token, Authorization: Bearer, 或 URL Query: ?token=)
    let clientToken = c.req.header(DEFAULT_CONFIG.TOKEN_HEADER_NAME);

    if (!clientToken) {
      const authHeader = c.req.header('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        clientToken = authHeader.substring(7).trim();
      }
    }

    if (!clientToken) {
      clientToken = c.req.query(DEFAULT_CONFIG.TOKEN_QUERY_NAME);
    }

    // 校验 Token 是否匹配
    if (!clientToken || clientToken.trim() !== fixedToken.trim()) {
      return c.json({
        code: 401,
        message: 'Unauthorized: Invalid or missing API Token. Please provide valid token in X-Ygg-Token header or ?token= query parameter.',
      }, 401);
    }

    await next();
  };
}
