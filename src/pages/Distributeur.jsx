import TableauClientDistributeur from "../components/TableauClientDistributeur"
import Pagination from "../components/Pagination"
import React, { useState } from "react"
import BlockCard from "../components/BlockCard"
import ModifierUtilisateur from "../agent/Modification"
import ConfirmationModal from "../components/ConfirmationModal"
import useUserManagement from "../hooks/UseClientDistributeur"
import { MdCheckBox } from "react-icons/md"
import MultiActionToolbar from "../components/MultiAction"

export default function Distributeur() {
  const [selectionMode, setSelectionMode] = useState(false)
  
  const {
    currentPage,
    searchTerm,
    selectedUser,
    isModalOpen,
    isDeleteModalOpen,
    userToDelete,
    loading,
    error,
    currentUsers,
    totalPages,
    activeCount,
    blockedCount,
    handleEdit,
    handleSave,
    handleBlock,
    handleArchive,
    confirmDelete,
    handlePageChange,
    handleSearchChange,
    setIsModalOpen,
    setIsDeleteModalOpen,
    // Nouvelles props pour sélection multiple
    selectedUsers,
    isMultiDeleteModalOpen,
    isMultiBlockModalOpen,
    multiActionType,
    handleSelectUser,
    handleSelectAll,
    handleMultiDelete,
    confirmMultiDelete,
    handleMultiBlock,
    confirmMultiBlock,
    setIsMultiDeleteModalOpen,
    setIsMultiBlockModalOpen
  } = useUserManagement('distributeur', 8)

  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-montserrat">Chargement des distributeurs...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-montserrat text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="flex-row justify-center items-center w-full min-h-screen pt-10 pb-20 sm:py-10 p-2 sm:pl-14">
      <div className="flex flex-row gap-2 md:gap-10 justify-center w-full mb-6">
        <div className="flex justify-center">
          <BlockCard
            param0="w-40 h-40 lg:w-50 lg:h-50 bg-white rounded-full shadow-md"
            param="text-[#20DF7F]"
            contenu="Distributeurs Actifs"
            nombre={activeCount}
            loading={loading}
          />
        </div>
        <div className="flex justify-center">
          <BlockCard
            param0="w-40 h-40 lg:w-50 lg:h-50 bg-white rounded-full shadow-md"
            param="text-[#FF0000]"
            contenu="Distributeurs Bloqués"
            nombre={blockedCount}
            loading={loading}
          />
        </div>
      </div>

      <div className="mt-5 mr-5">
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Rechercher par nom, numéro de compte ou téléphone..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#20DF7F] font-montserrat"
          />
          
          <button
            onClick={toggleSelectionMode}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-montserrat text-sm md:text-base transition-colors ${
              selectionMode 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-[#20DF7F] text-[#093545] hover:bg-[#1bc96d]'
            }`}
          >
            <MdCheckBox className="text-lg" />
            {selectionMode ? 'Annuler sélection' : 'Sélection multiple'}
          </button>
        </div>

        {selectionMode && (
          <MultiActionToolbar
            selectedCount={selectedUsers.length}
            selectedUsers={selectedUsers}
            allUsers={currentUsers}
            onDelete={handleMultiDelete}
            onBlock={() => handleMultiBlock('block')}
            onUnblock={() => handleMultiBlock('unblock')}
            onCancel={() => setSelectionMode(false)}
          />
        )}

        <TableauClientDistributeur 
          clients={currentUsers}
          onEdit={handleEdit}
          onBlock={handleBlock}
          onArchive={handleArchive}
          showCheckboxes={selectionMode}
          selectedUsers={selectedUsers}
          onSelectUser={handleSelectUser}
          onSelectAll={handleSelectAll}
        />

        <ModifierUtilisateur
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          client={selectedUser}
          onSave={handleSave}
        />

        {/* Modal de suppression unique */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Supprimer ce distributeur ?"
          message="Êtes-vous sûr de vouloir supprimer"
          userName={userToDelete?.nom}
          actionType="delete"
        />

        {/* Modal de suppression multiple */}
        <ConfirmationModal
          isOpen={isMultiDeleteModalOpen}
          onClose={() => setIsMultiDeleteModalOpen(false)}
          onConfirm={confirmMultiDelete}
          title="Supprimer les distributeurs sélectionnés ?"
          message={`Êtes-vous sûr de vouloir supprimer ${selectedUsers.length} distributeur(s) ?`}
          actionType="delete"
        />

        {/* Modal de blocage/déblocage multiple */}
        <ConfirmationModal
          isOpen={isMultiBlockModalOpen}
          onClose={() => setIsMultiBlockModalOpen(false)}
          onConfirm={confirmMultiBlock}
          title={multiActionType === 'block' ? 'Bloquer les distributeurs ?' : 'Débloquer les distributeurs ?'}
          message={`Êtes-vous sûr de vouloir ${multiActionType === 'block' ? 'bloquer' : 'débloquer'} ${selectedUsers.length} distributeur(s) ?`}
          actionType={multiActionType}
        />
        
        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        )}
      </div>
    </div>
  )
}