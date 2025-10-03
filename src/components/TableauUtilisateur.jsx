// src/components/TableauUtilisateur.jsx
function TableauUtilisateur({ utilisateurs, loading }) {
  // Fonction pour formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#20DF7F]"></div>
      </div>
    );
  }

  if (!utilisateurs || utilisateurs.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <p className="text-gray-500 text-lg">Aucun utilisateur trouvé</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-auto min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
        <thead className="bg-[#20DF7F] border-b-2 border-gray-200">
          <tr>
            <th className="p-2 md:py-3 lg:p-3 text-[10px] md:text-sm lg:text-lg text-[#093545] font-montserrat font-bold tracking-wide text-center">
              Prénom Nom
            </th>
            <th className="p-2 md:py-3 lg:p-3 text-[10px] md:text-sm lg:text-lg text-[#093545] font-montserrat font-bold tracking-wide text-center">
              Date création
            </th>
            <th className="p-2 md:py-3 lg:p-3 text-[10px] md:text-sm lg:text-lg text-[#093545] font-montserrat font-bold tracking-wide text-center">
              Téléphone
            </th>
            <th className="p-2 md:py-3 lg:p-3 text-[10px] md:text-sm lg:text-lg text-[#093545] font-montserrat font-bold tracking-wide text-center">
              Type
            </th>
            <th className="p-2 py-3 lg:p-3 text-[10px] md:text-sm lg:text-lg text-[#093545] font-montserrat font-bold tracking-wide text-center">
              Statut
            </th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map((user, index) => (
            <tr key={user.id || index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="p-2 lg:p-3 text-center text-[10px] sm:text-[11px] md:text-sm text-gray-700 font-montserrat font-medium">
                {user.prenom} {user.nom}
              </td>
              <td className="p-2 lg:p-3 text-center text-[10px] sm:text-[11px] md:text-sm text-gray-700 font-montserrat font-medium">
                {formatDate(user.date_creation)}
              </td>
              <td className="p-2 lg:p-3 text-center text-[10px] sm:text-[11px] md:text-sm text-gray-700 font-montserrat font-medium">
                {user.telephone}
              </td>
              <td className="p-2 lg:p-3 text-center text-[10px] sm:text-[11px] md:text-sm text-gray-700 font-montserrat font-medium">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  user.role === 'client' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {user.role === 'client' ? 'Client' : 'Distributeur'}
                </span>
              </td>
              <td className={`p-2 md:p-3 text-center text-[10px] sm:text-[11px] md:text-sm font-montserrat font-medium ${
                user.statut === 'actif' ? 'text-[#20DF7F]' : 'text-[#FF0000]'
              }`}>
                {user.statut === 'actif' ? 'Actif' : 'Bloqué'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableauUtilisateur;