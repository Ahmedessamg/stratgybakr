import { useState, useEffect } from 'react';
import { strategyService } from '../services/supabase/strategy';

/**
 * Hook to manage draft strategy
 * Creates a draft strategy on mount and provides the strategy ID
 * for saving goals, values, and pillars
 * If existingStrategyId is provided, uses that instead of creating a draft
 */
export const useDraftStrategy = (existingStrategyId?: string) => {
  const [draftStrategyId, setDraftStrategyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDraftStrategy = async () => {
      try {
        // If editing existing strategy, use that ID
        if (existingStrategyId) {
          setDraftStrategyId(existingStrategyId);
          setLoading(false);
          return;
        }

        // Check if there's a draft strategy ID in localStorage
        const existingDraftId = localStorage.getItem('draftStrategyId');
        
        if (existingDraftId) {
          // Verify the draft still exists in database
          try {
            await strategyService.getStrategy(existingDraftId);
            setDraftStrategyId(existingDraftId);
          } catch {
            // Draft doesn't exist, create new one
            await createNewDraft();
          }
        } else {
          // No existing draft, create new one
          await createNewDraft();
        }
      } catch (error) {
        console.error('Error initializing draft strategy:', error);
      } finally {
        setLoading(false);
      }
    };

    const createNewDraft = async () => {
      const draft = await strategyService.createStrategy({
        name: 'مسودة استراتيجية',
        description: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date().toISOString().split('T')[0],
        strategic_details: '',
        vision_mission: '',
        focus_areas: '',
        is_draft: true
      });
      
      setDraftStrategyId(draft.id);
      localStorage.setItem('draftStrategyId', draft.id);
    };

    initDraftStrategy();
  }, [existingStrategyId]);

  const clearDraft = () => {
    localStorage.removeItem('draftStrategyId');
    setDraftStrategyId(null);
  };

  return {
    draftStrategyId,
    loading,
    clearDraft
  };
};
