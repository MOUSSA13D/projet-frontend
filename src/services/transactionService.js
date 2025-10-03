// src/services/transactionService.js
import intercepteur from './intercepteur';

const transactionService = {
  // Effectuer un transfert d'argent
  effectuerTransfert: async (transfertData) => {
    try {
      const response = await intercepteur.post('/transaction/transfert', transfertData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors du transfert' };
    }
  },

  // Récupérer toutes les transactions
  getAllTransactions: async () => {
    try {
      const response = await intercepteur.get('/transaction/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération des transactions' };
    }
  },

  // Récupérer l'historique des transactions d'un compte
  getHistorique: async (acteurId) => {
    try {
      const response = await intercepteur.get(`/transaction/historique/${acteurId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de la récupération de l\'historique' };
    }
  },

  // Annuler un transfert
  annulerTransfert: async (transactionId, acteurId, acteurType) => {
    try {
      const response = await intercepteur.post(`/transaction/annuler/${transactionId}`, {
        acteur_id: acteurId,
        acteur_type: acteurType
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erreur lors de l\'annulation du transfert' };
    }
  }
};

export default transactionService;