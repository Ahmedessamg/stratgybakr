import { useState, useEffect } from 'react';
import { strategicPlanService, StrategicPlanData } from '@/services/supabase/strategicPlan/strategicPlan.service';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface UseStrategicPlanReturn {
  plan: StrategicPlanData | null;
  loading: boolean;
  error: string | null;
}

export const useStrategicPlan = (id: string | undefined): UseStrategicPlanReturn => {
  const { t } = useTranslation();
  const [plan, setPlan] = useState<StrategicPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await strategicPlanService.getStrategicPlan(id);
        setPlan(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch strategic plan';
        setError(errorMessage);
        toast.error(t('messages.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id, t]);

  return {
    plan,
    loading,
    error,
  };
};
