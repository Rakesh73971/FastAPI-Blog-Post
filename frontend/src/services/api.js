import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    const response = await axios.post(`${API_URL}/login`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
  signup: async (email, password) => {
    const response = await api.post('/users/', { email, password });
    return response.data;
  },
};

// Posts API
export const postsAPI = {
  getAll: async (limit = 10, skip = 0, search = '') => {
    const response = await api.get('/posts/', {
      params: { limit, skip, search },
    });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  create: async (postData) => {
    const response = await api.post('/posts/', postData);
    return response.data;
  },
  update: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/posts/${id}`);
  },
};

// Users API
export const usersAPI = {
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

// Votes API
export const votesAPI = {
  vote: async (postId, direction) => {
    const response = await api.post('/vote/', {
      post_id: postId,
      dir: direction,
    });
    return response.data;
  },
};

export default api;