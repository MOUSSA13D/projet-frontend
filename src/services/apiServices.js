// src/services/apiService.js
import intercepteur from './intercepteur';

const apiService = {
  // Méthodes génériques
  get: async (endpoint) => {
    try {
      const response = await intercepteur.get(endpoint);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await intercepteur.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await intercepteur.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await intercepteur.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },




  
  // Exemples de méthodes spécifiques
  getClients: async () => {
    return await apiService.get('/clients');
  },

  getTransactions: async () => {
    return await apiService.get('/transactions');
  },

  createTransaction: async (data) => {
    return await apiService.post('/transactions', data);
  },

  cancelTransaction: async (id) => {
    return await apiService.delete(`/transactions/${id}`);
  },

  getUserProfile: async () => {
    return await apiService.get('/profile');
  }
};

export default apiService;