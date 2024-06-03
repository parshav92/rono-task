import React from "react";

const Pagination = ({ currentPage, totalPages, paginate }) => {
  const pageNumbers = [];
  const maxPagesToShow = 3;

  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage < maxPagesToShow - 1) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-end items-center mt-4 space-x-2">
      <button
        className={`py-1 px-3 text-sm ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-500 hover:text-blue-600"
        }`}
        onClick={() => paginate(1)}
        disabled={currentPage === 1}
      >
        {"<<"}
      </button>
      <button
        className={`py-1 px-3 text-sm ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-500 hover:text-blue-600"
        }`}
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {"<"}
      </button>
      <div className="flex space-x-1">
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`py-1 px-3 text-sm ${
              currentPage === pageNumber
                ? "text-blue-500 cursor-not-allowed"
                : "text-blue-400 hover:text-blue-600"
            }`}
            onClick={() => paginate(pageNumber)}
            disabled={currentPage === pageNumber}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button
        className={`py-1 px-3 text-sm ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-500 hover:text-blue-600"
        }`}
        onClick={() => paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {">"}
      </button>
      <button
        className={`py-1 px-3 text-sm ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-blue-500 hover:text-blue-600"
        }`}
        onClick={() => paginate(totalPages)}
        disabled={currentPage === totalPages}
      >
        {">>"}
      </button>
    </div>
  );
};

export default Pagination;
