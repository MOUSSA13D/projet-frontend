// src/agent/CreerUtilisateur.jsx
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";
import useCreateUser from "../hooks/useCreateUser";
import { validateBirthDate, getMinBirthDate, getMaxBirthDate } from "../services/dateValidation";

function CreerUtilisateur({ isOpen, onClose, onSuccess }) {
  const [dateError, setDateError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  
  const { 
    formData, 
    loading, 
    error, 
    success, 
    handleChange, 
    handleFileChange, 
    handleSubmit,
    resetForm 
  } = useCreateUser(() => {
    onSuccess();
    onClose();
  });

  const handleClose = () => {
    resetForm();
    setDateError("");
    setFieldErrors({});
    onClose();
  };

  // Gestion du changement avec suppression de l'erreur du champ
  const handleFieldChange = (e) => {
    const { name } = e.target;
    handleChange(e);
    
    // Supprimer l'erreur du champ lorsqu'il est modifié
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Gestion du changement de date avec validation
  const handleDateChange = (e) => {
    const { value, name } = e.target;
    handleChange(e);
    
    // Supprimer l'erreur du champ
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Valider la date
    if (value) {
      const validation = validateBirthDate(value);
      if (!validation.isValid) {
        setDateError(validation.message);
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  };

  // Gestion du changement de fichier
  const handlePhotoChange = (e) => {
    handleFileChange(e);
    
    // Supprimer l'erreur du champ photo
    if (fieldErrors.photo) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.photo;
        return newErrors;
      });
    }
  };

  // Validation avant soumission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    const errors = {};
    
    // Validation de tous les champs
    if (!formData.prenom || formData.prenom.trim() === "") {
      errors.prenom = "Le prénom est obligatoire";
    }
    
    if (!formData.nom || formData.nom.trim() === "") {
      errors.nom = "Le nom est obligatoire";
    }
    
    if (!formData.email || formData.email.trim() === "") {
      errors.email = "L'email est obligatoire";
    }
    
    if (!formData.telephone || formData.telephone.trim() === "") {
      errors.telephone = "Le téléphone est obligatoire";
    }
    
    if (!formData.cni || formData.cni.trim() === "") {
      errors.cni = "Le numéro CNI est obligatoire";
    }
    
    if (!formData.naissance || formData.naissance.trim() === "") {
      errors.naissance = "La date de naissance est obligatoire";
    } else {
      // Vérifier la date si elle est remplie
      const validation = validateBirthDate(formData.naissance);
      if (!validation.isValid) {
        setDateError(validation.message);
        errors.naissance = validation.message;
      }
    }
    
    if (!formData.role || formData.role.trim() === "") {
      errors.role = "Le type d'utilisateur est obligatoire";
    }
    
    if (!formData.photo) {
      errors.photo = "La photo est obligatoire";
    }
    
    // Si des erreurs existent, les afficher
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    handleSubmit(e);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 sm:ms-40 md:ms-40 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen bg-gray-500 bg-opacity-75 transition-all p-4">
        <div className="flex flex-col bg-white rounded-lg shadow-2xl w-full max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#224957] font-bold font-lexendDeca">
              Ajouter un membre
            </h1>
            <button 
              className="text-gray-600 hover:text-gray-900 text-3xl cursor-pointer transition-colors" 
              onClick={handleClose}
              disabled={loading}
            >
              <IoCloseSharp />
            </button>
          </div>

          {/* Formulaire */}
          <div className="p-6 md:p-8">
            {/* Messages */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <span className="block sm:inline">Utilisateur créé avec succès ! Email envoyé.</span>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleFormSubmit}>
              {/* Ligne 1: Prénom et Nom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="prenom" className="block text-sm font-semibold font-lexendDeca text-gray-700 mb-2">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="prenom" 
                    name="prenom" 
                    type="text" 
                    value={formData.prenom}
                    onChange={handleFieldChange}
                    disabled={loading}
                    className={`block w-full rounded-lg border ${fieldErrors.prenom ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#224957] focus:ring-2 focus:ring-[#224957] focus:ring-opacity-20 transition-all disabled:bg-gray-100`}
                    placeholder="Entrez le prénom"
                  />
                  {fieldErrors.prenom && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.prenom}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="nom" className="block text-sm font-semibold font-lexendDeca text-gray-700 mb-2">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="nom" 
                    name="nom" 
                    type="text" 
                    value={formData.nom}
                    onChange={handleFieldChange}
                    disabled={loading}
                    className={`block w-full rounded-lg border ${fieldErrors.nom ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#224957] focus:ring-2 focus:ring-[#224957] focus:ring-opacity-20 transition-all disabled:bg-gray-100`}
                    placeholder="Entrez le nom"
                  />
                  {fieldErrors.nom && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.nom}</p>
                  )}
                </div>
              </div>

              {/* Ligne 2: Email et Téléphone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold font-lexendDeca text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email}
                    onChange={handleFieldChange}
                    disabled={loading}
                    className={`block w-full rounded-lg border ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#224957] focus:ring-2 focus:ring-[#224957] focus:ring-opacity-20 transition-all disabled:bg-gray-100`}
                    placeholder="exemple@email.com"
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.email}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="telephone" className="block text-sm font-semibold font-lexendDeca text-gray-700 mb-2">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="telephone" 
                    name="telephone" 
                    type="number" 
                    value={formData.telephone}
                    onChange={handleFieldChange}
                    disabled={loading}
                    className={`block w-full rounded-lg border ${fieldErrors.telephone ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#224957] focus:ring-2 focus:ring-[#224957] focus:ring-opacity-20 transition-all disabled:bg-gray-100`}
                    placeholder="+221 XX XXX XX XX"
                  />
                  {fieldErrors.telephone && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.telephone}</p>
                  )}
                </div>
              </div>

              {/* Ligne 3: CNI et Date de naissance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="cni" className="block text-sm font-semibold font-lexendDeca text-gray-700 mb-2">
                    CNI <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="cni" 
                    name="cni" 
                    type="number" 
                    value={formData.cni}
                    onChange={handleFieldChange}
                    disabled={loading}
                    className={`block w-full rounded-lg border ${fieldErrors.cni ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#224957] focus:ring-2 focus:ring-[#224957] focus:ring-opacity-20 transition-all disabled:bg-gray-100`}
                    placeholder="Numéro CNI"
                  />
                  {fieldErrors.cni && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.cni}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="naissance" className="block text-sm font-semibold font-lexendDeca text-gray-700 mb-2">
                    Date de naissance <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="naissance" 
                    name="naissance" 
                    type="date" 
                    value={formData.naissance}
                    onChange={handleDateChange}
                    disabled={loading}
                    max={getMinBirthDate()}
                    min={getMaxBirthDate()}
                    className={`block w-full rounded-lg border ${dateError || fieldErrors.naissance ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 focus:border-[#224957] focus:ring-2 focus:ring-[#224957] focus:ring-opacity-20 transition-all disabled:bg-gray-100`}
                  />
                  {(dateError || fieldErrors.naissance) && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{dateError || fieldErrors.naissance}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">L'utilisateur doit avoir au moins 5 ans</p>
                </div>
              </div>

              {/* Ligne 4: Type et Photo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="role" className="block text-sm font-semibold font-lexendDeca text-gray-700 mb-2">
                    Type d'utilisateur <span className="text-red-500">*</span>
                  </label>
                  <select 
                    id="role" 
                    name="role" 
                    value={formData.role}
                    onChange={handleFieldChange}
                    disabled={loading}
                    className={`block w-full rounded-lg border ${fieldErrors.role ? 'border-red-500' : 'border-gray-300'} px-4 py-3 text-gray-900 focus:border-[#224957] focus:ring-2 focus:ring-[#224957] focus:ring-opacity-20 transition-all bg-white disabled:bg-gray-100`}
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="client">Client</option>
                    <option value="distributeur">Distributeur</option>
                  </select>
                  {fieldErrors.role && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.role}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="photo" className="block text-sm font-semibold font-lexendDeca text-gray-700 mb-2">
                    Photo <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="photo" 
                    name="photo" 
                    type="file" 
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handlePhotoChange}
                    disabled={loading}
                    className={`block w-full rounded-lg border ${fieldErrors.photo ? 'border-red-500' : 'border-gray-300'} px-4 py-2 text-gray-900 focus:border-[#224957] focus:ring-2 focus:ring-[#224957] focus:ring-opacity-20 transition-all disabled:bg-gray-100`}
                  />
                  {fieldErrors.photo && (
                    <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.photo}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">JPG, JPEG ou PNG (Max 5MB)</p>
                </div>
              </div>

              {/* Bouton d'ajout */}
              <div className="flex justify-center pt-6">
                <button 
                  type="submit" 
                  disabled={loading || dateError}
                  className="w-full md:w-2/3 lg:w-1/2 rounded-lg bg-[#20DF7F] px-6 py-3 text-lg font-bold font-lexendDeca text-[#224957] shadow-lg hover:bg-[#1bc970] hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#20DF7F] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Création en cours...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreerUtilisateur;