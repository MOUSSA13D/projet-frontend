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
        
        return response.data; // ✅ Retourner les données en cas de succès
      } else {
        // ✅ Si success est false, on lance une erreur
        throw new Error(response.data.message || 'Identifiant ou mot de passe incorrect');
      }
    } catch (error) {
      // ✅ Propager l'erreur correctement
      console.error('Erreur authService.login:', error);
      
      // Si c'est une erreur réseau ou serveur
      if (error.response?.data) {
        throw {
          message: error.response.data.message || 'Identifiant ou mot de passe incorrect',
          ...error.response.data
        };
      }
      
      // Si c'est une erreur lancée manuellement
      if (error.message) {
        throw error;
      }
      
      // Erreur par défaut
      throw new Error('Erreur de connexion au serveur');
    }
  },

  setCurrentUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
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

  // Mettre à jour les données utilisateur
  updateUserData: (newData) => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...newData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }
};

export default authService;