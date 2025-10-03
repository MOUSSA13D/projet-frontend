// src/hooks/useProfile.js
import { useState, useEffect } from 'react';
import authService from '../services/authService';

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = authService.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('Utilisateur non connecté');
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/agent/${user.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data);
        // Mettre à jour les données dans le localStorage
        authService.updateUserData(data.data);
      } else {
        throw new Error(data.message || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const user = authService.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('Utilisateur non connecté');
      }

      const token = localStorage.getItem('token');
      
      // Vérifier si formData est un FormData (avec photo) ou un objet simple
      const isFormData = formData instanceof FormData;
      
      const response = await fetch(`${API_URL}/api/agent/update/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Ne pas définir Content-Type si c'est un FormData (le navigateur le fait automatiquement)
          ...(!isFormData && { 'Content-Type': 'application/json' })
        },
        body: isFormData ? formData : JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour');
      }

      if (data.success) {
        setProfile(data.data);
        authService.updateUserData(data.data);
        setIsEditing(false);
        return { success: true };
      } else {
        throw new Error(data.message || 'Erreur inconnue');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setError(null);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    isEditing,
    updateProfile,
    toggleEdit,
    refreshProfile: fetchProfile
  };
};

export default useProfile;