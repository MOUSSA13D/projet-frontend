import React from 'react';
import { MdClose, MdWarning, MdBlock, MdCheckCircle } from 'react-icons/md';

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  userName,
  actionType = 'delete' // 'delete', 'block', 'unblock'
}) {
  if (!isOpen) return null;

  // Définir l'icône et les couleurs selon le type d'action
  const getActionConfig = () => {
    switch(actionType) {
      case 'block':
        return {
          icon: <MdBlock className="text-4xl text-orange-600" />,
          bgColor: 'bg-orange-100',
          borderColor: 'border-orange-500',
          textColor: 'text-orange-700',
          buttonColor: 'bg-orange-600 hover:bg-orange-700',
          buttonText: 'Bloquer'
        };
      case 'unblock':
        return {
          icon: <MdCheckCircle className="text-4xl text-green-600" />,
          bgColor: 'bg-green-100',
          borderColor: 'border-green-500',
          textColor: 'text-green-700',
          buttonColor: 'bg-green-600 hover:bg-green-700',
          buttonText: 'Débloquer'
        };
      default: // 'delete'
        return {
          icon: <MdWarning className="text-4xl text-red-600" />,
          bgColor: 'bg-red-100',
          borderColor: 'border-red-500',
          textColor: 'text-red-700',
          buttonColor: 'bg-red-600 hover:bg-red-700',
          buttonText: 'Supprimer'
        };
    }
  };

  const config = getActionConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl w-11/12 max-w-md p-6 animate-fadeIn">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <MdClose className="text-2xl" />
        </button>

        {/* Icône */}
        <div className="flex justify-center mb-4">
          <div className={`${config.bgColor} rounded-full p-3`}>
            {config.icon}
          </div>
        </div>

        {/* Titre */}
        <h2 className="text-xl font-montserrat font-bold text-center text-gray-800 mb-3">
          {title}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 font-montserrat mb-2">
          {message}
        </p>
        {userName && (
          <p className="text-center font-montserrat font-semibold text-gray-800 mb-6">
            {userName} ?
          </p>
        )}

        {/* Avertissement */}
        {actionType === 'delete' && (
          <div className={`${config.bgColor} border-l-4 ${config.borderColor} p-3 mb-6`}>
            <p className={`text-sm ${config.textColor} font-montserrat`}>
              ⚠️ Cette action est irréversible
            </p>
          </div>
        )}

        {/* Boutons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-md font-montserrat font-medium hover:bg-gray-300 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-6 py-2.5 text-white rounded-md font-montserrat font-medium transition-colors ${config.buttonColor}`}
          >
            {config.buttonText}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}