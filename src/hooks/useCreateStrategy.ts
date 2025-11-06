import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { strategyService } from '../services/supabase/strategy';
import useLocalStorage from './useLocalStorage';
import { ROUTES } from '../constants';

interface Value {
  id: string;
  name: string;
  description: string;
}

interface Pillar {
  id: string;
  name: string;
  description: string;
}

interface StrategyFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  strategicDetails: string;
  visionMission: string;
  focusAreas: string;
}

export const useCreateStrategy = (draftStrategyId: string | null, isEditMode: boolean = false) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Get data from localStorage for values, pillars, and attachments
  const [values] = useLocalStorage<Value[]>('strategyValues', []);
  const [pillars] = useLocalStorage<Pillar[]>('strategyPillars', []);
  const [attachments] = useLocalStorage<AttachmentData[]>('strategyAttachments', []);
  
  // Debug: Log what's in localStorage
  console.log('🔍 useCreateStrategy - localStorage data:', {
    values: values.length,
    pillars: pillars.length,
    attachments: attachments.length,
    attachmentsData: attachments
  });

  interface AttachmentData {
    id: string;
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
  }

  const createStrategy = async (data: StrategyFormData) => {
    if (!draftStrategyId) {
      toast.error(t('messages.saveError'));
      return;
    }

    setLoading(true);

    try {
      // 1. Update strategy with final data
      await strategyService.updateStrategy({
        id: draftStrategyId,
        name: data.name,
        description: data.description || '',
        start_date: data.startDate,
        end_date: data.endDate,
        strategic_details: data.strategicDetails || '',
        vision_mission: data.visionMission || '',
        focus_areas: data.focusAreas || '',
        is_draft: false // Mark as completed
      });

      // 2. Add values if any (only for new strategies, not edit mode)
      if (!isEditMode && values.length > 0) {
        await strategyService.addValues(
          values.map(value => ({
            strategy_id: draftStrategyId,
            name: value.name,
            description: value.description || ''
          }))
        );
      }

      // 3. Add pillars if any (only for new strategies, not edit mode)
      if (!isEditMode && pillars.length > 0) {
        await strategyService.addPillars(
          pillars.map(pillar => ({
            strategy_id: draftStrategyId,
            name: pillar.name,
            description: pillar.description || ''
          }))
        );
      }

      // 4. Get fresh attachments data from localStorage at save time
      const freshAttachments = JSON.parse(localStorage.getItem('strategyAttachments') || '[]');
      console.log('💾 Fresh attachments from localStorage:', freshAttachments);
      
      if (freshAttachments.length > 0) {
        console.log('💾 Saving attachments to database:', freshAttachments);
        for (const attachment of freshAttachments) {
          try {
            await strategyService.addAttachment({
              strategy_id: draftStrategyId,
              file_name: attachment.file_name,
              file_path: attachment.file_path,
              file_size: attachment.file_size,
              file_type: attachment.file_type
            });
            console.log('✅ Attachment saved:', attachment.file_name);
          } catch (attachmentError) {
            console.error('❌ Failed to save attachment:', attachment.file_name, attachmentError);
            // Don't throw, continue with other attachments
          }
        }
      } else {
        console.log('ℹ️ No attachments to save');
      }

      // 5. Save selected goals, values, and pillars from localStorage (add mode only)
      if (!isEditMode) {
        // Save selected strategic goals
        const selectedStrategicGoals = JSON.parse(localStorage.getItem('selectedStrategicGoals') || '[]');
        if (selectedStrategicGoals.length > 0) {
          console.log('💾 Saving selected strategic goals:', selectedStrategicGoals);
          for (const goal of selectedStrategicGoals) {
            try {
              await strategyService.addStrategicGoal({
                strategy_id: draftStrategyId,
                name: goal.name,
                duration: goal.duration,
                element: goal.element,
                description: goal.description,
                status: goal.status
              });
              console.log('✅ Strategic goal saved:', goal.name);
            } catch (error) {
              console.error('❌ Failed to save strategic goal:', goal.name, error);
            }
          }
        }

        // Save selected operational goals
        const selectedOperationalGoals = JSON.parse(localStorage.getItem('selectedOperationalGoals') || '[]');
        if (selectedOperationalGoals.length > 0) {
          console.log('💾 Saving selected operational goals:', selectedOperationalGoals);
          for (const goal of selectedOperationalGoals) {
            try {
              await strategyService.addOperationalGoal({
                strategy_id: draftStrategyId,
                name: goal.name,
                duration: goal.duration,
                element: goal.element,
                description: goal.description,
                status: goal.status
              });
              console.log('✅ Operational goal saved:', goal.name);
            } catch (error) {
              console.error('❌ Failed to save operational goal:', goal.name, error);
            }
          }
        }

        // Save selected values
        const selectedValues = JSON.parse(localStorage.getItem('selectedValues') || '[]');
        if (selectedValues.length > 0) {
          console.log('💾 Saving selected values:', selectedValues);
          for (const value of selectedValues) {
            try {
              await strategyService.addValue({
                strategy_id: draftStrategyId,
                name: value.name,
                description: value.description
              });
              console.log('✅ Value saved:', value.name);
            } catch (error) {
              console.error('❌ Failed to save value:', value.name, error);
            }
          }
        }

        // Save selected pillars
        const selectedPillars = JSON.parse(localStorage.getItem('selectedPillars') || '[]');
        if (selectedPillars.length > 0) {
          console.log('💾 Saving selected pillars:', selectedPillars);
          for (const pillar of selectedPillars) {
            try {
              await strategyService.addPillar({
                strategy_id: draftStrategyId,
                name: pillar.name,
                description: pillar.description
              });
              console.log('✅ Pillar saved:', pillar.name);
            } catch (error) {
              console.error('❌ Failed to save pillar:', pillar.name, error);
            }
          }
        }
      }

      // Clear localStorage after successful save (only for new strategies)
      if (!isEditMode) {
        localStorage.removeItem('draftStrategyId');
        localStorage.removeItem('strategyValues');
        localStorage.removeItem('strategyPillars');
        localStorage.removeItem('selectedStrategicGoals');
        localStorage.removeItem('selectedOperationalGoals');
        localStorage.removeItem('selectedValues');
        localStorage.removeItem('selectedPillars');
      }
      
      // Always clear attachments localStorage after save
      localStorage.removeItem('strategyAttachments');

      // Show success toast
      const successMessage = isEditMode 
        ? t('messages.updateSuccess') || 'Strategy updated successfully'
        : t('messages.saveSuccess');
      toast.success(successMessage);

      // Navigate based on mode
      if (isEditMode) {
        navigate(`${ROUTES.STRATEGY_VIEW.replace(':id', draftStrategyId)}`);
      } else {
        navigate(ROUTES.STRATEGY);
      }
    } catch (err) {
      const error = err as Error;
      // Show error toast
      const errorMessage = isEditMode 
        ? t('messages.updateError') || 'Failed to update strategy'
        : t('messages.saveError');
      toast.error(error.message || errorMessage);
      console.error('Error saving strategy:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveAsDraft = async () => {
    // TODO: Implement save as draft functionality
    toast.info(t('common.loading'));
  };

  return {
    loading,
    createStrategy,
    saveAsDraft
  };
};
