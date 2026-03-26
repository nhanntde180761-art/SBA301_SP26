import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, totalPages, onChangePage, onChange }) => {
  if (totalPages <= 1) return null;

  // Keep backward compatibility for call sites that pass onChange instead of onChangePage.
  const handlePageChange = onChangePage || onChange;

  const handleClick = (newPage) => {
    if (
      newPage >= 0 &&
      newPage < totalPages &&
      newPage !== page &&
      handlePageChange
    ) {
      handlePageChange(newPage);
    }
  };

  return (
    <div className="flex items-center justify-end p-3 border-t border-primary-200 bg-white">
      <button
        onClick={() => handleClick(page - 1)}
        disabled={page === 0}
        className={`p-2 rounded-md border border-primary-200 transition-colors ${
          page === 0
            ? "bg-primary-100 text-primary-400 cursor-not-allowed"
            : "hover:bg-primary-100 text-primary-700"
        }`}
      >
        <ChevronLeft size={18} />
      </button>

      <span className="mx-3 text-sm text-primary-700">
        Trang <span className="font-semibold">{page + 1}</span> / {totalPages}
      </span>

      <button
        onClick={() => handleClick(page + 1)}
        disabled={page === totalPages - 1}
        className={`p-2 rounded-md border border-primary-200 transition-colors ${
          page === totalPages - 1
            ? "bg-primary-100 text-primary-400 cursor-not-allowed"
            : "hover:bg-primary-100 text-primary-700"
        }`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
