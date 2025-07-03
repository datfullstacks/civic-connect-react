import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies for JWT
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest?.url || '';
    // Early return for login/register 401 (do not reload page)
    if (url.includes('auth/login') || url.includes('auth/register')) {
      return Promise.reject(error);
    }
    // Prevent infinite loop: if refresh endpoint itself fails, logout
    if (url.includes('auth/refresh')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      // window.location.href = '/login'; // Commented out for debug
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await api.post('/api/auth/refresh');
        const { accessToken } = refreshResponse.data.tokens;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        // window.location.href = '/login'; // Commented out for debug
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  getMe: () => api.get('/api/auth/me'),
  refresh: () => api.post('/api/auth/refresh'),
};

// Posts API endpoints
export const postsAPI = {
  getPosts: () => api.get('/api/posts'),
  createPost: (postData) => api.post('/api/posts', postData),
  updatePost: (id, postData) => api.put(`/api/posts/${id}`, postData),
  deletePost: (id) => api.delete(`/api/posts/${id}`),
  getPost: (id) => api.get(`/api/posts/${id}`),
};

// Users API endpoints
export const usersAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getUserProfile: (userId) => api.get(`/users/${userId}/profile`),
  jwtTest: () => api.get('/users/jwt-test'),
};

// Chat API endpoints
export const chatAPI = {
  getUserChats: (page = 1, limit = 10) => api.get(`/api/chats?page=${page}&limit=${limit}`),
  getOrCreateChat: (userId) => api.get(`/api/chats/${userId}`),
  getChatMessages: (chatId, page = 1, limit = 50) => api.get(`/api/chats/${chatId}/messages?page=${page}&limit=${limit}`),
  sendMessage: (chatId, content, messageType = 'text') => api.post(`/api/chats/${chatId}/messages`, { content, messageType }),
  deleteMessage: (messageId) => api.delete(`/api/chats/messages/${messageId}`),
  getUnreadCount: () => api.get('/api/chats/unread-count'),
};

// Đăng ký user (hàm tiện lợi cho import trực tiếp)
export const registerUser = (userData) => authAPI.register(userData);

export const employerAPI = {
  getAcceptedApplicants: () => api.get('/users/accepted-applicants'),
};

export default api; 