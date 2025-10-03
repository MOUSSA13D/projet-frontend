import React, { useState } from "react"
import transactionService from "../services/transactionService"

export default function Depot() {
  const [numeroCompte, setNumeroCompte] = useState("")
  const [montant, setMontant] = useState("")
  const [loading, setLoading] = useState(false)

  const defaultMontants = [100, 200, 300, 400, 500, 600, 700, 800]

  // Récupérer les informations de l'agent connecté depuis le localStorage
  const getAgentInfo = () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user'))
      return userInfo
    } catch (error) {
      console.error('Erreur lors de la récupération des infos agent:', error)
      return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!numeroCompte || !montant) {
      alert("Veuillez remplir tous les champs.")
      return
    }

    if (parseFloat(montant) <= 0) {
      alert("Le montant doit être supérieur à 0")
      return
    }

    const agentInfo = getAgentInfo()
    
    if (!agentInfo || !agentInfo.id) {
      alert("Impossible de récupérer les informations de l'agent. Veuillez vous reconnecter.")
      return
    }

    try {
      setLoading(true)

      const transfertData = {
        acteur_type: 'agent',
        numero_compte_expediteur: agentInfo.id,
        numero_compte_destinataire: numeroCompte,
        montant: parseFloat(montant)
      }

      const response = await transactionService.effectuerTransfert(transfertData)

      if (response.success) {
        alert(`✅ Transfert réussi !\n\nMontant: ${montant} FCFA\nVers: ${numeroCompte}`)
        setNumeroCompte("")
        setMontant("")
      } else {
        alert(`❌ Erreur: ${response.message || 'Le transfert a échoué'}`)
      }
    } catch (error) {
      console.error('Erreur lors du transfert:', error)
      alert(`❌ Erreur: ${error.message || 'Une erreur est survenue lors du transfert'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form 
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Dépôt d'argent</h2>
          <p className="text-sm text-gray-600">Effectuer un transfert vers un compte</p>
        </div>

        {/* Numéro de compte */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Numéro de compte destinataire <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={numeroCompte}
            onChange={(e) => setNumeroCompte(e.target.value)}
            placeholder="Ex: 1ZD033"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#20DF7F] focus:border-[#20DF7F] outline-none transition-all"
            disabled={loading}
            required
          />
        </div>

        {/* Montant */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Montant (FCFA) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            placeholder="Ex: 5000"
            min="1"
            step="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#20DF7F] focus:border-[#20DF7F] outline-none transition-all"
            disabled={loading}
            required
          />

          {/* Boutons de montants prédéfinis */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {defaultMontants.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setMontant(val)}
                className={`py-2 rounded-lg text-sm font-semibold border transition-all
                  ${montant == val 
                    ? 'bg-[#20DF7F] text-white border-[#20DF7F]' 
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}
                `}
                disabled={loading}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Infos frais */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <span className="font-semibold">ℹ️ Information:</span> Les transferts effectués par les agents ne comportent pas de frais.
          </p>
        </div>

        {/* Bouton submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#20DF7F] hover:bg-[#1bc970] text-[#224957] hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Traitement en cours...
            </span>
          ) : (
            'Effectuer le dépôt'
          )}
        </button>

        {/* Récapitulatif */}
        {numeroCompte && montant && !loading && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <p className="text-xs text-gray-700">
              <span className="font-semibold">Récapitulatif:</span> Vous allez transférer{' '}
              <span className="font-bold text-[#20DF7F]">{montant} FCFA</span> vers le compte{' '}
              <span className="font-bold">{numeroCompte}</span>
            </p>
          </div>
        )}
      </form>
    </div>
  )
}
