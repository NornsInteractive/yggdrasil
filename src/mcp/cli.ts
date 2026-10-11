// ==============================================================================
// Yggdrasil (ygg) - MCP Stdio Server CLI (For Cursor, Claude Desktop, AGY, Cline)
// ==============================================================================

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { YGG_MCP_TOOLS } from './definitions';

// 1. 读取环境配置与命令行参数
let endpoint = (process.env.YGG_ENDPOINT || 'https://ygg.norns.cc.cd').trim();
let token = (process.env.YGG_TOKEN || '').trim();
let adminPassword = (process.env.YGG_ADMIN_PASSWORD || '').trim();

const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--endpoint' && argv[i + 1]) {
    endpoint = argv[i + 1].trim();
    i++;
  } else if (argv[i] === '--token' && argv[i + 1]) {
    token = argv[i + 1].trim();
    i++;
  } else if (argv[i] === '--password' && argv[i + 1]) {
    adminPassword = argv[i + 1].trim();
    i++;
  }
}

// 规范化 endpoint URL，移除尾随斜杠
endpoint = endpoint.replace(/\/+$/, '');

// 2. 初始化 MCP Server
const server = new Server(
  {
    name: 'yggdrasil',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 3. 注册 tools/list 请求处理器
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: YGG_MCP_TOOLS,
  };
});

// 4. 注册 tools/call 请求处理器 (转发至 Yggdrasil 远端 HTTP /api/mcp 接口)
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: toolArgs } = request.params;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['X-Ygg-Token'] = token;
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (adminPassword) {
    headers['X-Ygg-Admin-Password'] = adminPassword;
  }

  try {
    const res = await fetch(`${endpoint}/api/mcp`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name,
          arguments: toolArgs || {},
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `[Yggdrasil MCP HTTP ${res.status}] ${errText}`,
          },
        ],
      };
    }

    const data = await res.json() as any;

    if (data.error) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `[Yggdrasil MCP Error ${data.error.code}]: ${data.error.message}`,
          },
        ],
      };
    }

    return (
      data.result || {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2),
          },
        ],
      }
    );
  } catch (err: any) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `[Yggdrasil MCP Connection Error] Failed to reach ${endpoint}: ${err.message || String(err)}`,
        },
      ],
    };
  }
});

// 5. 启动 STDIO 传输监听
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`[Yggdrasil MCP Server] Started in STDIO mode. Forwarding calls to: ${endpoint}`);
}

main().catch((err) => {
  console.error('[Yggdrasil MCP Fatal Error]:', err);
  process.exit(1);
});
