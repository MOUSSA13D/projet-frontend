// src/hooks/useLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const useLogin = () => {
  const [formData, setFormData] = useState({
    identifiant: '',
    mot_de_passe: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    console.log('🔵 handleSubmit appelé');
    
    // ✅ IMPORTANT : Empêcher le comportement par défaut du formulaire
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      console.log('✅ preventDefault et stopPropagation appelés');
    }
    
    setLoading(true);
    setError(null);
    console.log('🔵 Loading activé, erreur réinitialisée');

    try {
      console.log('🔵 Appel authService.login...');
      const response = await authService.login(
        formData.identifiant,
        formData.mot_de_passe
      );

      console.log('🔵 Réponse reçue:', response);

      // ✅ Vérifier explicitement le succès
      if (response && response.success === true) {
        console.log('✅ Connexion réussie, redirection dans 100ms...');
        // Petite attente pour s'assurer que le token est bien stocké
        setTimeout(() => {
          navigate('/accuiel', { replace: true });
        }, 100);
      } else {
        // ✅ Afficher l'erreur retournée par le serveur
        const errorMsg = response?.message || 'Identifiant ou mot de passe incorrect';
        console.log('❌ Échec de connexion:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      // ✅ Gérer toutes les erreurs possibles
      console.error('❌ Erreur catch:', err);
      
      let errorMessage = 'Identifiant ou mot de passe incorrect';
      
      if (err.message) {
        errorMessage = err.message;
        console.log('❌ Message d\'erreur (err.message):', err.message);
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
        console.log('❌ Message d\'erreur (response.data):', err.response.data.message);
      }
      
      setError(errorMessage);
      console.log('❌ setError appelé avec:', errorMessage);
    } finally {
      setLoading(false);
      console.log('🔵 Loading désactivé');
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit
  };
};

export default useLogin;