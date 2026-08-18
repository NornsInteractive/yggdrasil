# 🌳 Yggdrasil (ygg) - 边缘应用版本发布与文件分发系统

**Yggdrasil（世界之树，简称 ygg）** 是一个完全构建在 **Cloudflare 边缘生态**（Workers + D1 + R2）上的轻量级、高可用、低延迟的 **应用版本管理与通用文件分发系统**。

专为 Android APK 发布、版本检测升级、通用文件存储与分发设计，支持完整的 **HTTP Range 206 断点续传**、**自定义固定 Token 鉴权开关**、**现代化 Web 管理控制台**，并且支持在 **Cloudflare 仪表盘全手动配置、绑定与部署**。

---

## ✨ 核心特性

- 🚀 **Serverless 边缘架构**：基于 Cloudflare Workers + Hono，全球数百边缘节点就近加速，极速冷启动（<1ms）。
- 💰 **0 出口流量费用**：使用 Cloudflare R2 对象存储，分发 APK 和大文件**免除高额带宽与流量出口费**。
- 📱 **完备的 App 版本管理**：
  - 支持多应用统一托管（包名 `app_id`、应用名称、图标）。
  - 数字版本号比对（`versionCode` 整数）、语义化版本名（`versionName`）。
  - 渠道隔离（`default` / `beta` / `googleplay` / `official` 等）。
  - 强制更新判定（支持单版本强更标记与最低兼容版本 `minVersionCode`）。
  - 更新日志（Changelog）与 MD5 / SHA256 完整性校验。
- ⚡ **HTTP 206 原生断点续传**：基于标准 `Range` 请求头，完美兼容 Android 自带 `DownloadManager`、OkHttp、iOS 下载模块以及 IDM、curl、aria2 等下载器。
- 📦 **支持大文件分片上传 (Multipart Upload)**：Web 控制台内置直传与自动大文件分片（Chunked）上传，支持 GB 级大文件。
- 🔒 **灵活的 API Token 鉴权开关**：
  - 可在 Web 控制台随时一键开启/关闭 Token 校验。
  - 可自定义固定 API Token（如 `ygg_secret_token_xxx`）。
  - 支持细粒度开关：可单独设置“版本检测”或“文件下载”是否需要 Token。
  - 兼容 Header（`X-Ygg-Token` / `Bearer`）和 URL Query（`?token=`）传参。
- 💻 **现代化 Web 管理控制台**：内置单页应用，直观管理应用、发布版本、上传文件、设置 Token，并提供**可视化接口模拟测试台**。

---

## 🛠️ Cloudflare 控制台全手动部署指南

只需在 Cloudflare Dashboard 进行可视化操作，即可在 3 分钟内完成全套部署。

### 第一步：创建 Cloudflare R2 存储桶
1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)。
2. 在左侧菜单点击 **R2** -> 点击 **Create bucket**。
3. 桶名称输入：`ygg-storage`（或自定义名称），点击 **Create Bucket** 完成。

---

