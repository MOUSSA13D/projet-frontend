import React from 'react'
import { FaEdit, FaArchive } from "react-icons/fa"
import { MdBlock, MdDelete } from "react-icons/md"

export default function TableauClientDistributeur({ 
  clients, 
  onEdit, 
  onBlock, 
  onArchive,
  selectedUsers = [],
  onSelectUser,
  onSelectAll,
  showCheckboxes = false
}) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto min-w-full bg-white rounded-lg overflow-hidden">
        <thead className="bg-[#20DF7F] border-b-2 border-gray-200">
          <tr>
            {showCheckboxes && (
              <th className="p-0 md:py-3 lg:p-3 text-center">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === clients.length && clients.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 cursor-pointer"
                />
              </th>
            )}
            <th className="p-0 md:py-3 lg:p-3 text-[10px] md:text-sm lg:text-lg text-[#093545] font-montserrat font-bold tracking-wide text-center">
              Prenom Nom
            </th>
            <th className="p-0 md:py-3 lg:p-3 text-[10px] md:text-sm lg:text-lg text-[#093545] font-montserrat font-bold tracking-wide text-center">
              Date creation
            </th>
            <th className="p-0 md:py-3 lg:p-3 text-[10px] md:text-sm lg:text-lg text-[#093545] font-montserrat font-bold tracking-wide text-center">
              Numero Compte
            </th>
            <th className="p-0 md:py-3 lg:p-3 text-[10px] md:text-sm lg:text-lg text-[#093545] font-montserrat font-bold tracking-wide text-center">
              Telephone
            </th>
            <th className="p-0 py-3 lg:p-3 text-[10px] md:text-sm lg:text-lg text-[#093545] font-montserrat font-bold tracking-wide text-center">
              Statut
            </th>
            <th className="p-0 py-3 lg:p-3 text-[10px] md:text-sm lg:text-lg text-[#093545] font-montserrat font-bold tracking-wide text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
              {showCheckboxes && (
                <td className="p-0 lg:p-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(client.id)}
                    onChange={() => onSelectUser(client.id)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>
              )}
              <td className="p-0 lg:p-3 text-center text-[10px] sm:text-[11px] md:text-sm text-gray-700 font-montserrat font-medium">
                {client.nom}
              </td>
              <td className="p-0 lg:p-3 text-center text-[10px] sm:text-[11px] md:text-sm text-gray-700 font-montserrat font-medium">
                {client.dateCreation}
              </td>
              <td className="p-0 lg:p-3 text-center text-[10px] sm:text-[11px] md:text-sm text-gray-700 font-montserrat font-medium">
                {client.numeroCompte}
              </td>
              <td className="p-0 lg:p-3 text-center text-[10px] sm:text-[11px] md:text-sm text-gray-700 font-montserrat font-medium">
                {client.telephone}
              </td>
              <td className={`p-0 md:p-3 text-center text-[10px] sm:text-[11px] md:text-sm font-montserrat font-medium ${
                client.statut === "Actif" ? "text-[#20DF7F]" : "text-[#FF0000]"
              }`}>
                {client.statut}
              </td>
              <td className="p-0 lg:p-3 text-center">
                <div className="flex justify-center gap-2 lg:gap-3">
                  <button
                    onClick={() => onEdit(client)}
                    className="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                    title="Modifier"
                  >
                    <FaEdit className="text-sm md:text-base lg:text-lg" />
                  </button>
                  <button
                    onClick={() => onBlock(client)}
                    className="text-red-600 cursor-pointer hover:text-red-800 transition-colors"
                    title={client.statut === "Actif" ? "Bloquer" : "Débloquer"}
                  >
                    <MdBlock className="text-sm md:text-base lg:text-lg" />
                  </button>
                  <button
                    onClick={() => onArchive(client)}
                    className="text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
                    title="Supprimer"
                  >
                    <MdDelete className="text-sm text-red-600 md:text-base lg:text-lg" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}