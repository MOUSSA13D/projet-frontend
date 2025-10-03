// src/hooks/useCreateUser.js
import { useState } from 'react';
import userService from '../services/userService';

const useCreateUser = (onSuccess) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    cni: '',
    naissance: '',
    role: '',
    photo: null
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
    if (error) setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setError('Seuls les fichiers JPG, JPEG et PNG sont autorisés');
        e.target.value = '';
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La taille du fichier ne doit pas dépasser 5MB');
        e.target.value = '';
        return;
      }

      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      if (error) setError(null);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      cni: '',
      naissance: '',
      role: '',
      photo: null
    });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validation
    if (!formData.photo) {
      setError('La photo est requise');
      setLoading(false);
      return;
    }

    try {
      // Créer FormData pour l'upload de fichier
      const data = new FormData();
      data.append('nom', formData.nom);
      data.append('prenom', formData.prenom);
      data.append('email', formData.email);
      data.append('telephone', formData.telephone);
      data.append('cni', formData.cni);
      data.append('naissance', formData.naissance);
      data.append('role', formData.role);
      data.append('photo', formData.photo);

      const response = await userService.createUser(data);

      if (response.success) {
        setSuccess(true);
        resetForm();
        // Appeler le callback de succès
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } else {

        setError(response.message || 'Erreur lors de la création');
        console.log(response.message)
      }
    } catch (err) {

      setError(err.message || 'Erreur lors de la création de l\'utilisateur');
      console.log(err.message)
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
    handleFileChange,
    handleSubmit,
    resetForm
  };
};

export default useCreateUser;