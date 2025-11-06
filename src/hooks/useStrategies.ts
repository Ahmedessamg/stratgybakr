import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { strategyService } from '../services/supabase/strategy';
import { mapStrategiesToUI } from '../utils/strategyMapper';
import type { Strategy as UIStrategy } from '../pages/StrategyList/components/StrategyCard/StrategyCard';

interface UseStrategiesReturn {
  strategies: UIStrategy[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  deleteStrategy: (id: string) => Promise<void>;
}

export const useStrategies = (): UseStrategiesReturn => {
  const { t } = useTranslation();
  const [strategies, setStrategies] = useState<UIStrategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStrategies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dbStrategies = await strategyService.getStrategies();
      const uiStrategies = mapStrategiesToUI(dbStrategies);
      
      setStrategies(uiStrategies);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch strategies';
      setError(errorMessage);
      toast.error(t('errors.fetchStrategies') || 'Failed to fetch strategies');
    } finally {
      setLoading(false);
    }
  }, [t]);

  const deleteStrategy = useCallback(async (id: string) => {
    try {
      await strategyService.deleteStrategy(id);
      setStrategies(prev => prev.filter(strategy => strategy.id !== id));
      toast.success(t('messages.deleteSuccess') || 'Strategy deleted successfully');
    } catch (err) {
       toast.error(t('errors.deleteStrategy') || 'Failed to delete strategy');
      throw err;
    }
  }, [t]);

  const refetch = useCallback(async () => {
    await fetchStrategies();
  }, [fetchStrategies]);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  return {
    strategies,
    loading,
    error,
    refetch,
    deleteStrategy
  };
};
