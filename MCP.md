# 🤖 Yggdrasil MCP (Model Context Protocol) 接入指南

Yggdrasil 现已全面支持 **Model Context Protocol (MCP)** 协议！AI 助手（如 **Cursor**、**Claude Desktop**、**Antigravity CLI (AGY)**、**Windsurf**、**Cline** 等）可以直接通过该协议调用 Yggdrasil 的各项管理能力，包括：

- 📱 查看应用列表及发布情况 (`ygg_list_apps`)
- 🔍 查询应用详情与完整版本发布历史 (`ygg_get_app_details`)
- 🚀 检测新版本及模拟升级 (`ygg_check_update`)
- ➕ 创建新应用 (`ygg_create_app`)
- ✏️ 修改应用信息 (`ygg_update_app`)
- 🗑️ 删除应用与所有历史包 (`ygg_delete_app`)
- 📦 发布新版本（支持 GitHub Release / CDN 第三方直链免上传，并支持反代加速） (`ygg_publish_version`)
- 📝 编辑已有版本配置与开关 (`ygg_update_version`)
- ❌ 删除指定历史版本 (`ygg_delete_version`)
- 📊 查看全系统运行概况与存储占用 (`ygg_get_system_stats`)
- 🧹 手动或强制触发旧版本物理清理 (`ygg_trigger_cleanup`)
- 📂 查询通用文件列表 (`ygg_list_files`)

---

## 🚀 方式一：本地 STDIO 模式（推荐 Desktop AI 使用）

本地 STDIO 模式运行轻量级 CLI 桥接脚本 `dist/mcp-server.js`，通过 STDIO 与桌面 AI 客户端通信，并将所有工具调用请求转发到您的 Yggdrasil 部署节点（如 `https://ygg.norns.cc.cd`）。

### 1. 构建 MCP 服务产物
在本项目根目录下执行：
```bash
npm run build
```
将在 `dist/mcp-server.js` 生成可执行脚本。

---

### 2. 各主流 AI 客户端配置

#### 🔹 1. Claude Desktop
在 Claude Desktop 配置文件中添加：
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "yggdrasil": {
      "command": "node",
      "args": ["/绝对路径/workspace/projects/yggdrasil/dist/mcp-server.js"],
      "env": {
        "YGG_ENDPOINT": "https://ygg.norns.cc.cd",
        "YGG_TOKEN": "ygg_secret_token_default_2026"
      }
    }
  }
}
```

> **注意**：如果控制台开启了 API Token 校验，请将 `YGG_TOKEN` 替换为您在控制台设置的 Token；如未开启 Token 保护，可留空或使用默认值。

---

#### 🔹 2. Cursor
在 Cursor 设置中：
1. 打开 **Settings** -> **Features** -> **MCP**。
2. 点击 **+ Add New MCP Server**。
3. 填写：
   - **Name**: `yggdrasil`
   - **Type**: `command`
   - **Command**: `node /绝对路径/workspace/projects/yggdrasil/dist/mcp-server.js`
4. 如果需要配置环境变量，也可以在 `~/.cursor/mcp.json` 或项目根目录 `.cursor/mcp.json` 中配置：

```json
{
  "mcpServers": {
    "yggdrasil": {
      "command": "node",
      "args": ["dist/mcp-server.js"],
      "env": {
        "YGG_ENDPOINT": "https://ygg.norns.cc.cd",
        "YGG_TOKEN": "ygg_secret_token_default_2026"
      }
    }
  }
}
```

---

#### 🔹 3. Antigravity CLI / AGY
在 `~/.gemini/antigravity-cli/mcp/yggdrasil` 或直接配置在 Antigravity 的 `settings.json` / MCP 配置文件中：

```json
{
  "mcpServers": {
    "yggdrasil": {
      "command": "node",
      "args": ["/workspace/projects/yggdrasil/dist/mcp-server.js"],
      "env": {
        "YGG_ENDPOINT": "https://ygg.norns.cc.cd",
        "YGG_TOKEN": "ygg_secret_token_default_2026"
      }
    }
  }
}
```

---

#### 🔹 4. Cline (VS Code 扩展)
在 VS Code 中点击 Cline 插件设置 -> **MCP Servers** -> **Configure MCP Servers**，添加：

```json
{
  "mcpServers": {
    "yggdrasil": {
      "command": "node",
      "args": ["/workspace/projects/yggdrasil/dist/mcp-server.js"],
      "env": {
        "YGG_ENDPOINT": "https://ygg.norns.cc.cd",
        "YGG_TOKEN": "ygg_secret_token_default_2026"
      }
    }
  }
}
```

---

## 🌐 方式二：远程 HTTP JSON-RPC 2.0 端点（无需运行本地 Node）

云端 AI 代理、Webhook 或自定义脚本可以直接通过标准 HTTP POST 请求访问 Cloudflare 边缘上的 MCP 接口：

- **端点 URL**: `https://ygg.norns.cc.cd/api/mcp` 或 `https://ygg.norns.cc.cd/mcp`
- **协议格式**: 标准 JSON-RPC 2.0
- **支持鉴权方式**：
  - HTTP Header: `X-Ygg-Token: <your_token>`
  - HTTP Header: `Authorization: Bearer <your_token>`
  - URL Query: `?token=<your_token>`

