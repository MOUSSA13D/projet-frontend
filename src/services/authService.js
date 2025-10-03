// src/services/authService.js
import intercepteur from './intercepteur';

const authService = {
  // Connexion
  login: async (identifiant, mot_de_passe) => {
    try {
      const response = await intercepteur.post('/login', {
        identifiant,
        mot_de_passe
      });
      
      // Stocker le token et les données utilisateur
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        localStorage.setItem('userType', response.data.type);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur de connexion' };
    }
  },

   setCurrentUser: (user) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },
  // Déconnexion
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    window.location.href = '/login';
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Récupérer l'utilisateur actuel
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Récupérer le type d'utilisateur
  getUserType: () => {
    return localStorage.getItem('userType');
  },

  // Nouvelle méthode pour mettre à jour les données utilisateur
  updateUserData: (newData) => {
    const currentUser = authService.getCurrentUser();
      if (currentUser) {
    const updatedUser = { ...currentUser, ...newData };
    
  }
  }
};

export default authService;
