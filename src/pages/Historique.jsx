import Pagination from "../components/Pagination"
import React, { useState, useEffect } from "react"
import transactionService from "../services/transactionService"

function TableauHistorique({ transactions, onAnnuler }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-lg shadow-md">
        <thead className="bg-[#20DF7F] border-b-2 border-gray-200">
          <tr className="text-left">
            <th className="px-4 py-3 font-semibold text-[#093545]">Date</th>
            <th className="px-4 py-3 font-semibold text-[#093545]">N° Compte Destinataire</th>
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

export default function Historique() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [transactions, setTransactions] = useState([])
  const [transactionCible, setTransactionCible] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  // Charger l'historique des transactions au montage
  useEffect(() => {
    loadHistorique()
  }, [])

  const loadHistorique = async () => {
    try {
      setLoading(true)
      const agentInfo = getAgentInfo()

      if (!agentInfo || !agentInfo.id) {
        setError('Impossible de récupérer les informations de l\'agent')
        return
      }

      const response = await transactionService.getHistorique(agentInfo.id)
      
      if (response.success) {
        setTransactions(response.data || [])
        setError(null)
      } else {
        setError(response.message || 'Erreur lors du chargement de l\'historique')
      }
    } catch (err) {
      console.error('Erreur lors du chargement de l\'historique:', err)
      setError(err.message || 'Erreur lors du chargement de l\'historique')
    } finally {
      setLoading(false)
    }
  }

  const transactionsFiltrees = transactions.filter(
    (transaction) =>
      transaction.compte_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.montant.toString().includes(searchTerm) ||
      transaction.statut.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexDernier = currentPage * transactionsParPage
  const indexPremier = indexDernier - transactionsParPage
  const transactionsActuelles = transactionsFiltrees.slice(indexPremier, indexDernier)

  const totalPages = Math.ceil(transactionsFiltrees.length / transactionsParPage)

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
        // Recharger l'historique
        await loadHistorique()
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-montserrat">Chargement de l'historique...</div>
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
    <div className="flex flex-col w-full min-h-screen pt-10 pb-20 px-5 bg-gray-50">
      {/* En-tête avec statistiques */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Historique des transactions</h1>
        <div className="flex gap-4 mt-4">
          <div className="bg-white rounded-lg shadow p-4 flex-1">
            <p className="text-sm text-gray-600">Total transactions</p>
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

      {/* Barre de recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher par numéro de compte, montant ou statut..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#20DF7F] shadow-sm"
        />
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
                <span className="font-semibold">Compte destinataire:</span> {transactionCible.compte_id}
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