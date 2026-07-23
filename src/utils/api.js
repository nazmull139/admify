// ============================================
// CORE API CLIENT
// Thin wrapper around fetch() that:
//  - prefixes every call with the backend base URL
//  - attaches the JWT (if present) as a Bearer token
//  - parses JSON responses and throws on non-2xx so callers can try/catch
//  - supports both JSON bodies and FormData (file uploads)
// ============================================

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'studyai_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

/**
 * apiRequest('/student/profile', { method: 'PUT', body: {...} })
 * apiRequest('/student/upload-document', { method: 'POST', body: formData, isFormData: true })
 */
export async function apiRequest(path, { method = 'GET', body, isFormData = false, params } = {}) {
  let url = `${API_BASE_URL}${path}`;

  if (params && Object.keys(params).length) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    if (query) url += `?${query}`;
  }

  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let fetchBody;
  if (isFormData) {
    fetchBody = body; // browser sets multipart boundary automatically
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    fetchBody = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, { method, headers, body: fetchBody });
  } catch (networkErr) {
    throw new Error('Could not reach the server. Is the backend running on ' + API_BASE_URL + '?');
  }

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => null);
  }

  if (!response.ok) {
    // Session expired / invalid token → clear it so the app can redirect to login
    if (response.status === 401) setToken(null);
    const message = data?.message || `Request failed (${response.status})`;
    const err = new Error(message);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const get = (path, params) => apiRequest(path, { method: 'GET', params });
export const post = (path, body, opts = {}) => apiRequest(path, { method: 'POST', body, ...opts });
export const put = (path, body, opts = {}) => apiRequest(path, { method: 'PUT', body, ...opts });
export const patch = (path, body, opts = {}) => apiRequest(path, { method: 'PATCH', body, ...opts });
export const del = (path, params) => apiRequest(path, { method: 'DELETE', params });