### 常用 HTTP 示例：

#### 1. 列出所有可用工具 (`tools/list`)
```bash
curl -X POST https://ygg.norns.cc.cd/api/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list"
  }'
```

#### 2. 调用工具查看应用列表 (`tools/call`)
```bash
curl -X POST https://ygg.norns.cc.cd/api/mcp \
  -H "Content-Type: application/json" \
  -H "X-Ygg-Token: ygg_secret_token_default_2026" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "ygg_list_apps",
      "arguments": {}
    }
  }'
```

#### 3. 发布新版本（免上传直链模式）
```bash
curl -X POST https://ygg.norns.cc.cd/api/mcp \
  -H "Content-Type: application/json" \
  -H "X-Ygg-Token: ygg_secret_token_default_2026" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "ygg_publish_version",
      "arguments": {
        "app_id": "com.norns.valhalla",
        "version_code": 10001,
        "version_name": "1.0.1",
        "external_url": "https://github.com/NornsInteractive/valhalla/releases/download/v1.0.1/valhalla.zip",
        "use_proxy": true,
        "changelog": "修复已知性能问题"
      }
    }
  }'
```

---

## 🛠️ 可用 MCP 工具一览表

| 工具名称 | 作用说明 | 必填参数 |
| :--- | :--- | :--- |
| `ygg_list_apps` | 列出所有应用及最新版本和下载统计 | 无 (支持 `search` 搜索过滤) |
| `ygg_get_app_details` | 查看指定包名的详细信息及所有历史版本列表 | `app_id` |
| `ygg_check_update` | 模拟客户端检测应用升级并获取下载直链 | `app_id` (可选 `current_version_code`, `channel`) |
| `ygg_create_app` | 注册/创建新应用项目 | `app_id`, `name` |
| `ygg_update_app` | 更新应用名称、图标、简介 | `app_id` |
| `ygg_delete_app` | 彻底删除应用及其所有版本与 R2 文件 | `app_id` |
| `ygg_publish_version` | 发布新版本（支持直链免上传与边缘反代） | `app_id`, `version_code`, `version_name` |
| `ygg_update_version` | 编辑已有版本属性（日志、外链、反代、上架状态） | `version_id` |
| `ygg_delete_version` | 删除指定版本记录及 R2 文件 | `version_id` |
| `ygg_get_system_stats` | 获取全局统计（应用数、版本数、存储量、下载量） | 无 |
| `ygg_trigger_cleanup` | 触发旧版本超期清理（释放 R2 存储并保留历史记录） | 可选 `days`, `keep_latest`, `force` |
| `ygg_list_files` | 列出所有通用文件与文档列表 | 可选 `category` |

---

## 💡 AI 对话使用示例

配置完成后，您可以直接在与 AI 对话中发出指令，例如：

- *“帮我查一下 Yggdrasil 里面现在发布了哪些应用，以及最新版本是多少”*
- *“将 Valhalla (com.norns.valhalla) 发布一个新版本 1.0.2，版本号 10002，下载链接使用 GitHub Release 的 zip 文件，开启反代加速，更新日志写‘优化渲染管线’”*
- *“帮我查看一下当前系统的存储占用情况，并清理 60 天前的历史旧版本，每个渠道保留最新的 2 个版本”*
- *“检查一下 com.norns.valhalla 在版本 10000 时是否有新版本更新”*
