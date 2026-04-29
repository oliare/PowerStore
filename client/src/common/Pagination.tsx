import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 2;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - showMax && i <= currentPage + showMax)
      ) {
        pages.push(i);
      } else if (
        i === currentPage - showMax - 1 ||
        i === currentPage + showMax + 1
      ) {
        pages.push("...");
      }
    }
    return pages.filter((page, index, array) => array.indexOf(page) === index);
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12 pb-10">
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageClick(currentPage - 1)}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 disabled:opacity-20 hover:border-brand-primary transition-colors text-gray-400 hover:text-brand-primary"
      >
        <ChevronLeft size={18} />
      </button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span
            key={`dots-${index}`}
            className="px-2 text-gray-400 select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageClick(Number(page))}
            className={`w-10 h-10 flex items-center justify-center rounded-full border text-sm font-bold transition-all ${
              currentPage === page
                ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20"
                : "border-gray-200 text-gray-600 hover:border-brand-primary hover:text-brand-primary"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageClick(currentPage + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 disabled:opacity-20 hover:border-brand-primary transition-colors text-gray-400 hover:text-brand-primary"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
