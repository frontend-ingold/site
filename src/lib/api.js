const API_BASE_URL = import.meta.env.DEV
  ? ''
  : (import.meta.env.VITE_API_BASE_URL || 'https://wolmart-api.vercel.app');

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || `Request failed: ${response.status}`);
  }

  return payload;
}

export async function getPageData() {
  return requestJson('/api/page-data');
}

export function registerUser(user) {
  return requestJson('/api/users?action=register', {
    method: 'POST',
    body: JSON.stringify(user)
  });
}

export function loginUser(credentials) {
  return requestJson('/api/users?action=login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

export function getPasswordHint(email) {
  return requestJson('/api/users?action=forgot', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export function updateUserProfile(profile) {
  return requestJson('/api/users', {
    method: 'PATCH',
    body: JSON.stringify(profile)
  });
}

export function getOrders(userId) {
  return requestJson(`/api/orders?userId=${encodeURIComponent(userId)}`);
}

export function createOrder(order) {
  return requestJson('/api/orders', {
    method: 'POST',
    body: JSON.stringify(order)
  });
}
