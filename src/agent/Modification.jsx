import React, { useState, useEffect } from 'react';
import { IoCloseSharp } from "react-icons/io5";

export default function ModifierUtilisateur({ isOpen, onClose, client, onSave }) {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    email: '',
    cni: '',
  });

  useEffect(() => {
    if (client) {
      setFormData({
        prenom: client.prenom || '',
        nom: client.nomFamille || '',
        telephone: client.telephone || '',
        email: client.email || '',
        cni: client.cni || '',
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Validation simple
    if (!formData.prenom || !formData.nom || !formData.telephone || !formData.email || !formData.cni) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const updatedClient = {
      ...client,
      prenom: formData.prenom,
      nomFamille: formData.nom,
      nom: `${formData.prenom} ${formData.nom}`,
      telephone: formData.telephone,
      email: formData.email,
      cni: formData.cni,
    };
    onSave(updatedClient);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto ml-25">
      <div className="flex items-center justify-center min-h-screen bg-gray-500 bg-opacity-75 transition-all p-4">
        <div className="flex flex-col bg-white rounded-lg shadow-2xl w-full max-w-4xl">
          {/* Header avec bouton close */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#224957] font-bold font-lexendDeca">
              Modifier l'utilisateur
            </h1>
            <button 
              className="text-gray-600 hover:text-gray-900 text-3xl transition-colors" 
              onClick={onClose}
            >
              <IoCloseSharp />
            </button>
          </div>

          {/* Formulaire */}
          <div className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Numéro de compte en lecture seule */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <label className="block text-sm font-semibold font-lexendDeca text-gray-700 mb-1">
                  Numéro de compte
                </label>
                <p className="text-lg font-medium text-[#224957]">
                  {client?.numeroCompte || 'N/A'}
                </p>
              </div>

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
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#224957] focus:ring-2 focus:ring-[#224957] focus:ring-opacity-20 transition-all" 
                    placeholder="Entrez le prénom"
                    required
                  />
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
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#224957] focus:ring-2 focus:ring-[#224957] focus:ring-opacity-20 transition-all" 
                    placeholder="Entrez le nom"
                    required
                  />
                </div>
              </div>

              {/* Ligne 2: Téléphone et Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="telephone" className="block text-sm font-semibold font-lexendDeca text-gray-700 mb-2">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="telephone" 
                    name="telephone" 
                    type="tel" 
                    value={formData.telephone}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#224957] focus:ring-2 focus:ring-[#224957] focus:ring-opacity-20 transition-all" 
                    placeholder="+221 XX XXX XX XX"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold font-lexendDeca text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#224957] focus:ring-2 focus:ring-[#224957] focus:ring-opacity-20 transition-all" 
                    placeholder="exemple@email.com"
                    required
                  />
                </div>
              </div>

              {/* Ligne 3: CNI et Statut */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="cni" className="block text-sm font-semibold font-lexendDeca text-gray-700 mb-2">
                    CNI <span className="text-red-500">*</span>
                  </label>
                  <input 
                    id="cni" 
                    name="cni" 
                    type="text" 
                    value={formData.cni}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-[#224957] focus:ring-2 focus:ring-[#224957] focus:ring-opacity-20 transition-all" 
                    placeholder="Numéro CNI"
                    required
                  />
                </div>
               
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-center gap-4 pt-6">
                <button 
                  type="button"
                  onClick={onClose}
                  className="w-full md:w-1/3 rounded-lg bg-gray-300 px-6 py-3 text-lg font-bold font-lexendDeca text-gray-700 shadow-lg hover:bg-gray-400 hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50"
                >
                  Annuler
                </button>
                <button 
                  type="button"
                  onClick={handleSubmit}
                  className="w-full md:w-1/3 rounded-lg bg-[#20DF7F] px-6 py-3 text-lg font-bold font-lexendDeca text-[#224957] shadow-lg hover:bg-[#1bc970] hover:shadow-xl transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#20DF7F] focus:ring-opacity-50"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}