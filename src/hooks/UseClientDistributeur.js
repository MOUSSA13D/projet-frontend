import { useState, useEffect } from 'react'
import userService from '../services/userService'
import compteService from '../services/compteService'

/**
 * Hook personnalisé pour gérer les utilisateurs (clients ou distributeurs)
 * @param {string} role - Le rôle à filtrer ('client' ou 'distributeur')
 * @param {number} itemsPerPage - Nombre d'éléments par page
 */
export default function useUserManagement(role, itemsPerPage = 8) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Nouveaux états pour la sélection multiple
  const [selectedUsers, setSelectedUsers] = useState([])
  const [isMultiDeleteModalOpen, setIsMultiDeleteModalOpen] = useState(false)
  const [isMultiBlockModalOpen, setIsMultiBlockModalOpen] = useState(false)
  const [multiActionType, setMultiActionType] = useState(null) // 'block' ou 'unblock'

  // Charger les utilisateurs au montage
  useEffect(() => {
    loadUsers()
  }, [role])

  // Fonction pour charger les utilisateurs
  const loadUsers = async () => {
    try {
      setLoading(true)
      
      const [usersResponse, comptesResponse] = await Promise.all([
        userService.getAllUsers(),
        compteService.getAllComptes()
      ])
      
      const allUsers = usersResponse.data || []
      const comptes = comptesResponse.data || []
      
      // Créer un map des comptes par utilisateur_id
      const comptesMap = {}
      comptes.forEach(compte => {
        const userId = typeof compte.utilisateur_id === 'object' 
          ? compte.utilisateur_id.id 
          : compte.utilisateur_id
        comptesMap[userId] = compte
      })
      
      // Filtrer par rôle et mapper les données
      const usersData = allUsers
        .filter(user => user.role === role)
        .map(user => {
          const compte = comptesMap[user.id]
          return {
            id: user.id,
            nom: `${user.prenom} ${user.nom}`,
            dateCreation: new Date(user.date_creation).toLocaleDateString('fr-FR'),
            numeroCompte: compte?.numero_compte || 'N/A',
            telephone: user.telephone,
            statut: user.statut === 'actif' ? 'Actif' : 'Bloqué',
            email: user.email,
            cni: user.cni,
            photo: user.photo,
            prenom: user.prenom,
            nomFamille: user.nom
          }
        })

      setUsers(usersData)
      setError(null)
    } catch (err) {
      setError(err.message || `Erreur lors du chargement des ${role}s`)
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  // Ouvrir le modal d'édition
  const handleEdit = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  // Sauvegarder les modifications
  const handleSave = async (updatedUser) => {
    try {
      const formData = new FormData()
      formData.append('nom', updatedUser.nomFamille)
      formData.append('prenom', updatedUser.prenom)
      formData.append('telephone', updatedUser.telephone)
      formData.append('email', updatedUser.email)
      formData.append('cni', updatedUser.cni)

      await userService.updateUser(updatedUser.id, formData)
      await loadUsers()
      setIsModalOpen(false)
      setSelectedUser(null)
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err)
      alert(`Erreur lors de la mise à jour du ${role}`)
    }
  }

  // Bloquer/Débloquer un utilisateur
  const handleBlock = async (user) => {
    try {
      const nouveauStatut = user.statut === 'Actif' ? 'bloqué' : 'actif'
      await userService.updateStatus(user.id, nouveauStatut)
      await loadUsers()
    } catch (err) {
      console.error('Erreur lors du changement de statut:', err)
      alert('Erreur lors du changement de statut')
    }
  }

  // Ouvrir le modal de suppression
  const handleArchive = (user) => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
  }

  // Confirmer la suppression
  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await userService.deleteUser(userToDelete.id)
        await loadUsers()
        setIsDeleteModalOpen(false)
        setUserToDelete(null)
      } catch (err) {
        console.error('Erreur lors de la suppression:', err)
        alert(`Erreur lors de la suppression du ${role}`)
      }
    }
  }

  // ===== NOUVELLES FONCTIONS POUR LA SÉLECTION MULTIPLE =====

  // Gérer la sélection d'un utilisateur
  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  // Sélectionner tous les utilisateurs
  const handleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(currentUsers.map(u => u.id))
    }
  }

  // Ouvrir le modal de suppression multiple
  const handleMultiDelete = () => {
    if (selectedUsers.length === 0) {
      alert('Veuillez sélectionner au moins un utilisateur')
      return
    }
    setIsMultiDeleteModalOpen(true)
  }

  // Confirmer la suppression multiple
  const confirmMultiDelete = async () => {
    try {
      await userService.deleteManyUsers(selectedUsers)
      await loadUsers()
      setSelectedUsers([])
      setIsMultiDeleteModalOpen(false)
    } catch (err) {
      console.error('Erreur lors de la suppression multiple:', err)
      alert(`Erreur lors de la suppression des ${role}s`)
    }
  }

  // Ouvrir le modal de blocage/déblocage multiple
  const handleMultiBlock = (action) => {
    if (selectedUsers.length === 0) {
      alert('Veuillez sélectionner au moins un utilisateur')
      return
    }
    setMultiActionType(action) // 'block' ou 'unblock'
    setIsMultiBlockModalOpen(true)
  }

  // Confirmer le blocage/déblocage multiple
  const confirmMultiBlock = async () => {
    try {
      const statut = multiActionType === 'block' ? 'bloqué' : 'actif'
      await userService.updateManyStatuses(selectedUsers, statut)
      await loadUsers()
      setSelectedUsers([])
      setIsMultiBlockModalOpen(false)
      setMultiActionType(null)
    } catch (err) {
      console.error('Erreur lors du changement de statut multiple:', err)
      alert('Erreur lors du changement de statut')
    }
  }

  // Filtrer les utilisateurs selon la recherche
  const filteredUsers = users.filter(user =>
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.numeroCompte.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.telephone.includes(searchTerm)
  )

  // Statistiques
  const activeCount = users.filter(u => u.statut === 'Actif').length
  const blockedCount = users.filter(u => u.statut === 'Bloqué').length

  // Pagination
  const indexDernier = currentPage * itemsPerPage
  const indexPremier = indexDernier - itemsPerPage
  const currentUsers = filteredUsers.slice(indexPremier, indexDernier)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  return {
    // États
    currentPage,
    searchTerm,
    users,
    selectedUser,
    isModalOpen,
    isDeleteModalOpen,
    userToDelete,
    loading,
    error,
    
    // Données calculées
    filteredUsers,
    currentUsers,
    totalPages,
    activeCount,
    blockedCount,
    
    // Fonctions de base
    handleEdit,
    handleSave,
    handleBlock,
    handleArchive,
    confirmDelete,
    handlePageChange,
    handleSearchChange,
    setIsModalOpen,
    setIsDeleteModalOpen,
    loadUsers,

    // Nouveaux états et fonctions pour sélection multiple
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
  }
}