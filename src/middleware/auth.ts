// ==============================================================================
// Yggdrasil (ygg) - Admin Authentication & Web Crypto JWT
// ==============================================================================

import { MiddlewareHandler } from 'hono';
import { Env, AdminJwtPayload } from '../types';
import { DEFAULT_CONFIG } from '../config/constants';

// --- Web Crypto HMAC-SHA256 JWT 工具函数 ---

function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return atob(str);
}

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signJwt(payload: Record<string, any>, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const key = await getCryptoKey(secret);
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  const signatureBytes = String.fromCharCode(...new Uint8Array(signatureBuffer));
  const encodedSignature = base64UrlEncode(signatureBytes);

  return `${data}.${encodedSignature}`;
}

export async function verifyJwt<T = any>(token: string, secret: string): Promise<T | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const data = `${encodedHeader}.${encodedPayload}`;

    const key = await getCryptoKey(secret);
    
    // 还原签名 buffer
    const binarySignature = base64UrlDecode(encodedSignature);
    const signatureBytes = new Uint8Array(binarySignature.length);
    for (let i = 0; i < binarySignature.length; i++) {
      signatureBytes[i] = binarySignature.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes, new TextEncoder().encode(data));
    if (!isValid) return null;

    const payloadJson = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(payloadJson) as T & { exp?: number };

    // 校验过期时间
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null;
    }

    return payload as T;
  } catch (e) {
    return null;
  }
}

// --- 管理员中间件 ---

export const adminAuthMiddleware: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  const authHeader = c.req.header('authorization');
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else {
    // 尝试从 Cookie 获取
    const cookieHeader = c.req.header('cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${DEFAULT_CONFIG.COOKIE_NAME}=([^;]+)`));
      if (match) {
        token = match[1];
      }
    }
  }

  if (!token) {
    return c.json({ code: 401, message: 'Unauthorized: Admin authentication token required' }, 401);
  }

  const jwtSecret = c.env.JWT_SECRET || DEFAULT_CONFIG.DEFAULT_JWT_SECRET;
  const payload = await verifyJwt<AdminJwtPayload>(token, jwtSecret);

  if (!payload || payload.role !== 'admin') {
    return c.json({ code: 401, message: 'Unauthorized: Invalid or expired session' }, 401);
  }

  // 挂载到 Context 供后续路由使用
  c.set('adminUser', payload);
  await next();
};
