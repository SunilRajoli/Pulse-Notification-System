const BASE = '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw {
      status: res.status,
      message: data.error || 'Request failed',
    };
  }

  return data;
}

export const api = {
  auth: {
    register: (body) => request('POST', '/auth/register', body),
    login: (body) => request('POST', '/auth/login', body),
  },
  posts: {
    list: () => request('GET', '/posts'),
    create: (body) => request('POST', '/posts', body),
  },
  likes: {
    like: (postId) => request('POST', `/posts/${postId}/like`),
    unlike: (postId) => request('DELETE', `/posts/${postId}/like`),
  },
  notifications: {
    list: () => request('GET', '/notifications'),
    markAllRead: () => request('PUT', '/notifications/read-all'),
  },
};

