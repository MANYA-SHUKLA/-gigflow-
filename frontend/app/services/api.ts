import axios from 'axios';

// Use environment variable NEXT_PUBLIC_API_URL if provided, otherwise default to localhost.

const host = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
const API_BASE_URL = host.replace(/\/$/, '') + '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      // Avoid forcing navigation during auth bootstrap (e.g. /auth/check on refresh)
      // but keep the behavior for other protected calls.
      const path = window.location.pathname;
      const isAuthPage = path.startsWith('/login') || path.startsWith('/register');
      const isPublicPage = path === '/';

      // Only force login redirect for protected areas.
      // This keeps the landing page (/) accessible when logged out.
      if (!isAuthPage && !isPublicPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  check: () => api.get('/auth/check'),
};

// Gig endpoints
export const gigAPI = {
  getGigs: (params?: { search?: string; status?: string }) =>
    api.get('/gigs', { params }),
  getGig: (id: string) => api.get(`/gigs/${id}`),
  getMyGigs: (params?: { status?: string }) =>
    api.get('/gigs/user/my-gigs', { params }),
  createGig: (data: { title: string; description: string; budget: number }) =>
    api.post('/gigs', data),
  updateGig: (id: string, data: unknown) => api.put(`/gigs/${id}`, data),
  deleteGig: (id: string) => api.delete(`/gigs/${id}`),
};

// Bid endpoints
export const bidAPI = {
  getBidsByGig: (gigId: string) => api.get(`/bids/${gigId}`),
  getUserBids: () => api.get('/bids/user/my-bids'),
  createBid: (data: { gigId: string; message: string; price: number }) =>
    api.post('/bids', data),
  hireFreelancer: (bidId: string) => api.patch(`/bids/${bidId}/hire`),
};

export default api;