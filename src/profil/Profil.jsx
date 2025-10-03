// src/profil/Profil.jsx
import React, { useState } from 'react';
import admin from '/image/Ellipse 9.png';
import useProfile from '../hooks/useProfile';
import authService from '../services/authService';
import ChangerPassword from '../changerPassword/ChangerPassword';

function Profil() {
  const { profile, loading, error, isEditing, updateProfile, toggleEdit } = useProfile();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  React.useEffect(() => {
    if (profile) {
      setFormData({
        prenom: profile.prenom || '',
        nom: profile.nom || '',
        email: profile.email || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (updateError) setUpdateError(null);
    if (updateSuccess) setUpdateSuccess(false);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setUpdateError('Veuillez sélectionner une image valide');
        return;
      }

      // Vérifier la taille (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setUpdateError('L\'image ne doit pas dépasser 5MB');
        return;
      }

      setPhotoFile(file);
      
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    // Réinitialiser l'input file
    const fileInput = document.getElementById('photoInput');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Créer un FormData pour envoyer les données avec la photo
    const formDataToSend = new FormData();
    
    if (formData.nom !== profile.nom) {
      formDataToSend.append('nom', formData.nom);
    }
    if (formData.prenom !== profile.prenom) {
      formDataToSend.append('prenom', formData.prenom);
    }
    if (formData.email !== profile.email) {
      formDataToSend.append('email', formData.email);
    }
    
    if (photoFile) {
      formDataToSend.append('photo', photoFile);
    }

    const result = await updateProfile(formDataToSend);
    
    if (result.success) {
      setUpdateSuccess(true);
      setPhotoFile(null);
      setPhotoPreview(null);
        // ✅ Mettre à jour l'utilisateur stocké
  const updatedUser = { ...profile, ...result.data }; 
  authService.setCurrentUser(updatedUser);

  // ✅ Déclencher un event pour que Nav recharge

      setTimeout(() => setUpdateSuccess(false), 3000);
    } else {
      setUpdateError(result.message);
    }
  };

  const openPasswordModal = () => {
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
  };

  const getPhotoUrl = () => {
    if (photoPreview) {
      return photoPreview;
    }
    if (profile?.photo) {
      return `${API_URL}/uploads/${profile.photo}`;
    }
    return admin;
  };

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-[#093545]">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex sm:flex-row flex-col bg-white w-full rounded-lg shadow-lg">
        {/* Section Profil */}
        <div className="p-4 px-0 flex flex-col items-center justify-center sm:w-2/5 w-full mb-4 md:mb-0">
          <h5 className="text-xl mb-2">Profil</h5>
          
          {/* Photo de profil */}
          <div className="relative mb-2">
            <img 
              src={getPhotoUrl()} 
              alt="Image de profil" 
              className="rounded-full h-24 w-24 object-cover border-4 border-gray-200" 
            />
            {isEditing && (
              <label 
                htmlFor="photoInput"
                className="absolute bottom-0 right-0 bg-[#093545] text-white rounded-full p-2 cursor-pointer hover:bg-[#0a4556] transition-colors"
                title="Changer la photo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            )}
            <input 
              id="photoInput"
              type="file" 
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              disabled={!isEditing}
            />
          </div>

          {photoPreview && isEditing && (
            <button
              onClick={removePhoto}
              className="text-red-600 text-sm hover:text-red-800 mb-2"
            >
              Annuler la photo
            </button>
          )}
          
          <h1 className="text-[#093545] mb-2 font-bold">
            {profile ? `${profile.prenom} ${profile.nom}` : 'Chargement...'}
          </h1>
          <h1 className="text-[#093545] mb-4 font-semibold">
            {authService.getUserType() || 'Agent'}
          </h1>
          
          {/* Boutons d'action */}
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={openPasswordModal}
              className="bg-[#093545] text-white px-4 py-2 rounded hover:bg-[#0a4556] transition-colors"
            >
              Changer mot de passe
            </button>
          </div>
        </div>

        {/* Bordure verticale */}
        <div className="hidden md:flex border-2 border-gray-300 h-auto my-3"></div>

        {/* Section Informations */}
        <div className="bg-white sm:p-8 p-0 px-10 sm:w-4/5 w-full">
          <h1 className="text-xl font-bold mb-4 p-2">Informations Générales</h1>
          
          {/* Messages de succès/erreur */}
          {updateSuccess && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Profil mis à jour avec succès !
            </div>
          )}
          
          {updateError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {updateError}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex sm:flex-row flex-col gap-5 w-full">
              <div className="flex flex-col">
                <label className="pl-3 text-sm font-medium mb-1">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  className="border-2 border-slate-200 rounded-md text-gray-900 text-sm sm:w-64 w-72 p-2 disabled:bg-gray-100"
                  required
                />
              </div>
              
              <div className="flex flex-col">
                <label className="pl-3 text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  disabled={!isEditing || loading}
                  className="border-2 border-slate-200 rounded-md text-gray-900 text-sm sm:w-48 w-72 p-2 disabled:bg-gray-100"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col mt-5">
              <label className="pl-3 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing || loading}
                className="border-2 border-slate-200 rounded-md text-gray-900 text-sm sm:w-4/6 w-72 p-2 disabled:bg-gray-100"
                required
              />
            </div>

            <div className="flex flex-col mt-5">
              <label className="pl-3 text-sm font-medium mb-1">Solde</label>
              <input
                type="text"
                value={profile ? `${profile.solde} FCFA` : '0 FCFA'}
                disabled
                className="border-2 border-slate-200 rounded-md text-gray-900 text-sm sm:w-4/6 w-72 p-2 bg-gray-100"
              />
            </div>

            <div className="mt-5 flex justify-end sm:w-4/6 w-full">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={toggleEdit}
                  className="bg-[#093545] text-white px-4 py-2 rounded hover:bg-[#0a4556] transition-colors"
                >
                  Éditer Profil
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      toggleEdit();
                      removePhoto();
                    }}
                    disabled={loading}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#20DF7F] text-[#093545] px-4 py-2 rounded font-semibold hover:bg-[#1BC970] transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Modal Changement de mot de passe */}
      <ChangerPassword 
        isOpen={showPasswordModal} 
        clique={closePasswordModal}
      />
    </div>
  );
}

export default Profil;