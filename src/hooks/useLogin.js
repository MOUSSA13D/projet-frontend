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
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(
        formData.identifiant,
        formData.mot_de_passe
      );

      if (response.success) {
        navigate('/accuiel'); // ✅ redirection après login
      } else {
        setError(response.message || 'Erreur de connexion');
      }
    } catch (err) {
      setError(err.message || 'Identifiant ou mot de passe incorrect');
    } finally {
      setLoading(false);
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
