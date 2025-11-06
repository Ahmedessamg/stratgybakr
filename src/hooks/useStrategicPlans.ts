import { useState, useEffect, useCallback } from 'react';
import { strategicPlanService, StrategicPlanData } from '../services/supabase/strategicPlan/strategicPlan.service';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface UseStrategicPlansReturn {
  plans: StrategicPlanData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
}

export const useStrategicPlans = (): UseStrategicPlansReturn => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<StrategicPlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await strategicPlanService.getStrategicPlans();
      setPlans(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch strategic plans';
      setError(errorMessage);
      toast.error(t('messages.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const deletePlan = useCallback(async (id: string) => {
    try {
      await strategicPlanService.deleteStrategicPlanById(id);
      setPlans(prev => prev.filter(plan => plan.id !== id));
      toast.success(t('messages.deleteSuccess'));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete strategic plan';
      toast.error(errorMessage);
    }
  }, [t]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return {
    plans,
    loading,
    error,
    refetch: fetchPlans,
    deletePlan,
  };
};
