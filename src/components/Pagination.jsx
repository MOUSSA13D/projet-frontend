"use client"

function Pagination({ currentPage, totalPages, onPageChange }) {
  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages = []
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center mt-10">
      <div>
        <nav className="isolate inline-flex gap-2 rounded-md" aria-label="Pagination">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`relative inline-flex items-center rounded px-2 py-2 text-xs md:text-xl ${
              currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Previous
          </button>

          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`inline-flex items-center px-3 md:px-4 md:py-0 text-[14px] md:text-xs font-semibold rounded-full transition-colors ${
                currentPage === pageNum ? "bg-[#20DF7F] text-gray-900" : "bg-[#ffffff] text-gray-900 hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`relative inline-flex items-center rounded-r-md px-4 py-2 text-xs md:text-xl focus:z-20 focus:outline-offset-0 ${
              currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-[#000000] hover:text-gray-600"
            }`}
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  )
}

export default Pagination
