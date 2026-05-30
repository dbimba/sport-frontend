import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getProducts       = (params) => api.get('/products', { params });
export const createProduct     = (data)   => api.post('/products', data);
export const deleteProduct     = (id)     => api.delete(`/products/${id}`);

export const registerUser = (data) => api.post('/register', data);
export const loginUser    = (data) => api.post('/login', data);
export const logoutUser   = ()     => api.post('/logout');

export const createTransaction       = (formData) =>
  api.post('/transactions', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getTransactions         = ()           => api.get('/transactions');
export const updateTransactionStatus = (id, status) => api.patch(`/transactions/${id}/status`, { status });
export const deleteTransaction       = (id)         => api.delete(`/transactions/${id}`);

export default api;
