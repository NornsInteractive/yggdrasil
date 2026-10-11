// ==============================================================================
// Yggdrasil (ygg) - MCP (Model Context Protocol) HTTP JSON-RPC 2.0 Route
// ==============================================================================

import { Hono } from 'hono';
import { Env } from '../types';
import { YGG_MCP_TOOLS } from '../mcp/definitions';
import { executeMcpTool } from '../mcp/directHandler';
import { SettingService } from '../services/settingService';
import { SETTING_KEYS, DEFAULT_CONFIG } from '../config/constants';
import { verifyJwt } from '../middleware/auth';

export const mcpRoutes = new Hono<{ Bindings: Env }>();

/**
 * 校验 MCP 访问凭据 (Token / Admin 密码 / JWT)
 */
async function checkMcpAuth(c: any): Promise<{ authorized: boolean; message?: string }> {
  const db = c.env.DB;
  if (!db) {
    return { authorized: false, message: 'D1 Database binding missing' };
  }

  const settings = await SettingService.getAllSettings(db);
  const apiTokenEnabled = settings[SETTING_KEYS.API_TOKEN_ENABLED] === 'true';
  const fixedToken = settings[SETTING_KEYS.API_FIXED_TOKEN] || DEFAULT_CONFIG.DEFAULT_API_TOKEN;
  const adminPassword = c.env.ADMIN_PASSWORD || DEFAULT_CONFIG.DEFAULT_ADMIN_PASSWORD;

  // 1. 获取客户端提交的 Token
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

  const clientAdminPassword = c.req.header('x-ygg-admin-password') || c.req.query('admin_password');

  // 2. 凭据比对校验
  if (clientToken) {
    if (clientToken.trim() === fixedToken.trim() || clientToken.trim() === adminPassword.trim()) {
      return { authorized: true };
    }

    // 检查是否为有效管理员 JWT
    const jwtSecret = c.env.JWT_SECRET || DEFAULT_CONFIG.DEFAULT_JWT_SECRET;
    const jwtPayload = await verifyJwt(clientToken, jwtSecret);
    if (jwtPayload && jwtPayload.role === 'admin') {
      return { authorized: true };
    }
  }

  if (clientAdminPassword && clientAdminPassword.trim() === adminPassword.trim()) {
    return { authorized: true };
  }

  // 3. 若全局未启用 Token 保护，放行
  if (!apiTokenEnabled) {
    return { authorized: true };
  }

  return {
    authorized: false,
    message: 'Unauthorized: Invalid or missing API token. Please supply token via X-Ygg-Token header or ?token= query parameter.',
  };
}

/**
 * MCP JSON-RPC 2.0 核心处理器
 */
async function handleMcpJsonRpc(c: any) {
  let body: any;
  try {
    body = await c.req.json();
  } catch (e) {
    return c.json({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error: Invalid JSON payload' },
    }, 400);
  }

  const id = body?.id !== undefined ? body.id : null;
  const method = body?.method;

  if (!method || typeof method !== 'string') {
    return c.json({
      jsonrpc: '2.0',
      id,
      error: { code: -32600, message: 'Invalid Request: Missing method name' },
    }, 400);
  }

  // 1. initialize 协议握手
  if (method === 'initialize') {
    return c.json({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {
            listChanged: false,
          },
        },
        serverInfo: {
          name: 'yggdrasil',
          version: '1.0.0',
        },
        instructions: 'Yggdrasil App Release & File Management MCP Server. Use available tools to inspect apps, versions, stats, and trigger cleanup.',
      },
    });
  }

  // 2. notifications/initialized 握手确认通知
  if (method === 'notifications/initialized') {
    return c.body(null, 204);
  }

  // 3. ping 保活心跳
  if (method === 'ping') {
    return c.json({
      jsonrpc: '2.0',
      id,
      result: {},
    });
  }

  // 4. tools/list 工具列表检索
  if (method === 'tools/list') {
    return c.json({
      jsonrpc: '2.0',
      id,
      result: {
        tools: YGG_MCP_TOOLS,
      },
    });
  }

  // 5. tools/call 工具调用执行
  if (method === 'tools/call') {
    // 鉴权检查
    const auth = await checkMcpAuth(c);
    if (!auth.authorized) {
      return c.json({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32000,
          message: auth.message || 'Unauthorized',
        },
      }, 401);
    }

    const { name, arguments: toolArgs } = body.params || {};
    if (!name) {
      return c.json({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32602,
          message: 'Invalid params: tool name is required',
        },
      }, 400);
    }

    const originUrl = new URL(c.req.url).origin;

    try {
      const toolResult = await executeMcpTool(
        c.env.DB,
        c.env.BUCKET,
        name,
        toolArgs || {},
        originUrl
      );

      const textOutput = typeof toolResult === 'string'
        ? toolResult
        : JSON.stringify(toolResult, null, 2);

      return c.json({
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: textOutput,
            },
          ],
        },
      });
    } catch (err: any) {
      return c.json({
        jsonrpc: '2.0',
        id,
        result: {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Tool execution failed: ${err.message || String(err)}`,
            },
          ],
        },
      });
    }
  }

  // 未知方法
  return c.json({
    jsonrpc: '2.0',
    id,
    error: {
      code: -32601,
      message: `Method '${method}' not found`,
    },
  }, 404);
}

// 挂载 POST 接口
mcpRoutes.post('/api/mcp', handleMcpJsonRpc);
mcpRoutes.post('/mcp', handleMcpJsonRpc);

// 挂载 GET 工具清单与接入说明接口
mcpRoutes.get('/api/mcp/tools', (c) => {
  return c.json({
    code: 0,
    message: 'success',
    data: {
      server: 'Yggdrasil MCP Server',
      version: '1.0.0',
      total_tools: YGG_MCP_TOOLS.length,
      tools: YGG_MCP_TOOLS,
    },
  });
});

mcpRoutes.get('/api/mcp', (c) => {
  const origin = new URL(c.req.url).origin;
  return c.json({
    system: 'Yggdrasil Model Context Protocol (MCP) Server',
    version: '1.0.0',
    protocol: 'JSON-RPC 2.0',
    endpoints: {
      http_rpc: `${origin}/api/mcp`,
      tools_list: `${origin}/api/mcp/tools`,
    },
    tools_count: YGG_MCP_TOOLS.length,
    tools: YGG_MCP_TOOLS.map((t) => ({ name: t.name, description: t.description })),
    usage: {
      description: 'AI agents can invoke tools directly over HTTP JSON-RPC or via local stdio mcp-server.',
      desktop_config_example: {
        mcpServers: {
          yggdrasil: {
            command: 'node',
            args: ['dist/mcp-server.js'],
            env: {
              YGG_ENDPOINT: origin,
              YGG_TOKEN: 'your_api_token_here',
            },
          },
        },
      },
    },
  });
});

mcpRoutes.get('/mcp', (c) => {
  return c.redirect('/api/mcp', 301);
});
