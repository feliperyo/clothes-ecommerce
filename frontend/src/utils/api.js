import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('anacurve_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('anacurve_admin_token');
      localStorage.removeItem('anacurve_admin_user');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// === PRODUTOS ===

export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getFeaturedProducts = async () => {
  const response = await api.get('/products/featured');
  return response.data;
};

export const getPromotionProducts = async () => {
  const response = await api.get('/products/promotions');
  return response.data;
};

export const getProductsByCategory = async (category) => {
  const response = await api.get(`/products/category/${category}`);
  return response.data;
};

// === PEDIDOS ===

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const getOrderByNumber = async (orderNumber) => {
  const response = await api.get(`/orders/${orderNumber}`);
  return response.data;
};

// === ADMIN - AUTENTICAÇÃO ===

export const adminLogin = async (credentials) => {
  const response = await api.post('/admin/login', credentials);
  return response.data;
};

export const getDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

// === ADMIN - PRODUTOS ===

export const getAllProductsAdmin = async () => {
  const response = await api.get('/admin/products');
  return response.data;
};

export const createProduct = async (formData) => {
  const response = await api.post('/admin/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const response = await api.put(`/admin/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
};

export const toggleFeatured = async (id) => {
  const response = await api.patch(`/admin/products/${id}/featured`);
  return response.data;
};

export const togglePromotion = async (id) => {
  const response = await api.patch(`/admin/products/${id}/promotion`);
  return response.data;
};

// === ADMIN - PEDIDOS ===

export const getAllOrders = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/admin/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, statusData) => {
  const response = await api.patch(`/admin/orders/${id}/status`, statusData);
  return response.data;
};

export const updateTracking = async (id, trackingCode) => {
  const response = await api.patch(`/admin/orders/${id}/tracking`, { trackingCode });
  return response.data;
};

// === UTILIDADES ===

// Buscar CEP via ViaCEP (API externa)
export const fetchAddressByCep = async (cep) => {
  try {
    const cleanCep = cep.replace(/\D/g, '');
    const response = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (response.data.erro) {
      throw new Error('CEP não encontrado');
    }
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar CEP');
  }
};

export default api;
