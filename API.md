# 📖 Yggdrasil (ygg) - 完整 API 接口开发文档

本文档详细描述 **Yggdrasil（世界之树，ygg）** 提供的全部客户端对外接口（App 版本检测、APK 断点续传下载、通用文件管理）及管理后台接口协议，并附带多语言客户端（Android Kotlin/Java、Flutter、iOS Swift、cURL）集成代码示例。

---

## 目录
1. [通用规范与鉴权机制](#1-通用规范与鉴权机制)
2. [客户端公开接口 (Client APIs)](#2-客户端公开接口-client-apis)
   - [2.1 App 版本检测升级接口](#21-app-版本检测升级接口)
   - [2.2 App APK 下载接口 (支持 HTTP Range 206 续传)](#22-app-apk-下载接口-支持-http-range-206-续传)
   - [2.3 通用文件元数据检测接口](#23-通用文件元数据检测接口)
   - [2.4 通用文件下载与短链接口](#24-通用文件下载与短链接口)
3. [管理端后台接口 (Admin APIs)](#3-管理端后台接口-admin-apis)
   - [3.1 登录与系统统计](#31-登录与系统统计)
   - [3.2 应用管理 (Apps CRUD)](#32-应用管理-apps-crud)
   - [3.3 版本发布管理 (Versions CRUD)](#33-版本发布管理-versions-crud)
   - [3.4 通用文件管理 (Files CRUD)](#34-通用文件管理-files-crud)
   - [3.5 R2 对象上传 (直传与大文件分片)](#35-r2-对象上传-直传与大文件分片)
   - [3.6 动态系统配置与 Token 管理](#36-动态系统配置与-token-管理)
4. [客户端集成接入代码示例](#4-客户端集成接入代码示例)
   - [Android (Kotlin + OkHttp)](#41-android-kotlin--okhttp)
   - [Flutter (Dart + Dio)](#42-flutter-dart--dio)
   - [iOS (Swift + URLSession)](#43-ios-swift--urlsession)
   - [cURL 命令行速查](#44-curl-命令行速查)

---

## 1. 通用规范与鉴权机制

### 1.1 基础请求地址
- **Base URL**: `https://<your-worker-domain>.workers.dev` (或你绑定的自定义域名)

### 1.2 统一响应格式 (JSON)
所有非二进制流接口均返回统一的 JSON 包装：
```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```
- `code`: 状态码，`0` 表示成功，非 `0` 表示业务错误。
- `message`: 提示信息。
- `data`: 业务负载对象或数组。

### 1.3 客户端 API Token 传递方式
当管理员在后台开启了 Token 校验开关时，客户端请求必须携带已配置的固定 Token。系统支持以下任意一种传递方式（服务端自动解析）：

1. **HTTP 请求头 (推荐)**：
   ```http
   X-Ygg-Token: your_fixed_token_here
   ```
2. **Bearer Token 请求头**：
   ```http
   Authorization: Bearer your_fixed_token_here
   ```
3. **URL Query 参数**：
   ```http
   GET /api/v1/app/latest?app_id=com.example.app&token=your_fixed_token_here
   ```

若未开启 Token 校验，则无需传入任何 Token。

---

## 2. 客户端公开接口 (Client APIs)

### 2.1 App 版本检测升级接口

手机 App 启动时或点击“检查更新”时调用。

- **请求方法**：`GET`
- **接口路径**：`/api/v1/app/latest` 或 `/api/v1/version/check`
- **请求参数 (Query)**：
  | 参数名 | 类型 | 必填 | 说明 | 示例 |
  | :--- | :--- | :--- | :--- | :--- |
  | `app_id` | string | **是** | 应用唯一标识符 / 包名 | `com.example.myapp` |
  | `version_code` | int | 否 | 客户端当前安装的版本号 (整数)。若传入，服务端自动比对是否大于此值 | `10000` |
  | `channel` | string | 否 | 渠道标识，默认为 `default` | `official` / `googleplay` / `beta` |
  | `token` | string | 否 | 若开启 Token 校验且未放在 Header 中时传入 | `ygg_sec_xxx` |

- **成功响应示例 (`code: 0`)**：
  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "has_update": true,
      "is_force": false,
      "app_id": "com.example.myapp",
      "app_name": "掌上办公",
      "icon_url": "https://example.com/icon.png",
      "current_version_code": 10000,
      "latest_version_code": 10200,
      "latest_version_name": "1.2.0",
      "min_version_code": 10000,
      "channel": "default",
      "changelog": "- 优化文件下载速度与断点续传支持\n- 修复已知偶发崩溃Bug\n- 提升整体UI流畅度",
      "download_url": "https://ygg.example.com/api/v1/app/download?app_id=com.example.myapp&version_code=10200&channel=default",
      "file_name": "office-v1.2.0.apk",
      "file_size": 45829104,
      "file_md5": "e10adc3949ba59abbe56e057f20f883e",
      "file_sha256": null,
      "release_time": "2026-08-18T10:00:00Z"
    }
  }
  ```

- **关键字段解析与逻辑**：
  - `has_update` (`boolean`): 当 `latest_version_code > current_version_code` 时为 `true`，否则为 `false`。
  - `is_force` (`boolean`): 是否必须强制更新。以下两种情况之一成立时即为 `true`：
    1. 后台发布该版本时勾选了“强制更新 (`is_force_update = 1`)”；
    2. 客户端当前的 `current_version_code < min_version_code`（低于最低支持版本）。
  - `download_url` (`string`): APK 的完整下载 URL。
  - `file_md5` (`string`): 供客户端下载完成后校验文件完整性，防止被劫持或下载损坏。

- **错误响应示例 (应用不存在或未发布任何版本)**：
  ```json
  {
    "code": 404,
    "message": "App 'com.example.unknown' or published version not found for channel 'default'"
  }
  ```

---

### 2.2 App APK 下载接口 (支持 HTTP Range 206 续传)

- **请求方法**：`GET`
- **接口路径**：`/api/v1/app/download`
- **请求参数 (Query)**：
  | 参数名 | 类型 | 必填 | 说明 |
  | :--- | :--- | :--- | :--- |
  | `app_id` | string | **是** | 应用标识符 |
  | `version_code` | int | 否 | 指定下载的版本号，不传默认下载最新已发布版本 |
  | `channel` | string | 否 | 渠道标识，默认 `default` |
  | `token` | string | 否 | 若开启下载 Token 鉴权时传入 |

- **HTTP Range 206 断点续传协议规范**：
  - 支持请求头：`Range: bytes=start-end` 或 `Range: bytes=start-`
  - 响应状态码：
    - 全量下载：`200 OK`
    - 分片续传：`206 Partial Content`
  - 响应头部字段：
    ```http
    HTTP/1.1 206 Partial Content
    Content-Type: application/vnd.android.package-archive
    Accept-Ranges: bytes
    Content-Range: bytes 1048576-45829103/45829104
    Content-Length: 44780528
    Content-Disposition: attachment; filename="office-v1.2.0.apk"
    ETag: "e10adc3949ba59abbe56e057f20f883e"
    ```

---

### 2.3 通用文件元数据检测接口

用于查询通用静态文件（配置文件、补丁包、文档等）的最新大小、MD5 与下载地址。

- **请求方法**：`GET`
- **接口路径**：`/api/v1/files/check?alias=xxx` 或 `/api/v1/files/:id/check`
- **响应示例**：
  ```json
  {
    "code": 0,
    "message": "success",
    "data": {
      "id": "f_l9j1k2m3",
      "name": "app-config.json",
      "category": "config",
      "file_name": "config-v2.json",
      "file_size": 1284,
      "mime_type": "application/json",
      "file_md5": "9e107d9d372bb6826bd81d3542a419d6",
      "alias": "my-config",
      "download_count": 892,
      "download_url": "https://ygg.example.com/f/my-config",
      "created_at": "2026-08-18T12:00:00Z"
    }
  }
  ```

---

### 2.4 通用文件下载与短链接口

- **根据 ID 下载**：`GET /api/v1/files/:id/download`
- **根据别名短链下载**：`GET /f/:alias` （例如：`https://ygg.example.com/f/my-config`）
- 同样完整支持 HTTP Range 206 断点续传。

---

## 3. 管理端后台接口 (Admin APIs)

所有管理端接口（除登录外）均受 JWT 登录鉴权保护。
必须在请求头携带：`Authorization: Bearer <AdminJWTToken>` 或 Cookie `ygg_admin_session`。

### 3.1 登录与系统统计

#### 1. 管理员登录
- `POST /api/admin/login`
- Body (`application/json`):
  ```json
  { "password": "your_admin_password" }
  ```
- 响应：返回 `token`，并在响应头中设置 `Set-Cookie: ygg_admin_session=...; HttpOnly; Path=/`。

#### 2. 管理员登出
- `POST /api/admin/logout`
- 响应：清除 Cookie。

#### 3. 获取聚合数据统计
- `GET /api/admin/stats`
- 响应示例：
  ```json
  {
    "code": 0,
    "data": {
      "totalApps": 3,
      "totalVersions": 12,
      "totalFiles": 45,
      "totalStorageBytes": 1528910400,
      "totalDownloads": 9821
    }
  }
  ```

---

### 3.2 应用管理 (Apps CRUD)

| 接口 | 方法 | 路径 | 说明 |
| :--- | :--- | :--- | :--- |
| **应用列表** | `GET` | `/api/admin/apps` | 获取所有应用及其最新版本号和下载统计 |
| **应用详情** | `GET` | `/api/admin/apps/:appId` | 获取指定 `app_id` 详情 |
| **创建应用** | `POST` | `/api/admin/apps` | 创建新应用 (`app_id`, `name`, `icon_url`, `description`) |
| **修改应用** | `PUT` | `/api/admin/apps/:appId` | 更新应用名称、图标或描述 |
| **删除应用** | `DELETE` | `/api/admin/apps/:appId` | 级联删除应用、所有历史版本及 R2 中的所有 APK 对象 |

---

### 3.3 版本发布管理 (Versions CRUD)

#### 1. 发布新版本
- `POST /api/admin/apps/:appId/versions`
- Body:
  ```json
  {
    "version_code": 10200,
    "version_name": "1.2.0",
    "min_version_code": 10000,
    "channel": "default",
    "changelog": "- 优化下载性能\n- 修复Bug",
    "is_force_update": 0,
    "is_published": 1,
    "file_key": "apk/1723961234_abc123_app-v1.2.0.apk",
    "file_name": "app-v1.2.0.apk",
    "file_size": 45829104,
    "file_md5": "e10adc3949ba59abbe56e057f20f883e"
  }
  ```

#### 2. 获取某应用的历史版本列表
- `GET /api/admin/apps/:appId/versions`

#### 3. 编辑版本属性
- `PUT /api/admin/versions/:id`
- Body: 支持修改 `version_name`, `min_version_code`, `channel`, `changelog`, `is_force_update`, `is_published`。

#### 4. 删除版本
- `DELETE /api/admin/versions/:id`（同步从 R2 彻底删除该文件）

---

### 3.4 通用文件管理 (Files CRUD)

| 接口 | 方法 | 路径 | 说明 |
| :--- | :--- | :--- | :--- |
| **文件列表** | `GET` | `/api/admin/files?category=xxx&search=xxx&limit=50&offset=0` | 支持分页、分类过滤与搜索 |
| **分类列表** | `GET` | `/api/admin/categories` | 获取当前所有已有分类名 |
| **登记文件** | `POST` | `/api/admin/files` | 上传后登记元数据 (`name`, `category`, `alias`, `file_key`, `file_name`, `file_size`, `mime_type`, `file_md5`) |
| **修改文件** | `PUT` | `/api/admin/files/:id` | 修改文件名称、分类、别名或公开状态 |
| **删除文件** | `DELETE` | `/api/admin/files/:id` | 删除记录并清理 R2 对象 |

---

### 3.5 R2 对象上传 (直传与大文件分片)

#### 1. 标准表单直接上传 (适用于 < 80MB 文件)
- `POST /api/admin/upload/direct`
- Request: `multipart/form-data`
  - `file`: 二进制文件数据
  - `category`: 分类 (如 `apk` 或 `general`)
- 响应返回 `file_key`, `file_name`, `file_size`, `file_md5`, `mime_type`。

#### 2. 大文件分片上传 (Multipart Upload)
- **步骤 1：初始化分片**：`POST /api/admin/upload/multipart/init`
  - Body: `{ "fileName": "large-app.apk", "category": "apk" }`
  - 响应: `{ "upload_id": "...", "file_key": "..." }`
- **步骤 2：上传单个分片**：`PUT /api/admin/upload/multipart/part?uploadId=...&fileKey=...&partNumber=1`
  - Body: 分片二进制字节流
  - 响应: `{ "partNumber": 1, "etag": "..." }`
- **步骤 3：完成合并**：`POST /api/admin/upload/multipart/complete`
  - Body: `{ "upload_id": "...", "file_key": "...", "parts": [{ "partNumber": 1, "etag": "..." }, ...], "file_name": "...", "file_size": ... }`
- **步骤 4：中止清理 (可选)**：`POST /api/admin/upload/multipart/abort`

---

### 3.6 动态系统配置与 Token 管理

| 接口 | 方法 | 路径 | 说明 |
| :--- | :--- | :--- | :--- |
| **获取配置** | `GET` | `/api/admin/settings` | 获取所有动态 Token 开关与固定 Token 值 |
| **保存配置** | `PUT` | `/api/admin/settings` | 动态热更新 Token 与鉴权开关 |
| **生成随机 Token** | `POST` | `/api/admin/settings/generate-token` | 生成 24 字节高强度随机 Token |

---

## 4. 客户端集成接入代码示例

### 4.1 Android (Kotlin + OkHttp)

```kotlin
package com.example.app.updater

import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.util.concurrent.TimeUnit

data class UpdateInfo(
    val hasUpdate: Boolean,
    val isForce: Boolean,
    val latestVersionName: String,
    val latestVersionCode: Int,
    val changelog: String,
    val downloadUrl: String,
    val fileSize: Long,
    val fileMd5: String?
)

object YggAppUpdater {
    private val client = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    private const val BASE_URL = "https://your-yggdrasil.workers.dev"

    /**
     * 1. 检测最新版本
     */
    fun checkUpdate(
        appId: String,
        currentVersionCode: Int,
        channel: String = "default",
        apiToken: String? = null,
        callback: (Result<UpdateInfo?>) -> Unit
    ) {
        val url = "$BASE_URL/api/v1/app/latest?app_id=$appId&version_code=$currentVersionCode&channel=$channel"
        val requestBuilder = Request.Builder().url(url)
        
        if (!apiToken.isNullOrEmpty()) {
            requestBuilder.addHeader("X-Ygg-Token", apiToken)
        }

        client.newCall(requestBuilder.build()).enqueue(object : okhttp3.Callback {
            override fun onFailure(call: okhttp3.Call, e: java.io.IOException) {
                callback(Result.failure(e))
            }

            override fun onResponse(call: okhttp3.Call, response: okhttp3.Response) {
                try {
                    val body = response.body?.string() ?: ""
                    val json = JSONObject(body)
                    if (json.optInt("code") == 0) {
                        val d = json.getJSONObject("data")
                        val info = UpdateInfo(
                            hasUpdate = d.getBoolean("has_update"),
                            isForce = d.getBoolean("is_force"),
                            latestVersionName = d.getString("latest_version_name"),
                            latestVersionCode = d.getInt("latest_version_code"),
                            changelog = d.getString("changelog"),
                            downloadUrl = d.getString("download_url"),
                            fileSize = d.optLong("file_size", 0L),
                            fileMd5 = d.optString("file_md5", null)
                        )
                        callback(Result.success(info))
                    } else {
                        callback(Result.failure(Exception(json.optString("message", "Error"))))
                    }
                } catch (e: Exception) {
                    callback(Result.failure(e))
                }
            }
        })
    }

    /**
     * 2. 断点续传下载 APK
     */
    fun downloadApkWithResume(
        downloadUrl: String,
        targetFile: File,
        apiToken: String? = null,
        onProgress: (downloaded: Long, total: Long) -> Unit,
        onComplete: (File) -> Unit,
        onError: (Exception) -> Unit
    ) {
        var existingLength = 0L
        if (targetFile.exists()) {
            existingLength = targetFile.length()
        }

        val requestBuilder = Request.Builder()
            .url(downloadUrl)
            .addHeader("Range", "bytes=$existingLength-")

        if (!apiToken.isNullOrEmpty()) {
            requestBuilder.addHeader("X-Ygg-Token", apiToken)
        }

        client.newCall(requestBuilder.build()).enqueue(object : okhttp3.Callback {
            override fun onFailure(call: okhttp3.Call, e: java.io.IOException) {
                onError(e)
            }

            override fun onResponse(call: okhttp3.Call, response: okhttp3.Response) {
                if (response.code != 200 && response.code != 206) {
                    onError(Exception("Server returned HTTP ${response.code}"))
                    return
                }

                val totalLength = (response.body?.contentLength() ?: 0L) + existingLength
                var inputStream: InputStream? = null
                var outputStream: FileOutputStream? = null

                try {
                    inputStream = response.body?.byteStream()
                    outputStream = FileOutputStream(targetFile, existingLength > 0 && response.code == 206)
                    val buffer = ByteArray(8192)
                    var read: Int
                    var current = existingLength

                    while (inputStream!!.read(buffer).also { read = it } != -1) {
                        outputStream.write(buffer, 0, read)
                        current += read
                        onProgress(current, totalLength)
                    }
                    outputStream.flush()
                    onComplete(targetFile)
                } catch (e: Exception) {
                    onError(e)
                } finally {
                    inputStream?.close()
                    outputStream?.close()
                }
            }
        })
    }
}
```

---

### 4.2 Flutter (Dart + Dio)

```dart
import 'package:dio/dio.dart';

class YggdrasilService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'https://your-yggdrasil.workers.dev',
    connectTimeout: const Duration(seconds: 15),
  ));

  // 1. 版本检测
  Future<Map<String, dynamic>?> checkUpdate({
    required String appId,
    required int currentVersionCode,
    String channel = 'default',
    String? token,
  }) async {
    final response = await _dio.get(
      '/api/v1/app/latest',
      queryParameters: {
        'app_id': appId,
        'version_code': currentVersionCode,
        'channel': channel,
      },
      options: Options(
        headers: token != null ? {'X-Ygg-Token': token} : null,
      ),
    );

    if (response.data['code'] == 0) {
      return response.data['data'];
    }
    return null;
  }

  // 2. 下载 APK
  Future<void> downloadApk(
    String downloadUrl,
    String savePath, {
    String? token,
    Function(int received, int total)? onProgress,
  }) async {
    await _dio.download(
      downloadUrl,
      savePath,
      options: Options(
        headers: token != null ? {'X-Ygg-Token': token} : null,
      ),
      onReceiveProgress: onProgress,
    );
  }
}
```

---

### 4.3 iOS (Swift + URLSession)

```swift
import Foundation

struct CheckUpdateResponse: Codable {
    let code: Int
    let message: String
    let data: UpdateData?
}

struct UpdateData: Codable {
    let hasUpdate: Bool
    let isForce: Bool
    let latestVersionName: String
    let latestVersionCode: Int
    let changelog: String
    let downloadUrl: String

    enum CodingKeys: String, CodingKey {
        case hasUpdate = "has_update"
        case isForce = "is_force"
        case latestVersionName = "latest_version_name"
        case latestVersionCode = "latest_version_code"
        case changelog
        case downloadUrl = "download_url"
    }
}

func checkYggUpdate(appId: String, currentVersionCode: Int, token: String? = nil, completion: @escaping (UpdateData?) -> Void) {
    let urlString = "https://your-yggdrasil.workers.dev/api/v1/app/latest?app_id=\(appId)&version_code=\(currentVersionCode)"
    guard let url = URL(string: urlString) else { return }

    var request = URLRequest(url: url)
    if let token = token {
        request.setValue(token, forHTTPHeaderField: "X-Ygg-Token")
    }

    URLSession.shared.dataTask(with: request) { data, response, error in
        guard let data = data, error == nil else {
            completion(nil)
            return
        }
        if let res = try? JSONDecoder().decode(CheckUpdateResponse.self, from: data), res.code == 0 {
            completion(res.data)
        } else {
            completion(nil)
        }
    }.resume()
}
```

---

### 4.4 cURL 命令行速查

```bash
# 1. 模拟 App 检测最新版本
curl -s "https://your-yggdrasil.workers.dev/api/v1/app/latest?app_id=com.example.myapp&version_code=10000"

# 2. 携带 Token 检测版本
curl -s -H "X-Ygg-Token: your_secret_token" \
  "https://your-yggdrasil.workers.dev/api/v1/app/latest?app_id=com.example.myapp&version_code=10000"

# 3. HTTP Range 206 断点续传测试 (下载前 1024 字节)
curl -i -H "Range: bytes=0-1023" \
  "https://your-yggdrasil.workers.dev/api/v1/app/download?app_id=com.example.myapp"

# 4. 下载通用文件 (通过短链别名)
curl -O -L "https://your-yggdrasil.workers.dev/f/my-config"
```
