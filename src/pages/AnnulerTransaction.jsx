import Pagination from "../components/Pagination"
import React, { useState } from "react"
import transactionService from "../services/transactionService"

function TableauHistorique({ transactions, onAnnuler }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-[#20DF7F] border-b-2 border-gray-200">
          <tr className="text-left">
            <th className="px-4 py-3 font-semibold text-[#093545]">Date</th>
            <th className="px-4 py-3 font-semibold text-[#093545]">N° Compte</th>
            <th className="px-4 py-3 font-semibold text-[#093545]">Montant</th>
            <th className="px-4 py-3 font-semibold text-[#093545]">Type</th>
            <th className="px-4 py-3 font-semibold text-[#093545]">Statut</th>
            <th className="px-4 py-3 font-semibold text-[#093545] text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                Aucune transaction trouvée
              </td>
            </tr>
          ) : (
            transactions.map((transaction, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 transition-colors border-b duration-150"
              >
                <td className="px-4 py-3 text-sm">
                  {new Date(transaction.date_creation).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-4 py-3 font-medium">{transaction.compte_id}</td>
                <td className="px-4 py-3 font-semibold text-gray-700">
                  {transaction.montant.toLocaleString('fr-FR')} FCFA
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    transaction.type === 'credit' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {transaction.type === 'credit' ? 'Crédit' : 'Débit'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    transaction.statut === 'annulée' 
                      ? 'bg-red-100 text-red-700' 
                      : transaction.statut === 'terminée'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {transaction.statut === 'terminée' ? 'Terminé' : transaction.statut === 'annulée' ? 'Annulé' : transaction.statut}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {transaction.statut === 'terminée' && (
                    <button
                      onClick={() => onAnnuler(transaction)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm shadow-sm transition-colors"
                    >
                      Annuler
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default function AnnulerTransaction() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [transactions, setTransactions] = useState([])
  const [transactionCible, setTransactionCible] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasSearched, setHasSearched] = useState(false)

  const transactionsParPage = 8

  // Récupérer les informations de l'agent connecté
  const getAgentInfo = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'))
      return userInfo
    } catch (error) {
      console.error('Erreur lors de la récupération des infos agent:', error)
      return null
    }
  }

  // Rechercher les transactions par numéro de compte
  const rechercherTransactions = async () => {
    if (!searchTerm.trim()) {
      setError('Veuillez entrer un numéro de compte')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setHasSearched(true)
      const agentInfo = getAgentInfo()

      if (!agentInfo || !agentInfo.id) {
        setError('Impossible de récupérer les informations de l\'agent')
        return
      }

      // Récupérer toutes les transactions de l'agent
      const response = await transactionService.getHistorique(agentInfo.id)
      
      if (response.success) {
        // Filtrer les transactions par numéro de compte
        const transactionsFiltrees = (response.data || []).filter(
          (transaction) => 
            transaction.compte_id.toLowerCase().includes(searchTerm.toLowerCase())
        )
        
        setTransactions(transactionsFiltrees)
        
        if (transactionsFiltrees.length === 0) {
          setError('Aucune transaction trouvée pour ce numéro de compte')
        }
      } else {
        setError(response.message || 'Erreur lors de la recherche')
        setTransactions([])
      }
    } catch (err) {
      console.error('Erreur lors de la recherche:', err)
      setError(err.message || 'Erreur lors de la recherche')
      setTransactions([])
    } finally {
      setLoading(false)
      setCurrentPage(1)
    }
  }

  // Gérer la touche Entrée
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      rechercherTransactions()
    }
  }

  const indexDernier = currentPage * transactionsParPage
  const indexPremier = indexDernier - transactionsParPage
  const transactionsActuelles = transactions.slice(indexPremier, indexDernier)

  const totalPages = Math.ceil(transactions.length / transactionsParPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleAnnulerClick = (transaction) => {
    setTransactionCible(transaction)
    setIsModalOpen(true)
  }

  const confirmerAnnulation = async () => {
    if (!transactionCible) return

    try {
      const agentInfo = getAgentInfo()

      if (!agentInfo || !agentInfo.id) {
        alert('Impossible de récupérer les informations de l\'agent')
        return
      }

      const response = await transactionService.annulerTransfert(
        transactionCible.id,
        agentInfo.id,
        'agent'
      )

      if (response.success) {
        alert('Transaction annulée avec succès')
        // Actualiser la liste après annulation
        await rechercherTransactions()
      } else {
        alert(`Erreur: ${response.message || 'Impossible d\'annuler la transaction'}`)
      }
    } catch (err) {
      console.error('Erreur lors de l\'annulation:', err)
      alert(`Erreur: ${err.message || 'Une erreur est survenue lors de l\'annulation'}`)
    } finally {
      setIsModalOpen(false)
      setTransactionCible(null)
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen pt-10 pb-20 px-5 bg-gray-50">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Annuler une transaction</h1>
        <p className="text-gray-600">Recherchez un compte pour voir ses transactions terminées</p>
      </div>

      {/* Barre de recherche avec bouton */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Entrez le numéro de compte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20DF7F] shadow-sm"
          />
          <button
            onClick={rechercherTransactions}
            disabled={loading}
            className="px-6 py-3 bg-[#20DF7F] hover:bg-[#1bc970] text-white font-semibold rounded-lg shadow-sm transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Recherche...' : 'Rechercher'}
          </button>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Message de chargement */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-xl font-montserrat text-gray-600">Recherche en cours...</div>
        </div>
      )}

      {/* Affichage des résultats ou message initial */}
      {!loading && hasSearched && transactions.length > 0 && (
        <>
          {/* Statistiques */}
          <div className="mb-6">
            <div className="flex gap-4">
              <div className="bg-white rounded-lg shadow p-4 flex-1">
                <p className="text-sm text-gray-600">Transactions trouvées</p>
                <p className="text-2xl font-bold text-[#20DF7F]">{transactions.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex-1">
                <p className="text-sm text-gray-600">Terminées</p>
                <p className="text-2xl font-bold text-green-600">
                  {transactions.filter(t => t.statut === 'terminée').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 flex-1">
                <p className="text-sm text-gray-600">Annulées</p>
                <p className="text-2xl font-bold text-red-600">
                  {transactions.filter(t => t.statut === 'annulée').length}
                </p>
              </div>
            </div>
          </div>

          {/* Tableau */}
          <TableauHistorique 
            transactions={transactionsActuelles} 
            onAnnuler={handleAnnulerClick} 
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {/* Message initial si aucune recherche n'a été effectuée */}
      {!loading && !hasSearched && (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-500 text-lg">Entrez un numéro de compte pour rechercher des transactions</p>
        </div>
      )}

      {/* Modal Confirmation */}
      {isModalOpen && transactionCible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-md animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Confirmation d'annulation</h2>
            <p className="text-gray-600 mb-2">
              Voulez-vous vraiment annuler cette transaction ?
            </p>
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p className="text-sm">
                <span className="font-semibold">Compte:</span> {transactionCible.compte_id}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Montant:</span> {transactionCible.montant.toLocaleString('fr-FR')} FCFA
              </p>
              <p className="text-sm">
                <span className="font-semibold">Date:</span> {new Date(transactionCible.date_creation).toLocaleString('fr-FR')}
              </p>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setTransactionCible(null)
                }}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 text-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmerAnnulation}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 shadow-sm transition-colors"
              >
                Confirmer l'annulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}