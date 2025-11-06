import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { strategyService } from '../services/supabase/strategy';
import { mapStrategyToUI } from '../utils/strategyMapper';
import type { Strategy as UIStrategy } from '../pages/StrategyList/components/StrategyCard/StrategyCard';

interface UseStrategyReturn {
  strategy: UIStrategy | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStrategy = (strategyId: string | undefined): UseStrategyReturn => {
  const { t } = useTranslation();
  const [strategy, setStrategy] = useState<UIStrategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStrategy = useCallback(async () => {
    if (!strategyId) {
      setStrategy(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const dbStrategy = await strategyService.getStrategy(strategyId);
      const uiStrategy = mapStrategyToUI(dbStrategy);
      
      setStrategy(uiStrategy);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch strategy';
      setError(errorMessage);
      toast.error(t('errors.fetchStrategy') || 'Failed to fetch strategy');
    } finally {
      setLoading(false);
    }
  }, [strategyId, t]);

  const refetch = useCallback(async () => {
    await fetchStrategy();
  }, [fetchStrategy]);

  useEffect(() => {
    fetchStrategy();
  }, [fetchStrategy]);

  return {
    strategy,
    loading,
    error,
    refetch
  };
};