### 第二步：创建 Cloudflare D1 数据库并初始化表结构
1. 在左侧菜单点击 **Workers & Pages** -> **D1**。
2. 点击 **Create database** -> 选择 **Dashboard**。
3. 数据库名称输入：`ygg-db` -> 点击 **Create**。
4. 创建完成后进入 `ygg-db` 详情页，切换到 **Console**（控制台）标签页。
5. 打开本项目中的纯净无注释 SQL 文件 [`schema.clean.sql`](file:///workspace/projects/yggdrasil/schema.clean.sql)（或带注释版 [`schema.sql`](file:///workspace/projects/yggdrasil/schema.sql)），复制其全部内容，粘贴到 D1 控制台输入框中，点击 **Execute** 执行初始化建表。

---

### 第三步：创建 Cloudflare Worker 并配置绑定与变量
1. 在左侧菜单点击 **Workers & Pages** -> **Overview** -> **Create application** -> **Create Worker**。
2. 命名 Worker 为 `yggdrasil`（或 `ygg`）-> 点击 **Deploy**。
3. 部署后进入该 Worker 的 **Settings**（设置）页面进行资源绑定：

#### 3.1 绑定 D1 数据库：
- 进入 **Settings** -> **Bindings**（或 **Variables and Secrets**） -> 找到 **D1 Database Bindings**。
- 点击 **Add binding**：
  - **Variable name（变量名）**：必须填写 `DB`（大写）
  - **D1 database**：选择第二步创建的 `ygg-db`
- 点击 **Save and deploy**。

#### 3.2 绑定 R2 存储桶：
- 在同一页面找到 **R2 Bucket Bindings**。
- 点击 **Add binding**：
  - **Variable name（变量名）**：必须填写 `BUCKET`（大写）
  - **R2 bucket**：选择第一步创建的 `ygg-storage`
- 点击 **Save and deploy**。

#### 3.3 配置环境变量与密钥：
- 在 **Environment Variables** / **Secrets** 中添加：
  - `ADMIN_PASSWORD`：设置你的 Web 后台管理员初始登录密码（例如 `Admin@Ygg2026!`，若不设置默认为 `admin`）。
  - `JWT_SECRET`：设置一段随机字符串作为签名密钥（例如 `ygg_jwt_secret_random_32_chars_xxx`）。
  - `APP_NAME`：（可选）`Yggdrasil`
- 点击 **Save and deploy**。

---

### 第四步：粘贴代码并部署上线
1. 打开本项目构建产物 [`dist/worker.js`](file:///workspace/projects/yggdrasil/dist/worker.js)。
2. 复制 `dist/worker.js` 的**全部内容**（单文件纯 JavaScript，已打包所有依赖与前端界面）。
3. 回到 Cloudflare Worker 页面，右上角点击 **Edit code**（快速编辑）。
4. 清空编辑器中的原有代码，将复制的内容粘贴进去。
5. 点击右上角 **Save and Deploy**。
6. 🎉 部署完成！访问分配的 `https://yggdrasil.<your-subdomain>.workers.dev` 即可直接打开管理控制台并开始使用！

---

## 📡 客户端 API 接口规范

### 1. App 版本检测接口
手机 App 启动或检查更新时调用。

- **URL**: `GET /api/v1/app/latest` 或 `GET /api/v1/version/check`
- **请求参数 (Query)**:
  | 参数名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | `app_id` | string | 是 | 应用包名/标识（如 `com.example.app`） |
  | `version_code` | int | 否 | 客户端当前安装的 `versionCode`（如 `10000`）。若传入，服务端自动判断 `has_update` |
  | `channel` | string | 否 | 渠道标识，默认 `default` |
  | `token` | string | 否 | 若开启了 Token 校验且未放在 Header 中时传入 |

- **Header 传参（可选）**:
  - `X-Ygg-Token: <token>`
  - 或 `Authorization: Bearer <token>`

- **响应示例（发现新版本）**:
  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "has_update": true,
      "is_force": false,
      "app_id": "com.example.app",
      "app_name": "掌上办公",
      "icon_url": "https://example.com/icon.png",
      "current_version_code": 10000,
      "latest_version_code": 10200,
      "latest_version_name": "1.2.0",
      "min_version_code": 10000,
      "channel": "default",
      "changelog": "- 优化下载速度\n- 修复已知崩溃Bug",
      "download_url": "https://ygg.example.workers.dev/api/v1/app/download?app_id=com.example.app&version_code=10200&channel=default",
      "file_name": "app-v1.2.0.apk",
      "file_size": 45829104,
      "file_md5": "e10adc3949ba59abbe56e057f20f883e",
      "release_time": "2026-08-18T10:00:00Z"
    }
  }
  ```

---

### 2. App APK 下载接口 (支持断点续传)

- **URL**: `GET /api/v1/app/download`
- **请求参数**:
  - `app_id` (必填)
  - `version_code` (选填，不填默认下载最新已发布版本)
  - `channel` (选填，默认 `default`)
- **断点续传测试 (curl 模拟)**:
  ```bash
  # 分片下载第 0 到 1023 字节 (响应 HTTP 206 Partial Content)
  curl -i -H "Range: bytes=0-1023" "https://ygg.example.workers.dev/api/v1/app/download?app_id=com.example.app"
  
  # 支持携带 Token
  curl -i -H "X-Ygg-Token: your_token" -H "Range: bytes=1048576-" "https://ygg.example.workers.dev/api/v1/app/download?app_id=com.example.app"
  ```

---

### 3. 通用文件检测与下载接口

- **文件元数据检测**: `GET /api/v1/files/check?alias=my-config` 或 `GET /api/v1/files/:id/check`
- **文件直接下载**: `GET /api/v1/files/:id/download`
- **短链别名下载**: `GET /f/:alias`（如 `https://ygg.example.workers.dev/f/app-config`）

---

## 💻 手机 App (Android Kotlin) 接入代码示例

```kotlin
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject

data class UpdateInfo(
    val hasUpdate: Boolean,
    val isForce: Boolean,
    val latestVersionName: String,
    val latestVersionCode: Int,
    val changelog: String,
    val downloadUrl: String,
    val fileMd5: String?
)

fun checkAppUpdate(
    currentVersionCode: Int,
    token: String? = null,
    onResult: (UpdateInfo?) -> Unit
) {
    val client = OkHttpClient()
    val url = "https://ygg.example.workers.dev/api/v1/app/latest?app_id=com.example.app&version_code=$currentVersionCode"

    val requestBuilder = Request.Builder().url(url)
    if (!token.isNullOrEmpty()) {
        requestBuilder.addHeader("X-Ygg-Token", token)
    }

    client.newCall(requestBuilder.build()).enqueue(object : okhttp3.Callback {
        override fun onFailure(call: okhttp3.Call, e: java.io.IOException) {
            onResult(null)
        }

        override fun onResponse(call: okhttp3.Call, response: okhttp3.Response) {
            val json = JSONObject(response.body?.string() ?: "{}")
            if (json.optInt("code") == 0) {
                val data = json.getJSONObject("data")
                val updateInfo = UpdateInfo(
                    hasUpdate = data.getBoolean("has_update"),
                    isForce = data.getBoolean("is_force"),
                    latestVersionName = data.getString("latest_version_name"),
                    latestVersionCode = data.getInt("latest_version_code"),
                    changelog = data.getString("changelog"),
                    downloadUrl = data.getString("download_url"),
                    fileMd5 = data.optString("file_md5", null)
                )
                onResult(updateInfo)
            } else {
                onResult(null)
            }
        }
    })
}
```

---

## 🛠️ 本地开发与二次构建

```bash
# 1. 安装依赖
npm install

# 2. 运行单元与系统验证测试
npm test

# 3. 重新构建生成 dist/worker.js
npm run build

# 4. (可选) 使用 wrangler 进行本地开发或一键部署
# 复制 wrangler.toml.example 为 wrangler.toml 并填入 ID
npm run dev
npm run deploy
```

---

## 📄 开源许可证

MIT License
