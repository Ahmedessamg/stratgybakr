import { useTranslation } from "react-i18next";
import { ChevronLeft } from "lucide-react";
import "./Pagination.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: PaginationProps) => {
  const { t } = useTranslation();

  const renderPagination = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination-footer">
      <div className="pagination-controls">
        <span className="pagination-label">
          {t("strategicPlans.policies.itemsPerPage")}
        </span>
        <div className="pagination-select">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pagination">
        <button
          className="pagination__btn pagination__btn--prev"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        {renderPagination().map((page, index) =>
          page === "..." ? (
            <button
              key={`dots-${index}`}
              className="pagination__btn pagination__btn--dots"
              disabled
            >
              ...
            </button>
          ) : (
            <button
              key={page}
              className={`pagination__btn ${
                page === currentPage ? "pagination__btn--active" : ""
              }`}
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </button>
          )
        )}
        <button
          className="pagination__btn pagination__btn--next"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronLeft size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
