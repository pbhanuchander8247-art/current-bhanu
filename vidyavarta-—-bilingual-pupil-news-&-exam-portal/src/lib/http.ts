/**
 * Safely reads and parses a Fetch Response body as JSON without throwing
 * "Unexpected end of JSON input" on empty, aborted, or non-JSON responses.
 */
export async function readJsonSafe<T = Record<string, unknown>>(
  res: Response
): Promise<T | null> {
  try {
    const raw = await res.text();
    if (!raw || !raw.trim()) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export interface ApiJsonResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  errorMessage: string | null;
}

function parseJsonString<T>(raw: string): T | null {
  try {
    if (!raw || !raw.trim()) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

const SESSION_TOKEN_KEY = 'bcr_portal_session_token_v1';
const DEVICE_TOKEN_KEY = 'bcr_portal_device_token_v1';

export function getPortalTokens(): { sessionToken: string | null; deviceToken: string | null } {
  try {
    return {
      sessionToken: window.localStorage.getItem(SESSION_TOKEN_KEY),
      deviceToken: window.localStorage.getItem(DEVICE_TOKEN_KEY),
    };
  } catch {
    return { sessionToken: null, deviceToken: null };
  }
}

export function savePortalTokens(tokens: { sessionToken?: string | null; deviceToken?: string | null }): void {
  try {
    if (typeof tokens.sessionToken === 'string' && tokens.sessionToken.trim()) {
      window.localStorage.setItem(SESSION_TOKEN_KEY, tokens.sessionToken.trim());
    }
    if (typeof tokens.deviceToken === 'string' && tokens.deviceToken.trim()) {
      window.localStorage.setItem(DEVICE_TOKEN_KEY, tokens.deviceToken.trim());
    }
  } catch {
    // ignore storage quota errors
  }
}

export function clearPortalTokens(forgetDevice = false): void {
  try {
    window.localStorage.removeItem(SESSION_TOKEN_KEY);
    if (forgetDevice) {
      window.localStorage.removeItem(DEVICE_TOKEN_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

function captureAuthTokensFromPayload(url: string, data: unknown): void {
  if (!url.startsWith('/api/auth/') || !data || typeof data !== 'object') return;
  const obj = data as { sessionToken?: unknown; deviceToken?: unknown };
  if (typeof obj.sessionToken === 'string' || typeof obj.deviceToken === 'string') {
    savePortalTokens({
      sessionToken: typeof obj.sessionToken === 'string' ? obj.sessionToken : null,
      deviceToken: typeof obj.deviceToken === 'string' ? obj.deviceToken : null,
    });
  }
}

function xhrRequest(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string
): Promise<{ ok: boolean; status: number; text: string }> {
  return new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.withCredentials = true;
      xhr.timeout = 45000;
      for (const [k, v] of Object.entries(headers)) {
        xhr.setRequestHeader(k, v);
      }
      xhr.onload = () => {
        resolve({
          ok: xhr.status >= 200 && xhr.status < 300,
          status: xhr.status,
          text: xhr.responseText || '',
        });
      };
      xhr.onerror = () => reject(new Error('Network connection interrupted.'));
      xhr.ontimeout = () => reject(new Error('Verification request timed out.'));
      xhr.send(body ?? null);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Performs a JSON API request via fetch with automatic XMLHttpRequest fallback
 * and automatic Bearer/device token transport for iframe contexts where cookies may be dropped.
 */
export async function apiJsonRequest<T = Record<string, unknown> & { error?: string }>(
  url: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
  } = {}
): Promise<ApiJsonResult<T>> {
  const method = options.method || 'GET';
  const tokens = getPortalTokens();
  const authHeaders: Record<string, string> = {};
  if (url.startsWith('/api/')) {
    if (tokens.sessionToken) authHeaders.Authorization = `Bearer ${tokens.sessionToken}`;
    if (tokens.deviceToken) authHeaders['X-Portal-Device'] = tokens.deviceToken;
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...authHeaders,
    ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
  };
  const bodyStr = options.body !== undefined ? JSON.stringify(options.body) : undefined;

  let status = 0;
  let ok = false;
  let raw = '';

  try {
    const res = await fetch(url, {
      method,
      headers,
      body: bodyStr,
      credentials: 'same-origin',
      cache: 'no-store',
    });
    status = res.status;
    ok = res.ok;
    raw = await res.text();
  } catch {
    // Fall back to XMLHttpRequest below
  }

  let data = parseJsonString<T>(raw);

  // Fallback to XMLHttpRequest if fetch failed, returned empty body, or received non-JSON HTML proxy response
  if (status === 0 || !raw.trim() || !data) {
    try {
      const xhrRes = await xhrRequest(url, method, headers, bodyStr);
      if (xhrRes.status > 0 && xhrRes.text.trim()) {
        const xhrData = parseJsonString<T>(xhrRes.text);
        if (xhrData) {
          if (xhrRes.ok) captureAuthTokensFromPayload(url, xhrData);
          return {
            ok: xhrRes.ok,
            status: xhrRes.status,
            data: xhrData,
            errorMessage:
              !xhrRes.ok
                ? ((xhrData as { error?: string }).error || `Request failed (HTTP ${xhrRes.status}).`)
                : null,
          };
        }
        status = xhrRes.status;
        ok = xhrRes.ok;
      }
    } catch (xhrErr) {
      if (status === 0) {
        return {
          ok: false,
          status: 0,
          data: null,
          errorMessage:
            xhrErr instanceof Error ? xhrErr.message : 'Unable to reach verification server.',
        };
      }
    }
  }

  if (ok && data) {
    captureAuthTokensFromPayload(url, data);
  }

  const extractedError =
    data && typeof data === 'object' && 'error' in data && typeof (data as { error?: unknown }).error === 'string'
      ? (data as { error: string }).error
      : null;

  return {
    ok,
    status,
    data,
    errorMessage:
      !ok || !data
        ? extractedError ||
          (status > 0
            ? `Verification server returned HTTP ${status}. Please try again.`
            : 'Unable to reach verification server. Please reload and try again.')
        : null,
  };
}
