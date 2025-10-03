


// src/pages/Accueil.jsx
import { useState } from "react";
import BlockCard from "../components/BlockCard";
import CreerUtilisateur from "../agent/CreerUtilisateur";
import TableauUtilisateur from "../components/TableauUtilisateur";
import Pagination from "../components/Pagination";
import useUsers from "../hooks/useUsers";

export default function Accueil() {
  const { statistics, users, loading, error, refreshData } = useUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const utilisateursParPage = 8;

  const indexDernier = currentPage * utilisateursParPage;
  const indexPremier = indexDernier - utilisateursParPage;
  const utilisateursActuels = users.slice(indexPremier, indexDernier);

  const totalPages = Math.ceil(users.length / utilisateursParPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    refreshData();
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="flex-row justify-center items-center w-full min-h-screen pt-10 pb-20 sm:py-10 p-2 sm:pl-14">
        {/* Messages d'erreur */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Cartes de statistiques */}
        <div className="flex flex-row gap-2 md:gap-10 justify-center w-full">
          <div className="flex justify-center md:mt-0">
       <BlockCard
  param0="w-40 h-40 lg:w-50 lg:h-50 bg-white rounded-full shadow-md"
  param="text-[#20DF7F]"
  contenu="Total Clients"
  nombre={statistics.totalClients}
  loading={loading}
/>


          </div>

          <div className="flex justify-center md:mt-0">
            <BlockCard
  param0="w-40 h-40 lg:w-50 lg:h-50 bg-white rounded-full shadow-md"
              param="ms-1 text-base text-[#FF0000]"
              contenu="Total Distributeur"
              nombre={statistics.totalDistributeurs}
              loading={loading}
            />
          </div>

         
             <div className="flex justify-center md:mt-0">
            <BlockCard
  param0="w-40 h-40 lg:w-50 lg:h-50 bg-white rounded-full shadow-md"
              param="ms-1 text-base text-[#FF0000]"
              contenu="Total Agents"
              nombre={statistics.totalAgents}
              loading={loading}/>
            </div>
              </div>
        <div className="flex justify-end mt-5 ">
          <button
            type="submit"
            onClick={openModal}
            className="flex-none cursor-pointer rounded-md bg-[#093545] ms-4 px-5 py-2.5 text-md font-montserrat font-semibold text-white shadow-sm hover:bg-[#394346] "
          >
            Creer Utilisateur
          </button>
          <CreerUtilisateur isOpen={isModalOpen} onClose={closeModal} onSuccess={handleSuccess} />
        </div>
        <div className="mt-5 mr-5">
          <TableauUtilisateur utilisateurs={utilisateursActuels} loading={loading} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </div>
  )
}
