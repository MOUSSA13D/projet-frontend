// src/hooks/useChangePassword.js
import { useState } from 'react';
import profileService from '../services/profileService';

const useChangePassword = (onSuccess) => {
  const [formData, setFormData] = useState({
    ancien_mot_de_passe: '',
    nouveau_mot_de_passe: '',
    confirmer_mot_de_passe: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Réinitialiser les messages d'erreur
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const resetForm = () => {
    setFormData({
      ancien_mot_de_passe: '',
      nouveau_mot_de_passe: '',
      confirmer_mot_de_passe: ''
    });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validation côté client
    if (!formData.ancien_mot_de_passe || !formData.nouveau_mot_de_passe || !formData.confirmer_mot_de_passe) {
      setError('Tous les champs sont obligatoires');
      setLoading(false);
      return;
    }

    if (formData.nouveau_mot_de_passe !== formData.confirmer_mot_de_passe) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.nouveau_mot_de_passe.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const response = await profileService.changePassword({
        ancien_mot_de_passe: formData.ancien_mot_de_passe,
        nouveau_mot_de_passe: formData.nouveau_mot_de_passe,
        confirmer_mot_de_passe: formData.confirmer_mot_de_passe
      });

      if (response.success) {
        setSuccess(true);
        resetForm();
        // Appeler le callback de succès après un court délai
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        setError(response.message || 'Erreur lors du changement de mot de passe');
      }
    } catch (err) {
      setError(err.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    success,
    handleChange,
    handleSubmit,
    resetForm
  };
};

export default useChangePassword;