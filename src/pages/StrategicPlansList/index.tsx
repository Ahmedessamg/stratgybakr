import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Plus, Home as HomeIcon } from "lucide-react";
import { useBreadcrumb, useStrategicPlans } from "../../hooks";
import { ROUTES } from "../../constants";
import { Button, EmptyState, Modal } from "../../components/ui";
import { StrategicPlanFilterBar, StrategicPlanCard } from "./components";
import type { StrategicPlan } from "./components/StrategicPlanCard";
import { StrategicPlanData } from "../../services/supabase/strategicPlan/strategicPlan.service";
import dayjs from "dayjs";
import "./index.scss";

interface FilterData {
  department: string;
  owner: string;
  period: string;
}

// Mapper function to transform database data to UI format
const mapStrategicPlanToUI = (plan: StrategicPlanData): StrategicPlan => {
  return {
    id: plan.id,
    name: plan.name,
    startDate: plan.created_at ? dayjs(plan.created_at).format('DD MMMM YYYY') : '',
    endDate: plan.updated_at ? dayjs(plan.updated_at).format('DD MMMM YYYY') : '',
    status: plan.is_active ? 'active' : 'draft',
    owner: plan.owner || 'غير محدد',
    ownerRole: 'المالك',
    department: 'it' // Default department since we don't have this field in the database yet
  };
};

const StrategicPlansList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setBreadcrumb } = useBreadcrumb();
  const { plans: rawPlans, loading, deletePlan } = useStrategicPlans();
  
  const [filters, setFilters] = useState<FilterData>({
    department: "all",
    owner: "all",
    period: "all",
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);

  // Transform raw plans to UI format
  const plans = useMemo(() => rawPlans.map(mapStrategicPlanToUI), [rawPlans]);

  useEffect(() => {
    setBreadcrumb(
      [
        { label: <HomeIcon size={16} />, url: ROUTES.HOME },
        { label: t("nav.home"), url: ROUTES.HOME },
      ],
      t("nav.strategicPlans"),
      <Button
        icon={<Plus className="w-5 h-5" />}
        onClick={() => navigate(ROUTES.STRATEGIC_PLANS_NEW)}
      >
        {t("strategicPlans.createNew")}
      </Button>
    );
  }, [t, setBreadcrumb, navigate]);

  const filteredPlans = useMemo(() => {
    let result = [...plans];

    if (filters.department !== 'all') {
      result = result.filter((plan) => plan.department === filters.department);
    }

    if (filters.owner !== 'all') {
      result = result.filter((plan) => {
        const ownerMap: { [key: string]: string } = {
          'owner1': 'مراد عبداللطيف',
          'owner2': 'أحمد محمد',
          'owner3': 'سارة أحمد'
        };
        return plan.owner === ownerMap[filters.owner];
      });
    }

    return result;
  }, [plans, filters]);

  const handleFilterChange = useCallback((newFilters: FilterData) => {
    setFilters(newFilters);
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/strategic-plans/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setPlanToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (planToDelete) {
      await deletePlan(planToDelete);
      setDeleteModalOpen(false);
      setPlanToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setPlanToDelete(null);
  };

  const handleView = (id: string) => {
    navigate(`/strategic-plans/view/${id}`);
  };

  if (loading) {
    return (
      <div className="strategic-plans-list">
        <div className="flex items-center justify-center py-12">
          <div className="text-sm text-gray-500">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="strategic-plans-list">
      {plans?.length > 0 ? (
        <>
          <div className="strategic-plans-list__filter">
            <StrategicPlanFilterBar onFilterChange={handleFilterChange} />
          </div>

          <div className="strategic-plans-list__content">
            {filteredPlans.length > 0 ? (
              <div className="strategic-plans-list__grid">
                {filteredPlans.map((plan) => (
                  <StrategicPlanCard
                    key={plan.id}
                    plan={plan}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onView={handleView}
                  />
                ))}
              </div>
            ) : (
              <EmptyState 
                message={t("strategicPlans.noResults")} 
                image="/nodata.svg"
              />
            )}
          </div>
        </>
      ) : (
        <EmptyState message={t("strategicPlans.noPlans")} image="/nodata.svg" />
      )}

      <Modal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        title={t("strategicPlans.deleteConfirmTitle")}
      >
        <div className="strategic-plans-list__delete-modal">
          <p className="strategic-plans-list__delete-message">
            {t("strategicPlans.deleteConfirmMessage")}
          </p>
          <div className="strategic-plans-list__delete-actions">
            <Button variant="secondary" onClick={cancelDelete}>
              {t("strategicPlans.cancelDelete")}
            </Button>
            <Button 
              variant="primary" 
              onClick={confirmDelete}
              className="strategic-plans-list__delete-btn"
            >
              {t("strategicPlans.confirmDelete")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StrategicPlansList;

