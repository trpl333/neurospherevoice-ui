/*
 * Unified API client for the NeuroSphere UI
 *
 * This helper reads the base API URL from `import.meta.env.VITE_API_URL`,
 * ensures that it always ends with `/api`, automatically includes
 * credentials on every request and wraps common HTTP methods with
 * minimal error handling.  All GET and POST requests return the
 * parsed JSON response or throw an error with a useful message if
 * the request fails.  Use this module throughout the frontend to
 * avoid hard‑coding URLs and to centralise fetch logic.
 */

// Normalise the base URL by stripping trailing slashes and appending
// `/api` when missing.  This allows both `https://example.com` and
// `https://example.com/api` to be provided via VITE_API_URL.
function normaliseBase(url: string | undefined): string {
  let base = url || '';
  // Trim whitespace
  base = base.trim();
  // Remove any trailing slash
  if (base.endsWith('/')) {
    base = base.slice(0, -1);
  }
  // Append `/api` if not already present
  if (base && !base.endsWith('/api')) {
    base = `${base}/api`;
  }
  return base;
}

// Determine the base URL once at import time
const API_BASE = normaliseBase(import.meta.env.VITE_API_URL);

// Construct a full URL for a relative path.  Leading slashes are
// respected so `'/auth/login'` becomes `${API_BASE}/auth/login`.
function buildUrl(path: string): string {
  const cleaned = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${cleaned}`;
}

// Generic response handler.  Attempts to parse JSON when possible
// and throws an Error when the HTTP status indicates failure.  The
// error’s message will be derived from the response body if a
// `message` or `error` field is present; otherwise it falls back
// to the native statusText.
async function handleResponse(response: Response): Promise<any> {
  const text = await response.text();
  let data: any = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    // Not JSON – leave as text
    data = text;
  }
  if (!response.ok) {
    const message = (data && (data.message || data.error)) || response.statusText;
    throw new Error(message);
  }
  return data;
}

async function get<T = any>(path: string): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: 'GET',
    credentials: 'include'
  });
  return handleResponse(res) as T;
}

async function post<T = any>(path: string, body?: any): Promise<T> {
  const res = await fetch(buildUrl(path), {
    method: 'POST',
    credentials: 'include',
    headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });
  return handleResponse(res) as T;
}

export default {
  get,
  post
};