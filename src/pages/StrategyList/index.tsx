import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Plus, Home as HomeIcon } from "lucide-react";
import { useBreadcrumb, useStrategies } from "../../hooks";
import { ROUTES } from "../../constants";
import { Button, EmptyState, Modal } from "../../components/ui";
import { FilterBar, StrategyCard } from "./components";
import "./index.scss";

interface FilterData {
  searchBy: string;
  searchValue: string;
  sortBy: string;
}

  // Helper function to parse Arabic dates
  const parseArabicDate = (dateStr: string): Date => {
    const arabicMonths: { [key: string]: number } = {
      'يناير': 0, 'فبراير': 1, 'مارس': 2, 'أبريل': 3,
      'مايو': 4, 'يونيو': 5, 'يوليو': 6, 'أغسطس': 7,
      'سبتمبر': 8, 'أكتوبر': 9, 'نوفمبر': 10, 'ديسمبر': 11
    };
    
    const parts = dateStr.split(' ');
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = arabicMonths[parts[1]];
      const year = parseInt(parts[2]);
      return new Date(year, month, day);
    }
    return new Date();
  };


const StrategyList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setBreadcrumb } = useBreadcrumb();
  const { strategies, loading, error, deleteStrategy } = useStrategies();
  
  const [filters, setFilters] = useState<FilterData>({
    searchBy: "name",
    searchValue: "",
    sortBy: "date",
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [strategyToDelete, setStrategyToDelete] = useState<string | null>(null);

  useEffect(() => {
    setBreadcrumb(
      [
        { label: <HomeIcon size={16} />, url: ROUTES.HOME },
        { label: t("nav.home"), url: ROUTES.HOME },
      ],
      t("nav.strategy"),
      <Button
        icon={<Plus className="w-5 h-5" />}
        onClick={() => navigate(ROUTES.STRATEGY_NEW)}
      >
        {t("strategy.addNew")}
      </Button>
    );
  }, [t, setBreadcrumb, navigate]);

  // Filter and sort strategies
  const filteredStrategies = useMemo(() => {
    let result = [...strategies];

    // Apply search filter
    if (filters.searchValue.trim()) {
      const searchLower = filters.searchValue.toLowerCase().trim();
      
      result = result.filter((strategy) => {
        switch (filters.searchBy) {
          case "name":
            return strategy.name.toLowerCase().includes(searchLower);
          case "description":
            return (
              strategy.name.toLowerCase().includes(searchLower) ||
              strategy.description?.toLowerCase().includes(searchLower)
            );
          case "goals":
            return (
              strategy.name.toLowerCase().includes(searchLower) ||
              strategy.goals?.some((goal) =>
                goal.toLowerCase().includes(searchLower)
              )
            );
          default:
            return strategy.name.toLowerCase().includes(searchLower);
        }
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name, "ar");
        case "date": {
          // Sort by end date - parse Arabic dates
          const dateA = parseArabicDate(a.endDate);
          const dateB = parseArabicDate(b.endDate);
          return dateB.getTime() - dateA.getTime();
        }
        case "status": {
          // Sort by status priority: active > draft > completed > archived
          const statusOrder = { active: 0, draft: 1, completed: 2, archived: 3 };
          const orderA = statusOrder[a.status || 'draft'];
          const orderB = statusOrder[b.status || 'draft'];
          return orderA - orderB;
        }
        case "progress":
          // Sort by progress (highest first)
          return (b.progress || 0) - (a.progress || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [strategies, filters]);


  const handleFilterChange = useCallback((newFilters: FilterData) => {
    setFilters(newFilters);
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/strategy/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setStrategyToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (strategyToDelete) {
      try {
        await deleteStrategy(strategyToDelete);
        setDeleteModalOpen(false);
        setStrategyToDelete(null);
      } catch  {
        // Error is already handled in the hook
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setStrategyToDelete(null);
  };

  const handleView = (id: string) => {
    navigate(`/strategy/view/${id}`);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="strategy-list">
        <div className="flex items-center justify-center py-12">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="strategy-list">
        <div className="flex items-center justify-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="strategy-list">
      {strategies?.length > 0 ? (
        <>
          <div className="strategy-list__filter">
            <FilterBar onFilterChange={handleFilterChange} />
          </div>

          <div className="strategy-list__content">
            {filteredStrategies.length > 0 ? (
              <div className="strategy-list__grid">
                {filteredStrategies.map((strategy) => (
                  <StrategyCard
                    key={strategy.id}
                    strategy={strategy}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                message={t("strategy.noResults")} 
                image="/nodata.svg"
              />
            )}
          </div>
        </>
      ) : (
        <EmptyState message={t("strategy.noStrategies")} image="/nodata.svg" />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        title={t("strategy.deleteConfirmTitle")}
      >
        <div className="strategy-list__delete-modal">
          <p className="strategy-list__delete-message">
            {t("strategy.deleteConfirmMessage")}
          </p>
          <div className="strategy-list__delete-actions">
            <Button variant="secondary" onClick={cancelDelete}>
              {t("strategy.cancelDelete")}
            </Button>
            <Button 
              variant="primary" 
              onClick={confirmDelete}
              className="strategy-list__delete-btn"
            >
              {t("strategy.confirmDelete")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StrategyList;
