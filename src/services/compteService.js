// src/services/compteService.js
import intercepteur from './intercepteur';

const compteService = {
  // Récupérer tous les comptes
  getAllComptes: async () => {
    try {
      const response = await intercepteur.get('/compte/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des comptes' };
    }
  },

  // Récupérer un compte par numéro
  getCompteByNumber: async (numero) => {
    try {
      const response = await intercepteur.get(`/compte/numero/${numero}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération du compte' };
    }
  },

  // Récupérer un compte par ID utilisateur
  getCompteByUserId: async (userId) => {
    try {
      const response = await intercepteur.get(`/compte/compte/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération du compte' };
    }
  }
};

export default compteService;