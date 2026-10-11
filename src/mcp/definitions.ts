// ==============================================================================
// Yggdrasil (ygg) - MCP (Model Context Protocol) Tool Definitions
// ==============================================================================

export interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

export const YGG_MCP_TOOLS: McpToolDefinition[] = [
  {
    name: 'ygg_list_apps',
    description: '列出 Yggdrasil 中管理的所有移动应用，包含应用名称、包名(app_id)、最新版本号、最新版本名称、历史版本总数及累计总下载量。',
    inputSchema: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: '可选的应用名称或包名关键字过滤搜索'
        }
      }
    }
  },
  {
    name: 'ygg_get_app_details',
    description: '获取指定应用（通过 app_id / 包名）的详细配置与所有历史版本发布列表（包括版本号、渠道、更新日志、直链、反代设置及文件大小）。',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: {
          type: 'string',
          description: '应用的唯一包名 (如 com.norns.valhalla)'
        }
      },
      required: ['app_id']
    }
  },
  {
    name: 'ygg_check_update',
    description: '客户端检测更新模拟：传入应用 app_id、客户端当前版本号 version_code、发布渠道 channel、目标平台 platform 及架构 arch，检测是否有新版本可供升级，并返回最适合当前系统的下载直链与全平台安装包列表。',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: {
          type: 'string',
          description: '应用包名 (如 com.norns.valhalla)'
        },
        current_version_code: {
          type: 'number',
          description: '客户端当前版本号 (如 10000，默认为 0)'
        },
        channel: {
          type: 'string',
          description: '发布渠道 (如 default, beta, googleplay，默认为 default)'
        },
        platform: {
          type: 'string',
          description: '客户端操作系统平台 (如 android, windows, macos, linux, ios，默认为 universal/android)'
        },
        arch: {
          type: 'string',
          description: '客户端 CPU 架构 (如 universal, arm64-v8a, x86_64, apple-silicon)'
        }
      },
      required: ['app_id']
    }
  },
  {
    name: 'ygg_create_app',
    description: '在 Yggdrasil 中创建或注册一个新的应用项目。',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: {
          type: 'string',
          description: '应用唯一包名/Bundle ID (如 com.example.game)'
        },
        name: {
          type: 'string',
          description: '应用展示名称 (如 Valhalla)'
        },
        icon_url: {
          type: 'string',
          description: '可选的应用图标图片 URL'
        },
        description: {
          type: 'string',
          description: '可选的应用简介描述'
        }
      },
      required: ['app_id', 'name']
    }
  },
  {
    name: 'ygg_update_app',
    description: '更新已有应用的基本信息（如修改应用名称、图标链接或简介）。',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: {
          type: 'string',
          description: '目标应用包名'
        },
        name: {
          type: 'string',
          description: '新的应用展示名称'
        },
        icon_url: {
          type: 'string',
          description: '新的图标 URL'
        },
        description: {
          type: 'string',
          description: '新的简介描述'
        }
      },
      required: ['app_id']
    }
  },
  {
    name: 'ygg_delete_app',
    description: '删除指定应用及其名下所有历史版本和 R2 存储文件（操作不可逆，请谨慎）。',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: {
          type: 'string',
          description: '需要删除的应用包名'
        }
      },
      required: ['app_id']
    }
  },
  {
    name: 'ygg_publish_version',
    description: '为应用发布新版本。支持指定第三方下载直链（免上传到 R2，可配置边缘反代流式加速）或已上传到 R2 的文件 key。',
    inputSchema: {
      type: 'object',
      properties: {
        app_id: {
          type: 'string',
          description: '应用包名'
        },
        version_code: {
          type: 'number',
          description: '版本号整数 (必须递增，如 2)'
        },
        version_name: {
          type: 'string',
          description: '版本显示名称 (如 1.2.0)'
        },
        external_url: {
          type: 'string',
          description: '第三方 APK/ZIP 下载直链 (如 GitHub Release 直链、CDN 直链)'
        },
        use_proxy: {
          type: 'boolean',
          description: '是否开启边缘反向代理流式加速 (true=由 Worker 代理流式传输隐藏源站并支持断点续传，false=302 重定向)'
        },
        channel: {
          type: 'string',
          description: '发布渠道 (默认 default)'
        },
        changelog: {
          type: 'string',
          description: '版本更新日志说明'
        },
        min_version_code: {
          type: 'number',
          description: '最低兼容版本号 (低于此版本号的旧客户端将被强制更新，默认 0)'
        },
        is_force_update: {
          type: 'boolean',
          description: '是否标记为全量强制更新'
        },
        file_name: {
          type: 'string',
          description: '客户端下载时保存的文件名 (如 app-v1.2.apk)'
        },
        file_size: {
          type: 'number',
          description: '文件大小 (字节数)'
        },
        platform: {
          type: 'string',
          description: '主包平台标识 (如 android, windows, macos, linux, ios，默认为 android)'
        },
        arch: {
          type: 'string',
          description: '主包 CPU 架构 (如 universal, arm64-v8a, x86_64，默认为 universal)'
        }
      },
      required: ['app_id', 'version_code', 'version_name']
    }
  },
  {
    name: 'ygg_update_version',
    description: '修改已有发布版本的属性（如修改更新日志、调整第三方下载直链、切换反代加速开关、修改上下架状态等）。',
    inputSchema: {
      type: 'object',
      properties: {
        version_id: {
          type: 'string',
          description: '版本唯一 ID (如 ver_xxx，可通过 ygg_get_app_details 获取)'
        },
        version_name: {
          type: 'string',
          description: '修改版本显示名称'
        },
        channel: {
          type: 'string',
          description: '修改发布渠道'
        },
        min_version_code: {
          type: 'number',
          description: '修改最低兼容版本号'
        },
        changelog: {
          type: 'string',
          description: '修改版本更新日志'
        },
        external_url: {
          type: 'string',
          description: '修改第三方下载直链 (填空字符串可清除外链)'
        },
        use_proxy: {
          type: 'boolean',
          description: '修改是否开启反向代理加速'
        },
        is_force_update: {
          type: 'boolean',
          description: '修改是否强制更新'
        },
        is_published: {
          type: 'boolean',
          description: '修改上架/发布状态 (false 为已下架)'
        },
        file_name: {
          type: 'string',
          description: '修改下载保存文件名'
        }
      },
      required: ['version_id']
    }
  },
  {
    name: 'ygg_delete_version',
    description: '删除指定版本记录及对应的 R2 存储文件。',
    inputSchema: {
      type: 'object',
      properties: {
        version_id: {
          type: 'string',
          description: '需要删除的版本唯一 ID'
        }
      },
      required: ['version_id']
    }
  },
  {
    name: 'ygg_get_system_stats',
    description: '获取 Yggdrasil 系统的全局运行概况（总应用数、总版本数、累计总下载量、存储占用量）。',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'ygg_trigger_cleanup',
    description: '手动触发或强制执行旧版本安装包清理策略，扫描超期旧版本物理清理 R2 存储，释放空间并保留完整历史记录。',
    inputSchema: {
      type: 'object',
      properties: {
        days: {
          type: 'number',
          description: '保留天数 (超过此天数的旧版本将被清理，默认 90)'
        },
        keep_latest: {
          type: 'number',
          description: '每个渠道至少保留的最新版本数 (默认 3)'
        },
        force: {
          type: 'boolean',
          description: '是否强制执行 (忽略系统自动清理开关，直接按所传天数执行)'
        }
      }
    }
  },
  {
    name: 'ygg_list_files',
    description: '列出通用文件管理列表中的所有文件资源（配置、文档、通用安装包等）。',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: '文件分类过滤 (如 general, config, apk)'
        }
      }
    }
  },
  {
    name: 'ygg_add_version_package',
    description: '为指定应用版本附加新的多平台或多架构分发安装包（如 Windows x86_64、Android arm64-v8a、macOS Apple Silicon 等）。',
    inputSchema: {
      type: 'object',
      properties: {
        version_id: {
          type: 'string',
          description: '所属版本的唯一 ID (如 ver_xxx)'
        },
        platform: {
          type: 'string',
          description: '目标操作系统平台 (android, windows, macos, linux, ios, universal)'
        },
        arch: {
          type: 'string',
          description: '目标 CPU 架构 (universal, arm64-v8a, armeabi-v7a, x86_64, x86, apple-silicon)'
        },
        external_url: {
          type: 'string',
          description: '第三方安装包下载直链 (免上传)'
        },
        use_proxy: {
          type: 'boolean',
          description: '是否开启边缘反向代理流式加速'
        },
        file_key: {
          type: 'string',
          description: '已上传至 R2 的存储 Key'
        },
        file_name: {
          type: 'string',
          description: '下载时保存的文件名'
        },
        file_size: {
          type: 'number',
          description: '文件大小 (字节数)'
        },
        file_md5: {
          type: 'string',
          description: 'MD5 校验和'
        },
        file_sha256: {
          type: 'string',
          description: 'SHA256 校验和'
        }
      },
      required: ['version_id', 'platform', 'arch']
    }
  },
  {
    name: 'ygg_delete_version_package',
    description: '删除指定应用版本名下的某个分发安装包并物理删除对应 R2 存储。',
    inputSchema: {
      type: 'object',
      properties: {
        package_id: {
          type: 'string',
          description: '需要删除的分发安装包唯一 ID (如 pkg_xxx)'
        }
      },
      required: ['package_id']
    }
  }
];
