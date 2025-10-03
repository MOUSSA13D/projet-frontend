import React from 'react';
import { MdDelete, MdBlock, MdCheckCircle, MdClose } from 'react-icons/md';

export default function MultiActionToolbar({ 
  selectedCount, 
  selectedUsers,
  allUsers,
  onDelete, 
  onBlock, 
  onUnblock, 
  onCancel 
}) {
  if (selectedCount === 0) return null;

  // Vérifier les statuts des utilisateurs sélectionnés
  const selectedUsersData = allUsers.filter(user => selectedUsers.includes(user.id));
  const hasActiveUsers = selectedUsersData.some(user => user.statut === 'Actif');
  const hasBlockedUsers = selectedUsersData.some(user => user.statut === 'Bloqué');

  return (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <MdCheckCircle className="text-blue-600 text-xl" />
        <span className="font-montserrat font-semibold text-blue-800">
          {selectedCount} élément{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Afficher "Bloquer" seulement s'il y a des utilisateurs actifs */}
        {hasActiveUsers && (
          <button
            onClick={onBlock}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-md font-montserrat text-sm hover:bg-orange-700 transition-colors"
          >
            <MdBlock className="text-lg" />
            Bloquer
          </button>
        )}

        {/* Afficher "Débloquer" seulement s'il y a des utilisateurs bloqués */}
        {hasBlockedUsers && (
          <button
            onClick={onUnblock}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md font-montserrat text-sm hover:bg-green-700 transition-colors"
          >
            <MdCheckCircle className="text-lg" />
            Débloquer
          </button>
        )}

        {/* Le bouton supprimer est toujours affiché */}
        <button
          onClick={onDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md font-montserrat text-sm hover:bg-red-700 transition-colors"
        >
          <MdDelete className="text-lg" />
          Supprimer
        </button>

        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-md font-montserrat text-sm hover:bg-gray-600 transition-colors"
        >
          <MdClose className="text-lg" />
          Annuler
        </button>
      </div>
    </div>
  );
}