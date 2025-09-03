"use client";

interface PaginationProps<T> {
  data: T[];
  itemsPerPage?: number;
  label?: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export default function Pagination<T>({
  data,
  itemsPerPage = 5,
  label = "éléments",
  currentPage,
  setCurrentPage
}: PaginationProps<T>) {
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  const renderPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handlePageChange = (page: number | string) => {
    if (typeof page === 'number') {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {data.length > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">
            Affichage de {indexOfFirstItem + 1} à{" "}
            {Math.min(indexOfFirstItem + itemsPerPage, data.length)} sur{" "}
            {data.length} {label}
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50 border-green-700 text-green-700"
            >
              Précédent
            </button>

            {renderPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(page)}
                disabled={page === '...' || page === currentPage}
                className={`px-3 py-1 rounded border text-sm ${
                  page === currentPage ? 'bg-green-800 text-white' : ''
                } disabled:opacity-50`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border text-sm disabled:opacity-50 border-green-700 text-green-700"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </>
  );
}