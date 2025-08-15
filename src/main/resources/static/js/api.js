export function getUserId() {
  // Try sessionStorage first, fallback to localStorage
  return sessionStorage.getItem('userId') || localStorage.getItem('userId');
}

export async function authFetch(url, options = {}) {
  const userId = getUserId();
  const headers = options.headers ? { ...options.headers } : {};
  if (userId) {
    headers['X-User-ID'] = userId;
  }
  return fetch(url, { ...options, headers });
}
