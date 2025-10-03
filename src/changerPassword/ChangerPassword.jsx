// src/components/ChangerPassword.jsx
import React from 'react';
import Image from '/image/Ellipse 9.png';
import useChangePassword from '../hooks/useChangePassword';
import authService from '../services/authService';

function ChangerPassword({ isOpen, clique }) {
  const { formData, loading, error, success, handleChange, handleSubmit } = useChangePassword(clique);
  const user = authService.getCurrentUser();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center overflow-y-auto z-50">
      <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
        <div className="mt-4">
          <div className="p-2">
            {/* Profil */}
            <div className="px-0 flex flex-col items-center justify-center sm:w-2/5 w-full md:mb-0 mx-auto block">
              
              
              <h1 className="text-[#093545] mb-2 font-semibold text-lg">
                {user ? `${user.prenom} ${user.nom}` : 'Utilisateur'}
              </h1>
              <h1 className="text-[#093545] mb-4 font-semibold text-md">
                {authService.getUserType() || 'Agent'}
              </h1>
            </div>

            <h2 className="text-xl font-bold text-center text-[#093545] mb-6">
              Modifier votre mot de passe
            </h2>

            {/* Messages */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <span className="block sm:inline">Mot de passe modifié avec succès !</span>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                name="ancien_mot_de_passe"
                value={formData.ancien_mot_de_passe}
                onChange={handleChange}
                disabled={loading}
                className="bg-[#093545] text-white p-3 rounded-lg focus:outline-none placeholder:text-white w-80 mx-auto block disabled:opacity-50"
                placeholder="Mot de passe actuel"
                required
              />
              
              <input
                type="password"
                name="nouveau_mot_de_passe"
                value={formData.nouveau_mot_de_passe}
                onChange={handleChange}
                disabled={loading}
                className="bg-[#093545] text-white p-3 rounded-lg focus:outline-none placeholder:text-white w-80 mx-auto block mt-2 disabled:opacity-50"
                placeholder="Nouveau mot de passe"
                required
              />
              
              <input
                type="password"
                name="confirmer_mot_de_passe"
                value={formData.confirmer_mot_de_passe}
                onChange={handleChange}
                disabled={loading}
                className="bg-[#093545] text-white p-3 rounded-lg focus:outline-none placeholder:text-white w-80 mx-auto block mt-2 disabled:opacity-50"
                placeholder="Confirmer mot de passe"
                required
              />

              <div className="flex gap-2 justify-center mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#20DF7F] text-black p-2 rounded w-28 font-semibold text-lg shadow-lg hover:bg-[#1BC970] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'En cours...' : 'Valider'}
                </button>
                
                <button
                  type="button"
                  onClick={clique}
                  disabled={loading}
                  className="bg-gray-300 text-black p-2 rounded w-28 font-semibold text-lg shadow-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangerPassword;