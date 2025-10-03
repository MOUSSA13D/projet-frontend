// src/services/profileService.js
import intercepteur from './intercepteur';
import authService from './authService';

const profileService = {
  // Récupérer le profil de l'utilisateur connecté
  getProfile: async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('Utilisateur non connecté');
      }

      const response = await intercepteur.get(`/agent/${user.id}`);
      
      // Mettre à jour les données dans le localStorage
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération du profil' };
    }
  },

  // Mettre à jour le profil (nom, prénom, email)
  updateProfile: async (profileData) => {
    try {
      const user = authService.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('Utilisateur non connecté');
      }

      const response = await intercepteur.put(`/agent/${user.id}`, profileData);
      
      // Mettre à jour les données dans le localStorage
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du profil' };
    }
  },

  // Changer le mot de passe
  changePassword: async (passwordData) => {
    try {
      const user = authService.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('Utilisateur non connecté');
      }

      const response = await intercepteur.patch(`/agent/${user.id}/password`, passwordData);
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors du changement de mot de passe' };
    }
  }
};

export default profileService;