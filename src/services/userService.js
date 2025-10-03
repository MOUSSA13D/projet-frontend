// src/services/userService.js
import intercepteur from './intercepteur';

const userService = {
  // Récupérer tous les utilisateurs (clients et distributeurs)
  getAllUsers: async () => {
    try {
      const response = await intercepteur.get('/utilisateur/allUtilisateur');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des utilisateurs' };
    }
  },

  // Récupérer tous les agents
  getAllAgents: async () => {
    try {
      const response = await intercepteur.get('/agent/allAgent');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des agents' };
    }
  },

  // Créer un utilisateur (client ou distributeur)
  createUser: async (formData) => {
    try {
      const response = await intercepteur.post('/utilisateur/creerutilisateur', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la création de l\'utilisateur' };
    }
  },

  // Mettre à jour un utilisateur
  updateUser: async (id, formData) => {
    try {
      const response = await intercepteur.put(`/utilisateur/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour de l\'utilisateur' };
    }
  },

  // Mettre à jour le statut d'un utilisateur
  updateStatus: async (id, statut) => {
    try {
      const response = await intercepteur.put(`/utilisateur/statut/${id}`, { statut });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour du statut' };
    }
  },

  // Supprimer un utilisateur
  deleteUser: async (id) => {
    try {
      const response = await intercepteur.delete(`/utilisateur/supprimerUtilisateur/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression de l\'utilisateur' };
    }
  },

  // Supprimer plusieurs utilisateurs
  deleteManyUsers: async (ids) => {
    try {
      const response = await intercepteur.post('/utilisateur/delete-many', { ids });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la suppression multiple' };
    }
  },

  // Mettre à jour le statut de plusieurs utilisateurs
  updateManyStatuses: async (ids, statut) => {
    try {
      const response = await intercepteur.post('/utilisateur/update-many-statuses', { 
        ids, 
        statut 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la mise à jour multiple des statuts' };
    }
  },

  // Calculer les statistiques
  getStatistics: async () => {
    try {
      const [usersResponse, agentsResponse] = await Promise.all([
        userService.getAllUsers(),
        userService.getAllAgents()
      ]);

      const users = usersResponse.data || [];
      const agents = agentsResponse.data || [];

      const totalClients = users.filter(user => user.role === 'client').length;
      const totalDistributeurs = users.filter(user => user.role === 'distributeur').length;
      const totalAgents = agents.length;

      return {
        totalClients,
        totalDistributeurs,
        totalAgents,
        users,
        agents
      };
    } catch (error) {
      throw error;
    }
  }
};

export default userService;