import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AddCircle } from '@/components/icons/svg';
import { Trash2 } from 'lucide-react';
import { strategyService } from '@/services/supabase/strategy';
import { GoalItem } from '../../shared';
import AddOperationalGoalModal from '@/pages/CreateStrategy/components/AddOperationalGoalModal';
import type { Goal } from '@/pages/CreateStrategy/components/AddStrategicGoalModal';
import './styles.scss';

const OperationalGoalsTab = () => {
  const { t, i18n } = useTranslation();
  const { id: strategyId } = useParams<{ id: string }>();
  const isRTL = i18n.language === 'ar';
  
  const [operationalGoals, setOperationalGoals] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Load operational goals for this strategy
  const loadOperationalGoals = useCallback(async () => {
    if (!strategyId) return;
    
    try {
      setLoading(true);
      const goals = await strategyService.getOperationalGoals(strategyId);
      setOperationalGoals(goals);
    } catch (error) {
      console.error('Error loading operational goals:', error);
      toast.error(t('messages.loadError'));
    } finally {
      setLoading(false);
    }
  }, [strategyId, t]);

  // Load goals when component mounts or strategy changes
  useEffect(() => {
    loadOperationalGoals();
  }, [strategyId, loadOperationalGoals]);

  const handleAddGoal = () => {
    setEditGoal(null);
    setIsModalOpen(true);
  };

  const handleEditGoal = (goal: any) => {
    setEditGoal({
      id: goal.id,
      name: goal.name,
      duration: goal.duration,
      element: goal.element,
      description: goal.description || '',
      status: goal.status
    });
    setIsModalOpen(true);
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await strategyService.deleteOperationalGoal(goalId);
      toast.success(t('messages.deleteSuccess'));
      await loadOperationalGoals(); // Reload to refresh the list
    } catch (error) {
      console.error('Error deleting operational goal:', error);
      toast.error(t('messages.deleteError'));
    }
  };

  const handleSaveGoal = async (goal: Goal) => {
    if (!strategyId) {
      toast.error(t('messages.saveError'));
      return;
    }

    try {
      setLoading(true);
      
      if (editGoal) {
        // Update existing goal
        await strategyService.updateOperationalGoal(editGoal.id, {
          name: goal.name,
          duration: goal.duration,
          element: goal.element,
          description: goal.description || '',
          status: goal.status,
          strategy_id: strategyId
        });
        toast.success(t('messages.updateSuccess'));
      } else {
        // Add new goal
        await strategyService.addOperationalGoal({
          strategy_id: strategyId,
          name: goal.name,
          duration: goal.duration,
          element: goal.element,
          description: goal.description || '',
          status: goal.status
        });
        toast.success(t('messages.saveSuccess'));
      }
      
      // Reload goals from database
      await loadOperationalGoals();
      setIsModalOpen(false);
      setEditGoal(null);
    } catch (err) {
      console.error('Error saving operational goal:', err);
      const error = err as Error;
      const errorMessage = error?.message || t('messages.saveError');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditGoal(null);
  };

  const handleSelectItem = (goalId: string, checked: boolean) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(goalId);
      } else {
        newSet.delete(goalId);
      }
      return newSet;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;

    try {
      setLoading(true);
      const deletePromises = Array.from(selectedItems).map(goalId => 
        strategyService.deleteOperationalGoal(goalId)
      );
      
      await Promise.all(deletePromises);
      toast.success(t('messages.deleteSuccess'));
      
      // Clear selection and reload goals
      setSelectedItems(new Set());
      await loadOperationalGoals();
    } catch (error) {
      console.error('Error deleting operational goals:', error);
      toast.error(t('messages.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="operational-goals-tab">
      <div className="operational-goals-tab__header">
        <h3 className="operational-goals-tab__title">
          {t('strategy.operationalGoals.title')}
          {operationalGoals.length > 0 && (
            <span className="operational-goals-tab__count">({operationalGoals.length})</span>
          )}
        </h3>
      </div>

      <div className="operational-goals-tab__content">
        {operationalGoals.length > 0 ? (
          <div className="operational-goals-list">
            {operationalGoals.map((goal) => (
              <GoalItem
                key={goal.id}
                id={goal.id}
                text={goal.name}
                isRTL={isRTL}
                onEdit={() => handleEditGoal(goal)}
                onDelete={() => handleDeleteGoal(goal.id)}
                onChange={(checked) => handleSelectItem(goal.id, checked)}
                showActions={true}
              />
            ))}
          </div>
        ) : (
          <div className="operational-goals-tab__empty">
            <p className="operational-goals-tab__empty-text">
              {t('strategy.operationalGoals.noGoals')}
            </p>
          </div>
        )}

        {/* Bulk Delete Button */}
        {selectedItems.size > 0 && (
          <div className="operational-goals-tab__bulk-actions">
            <button
              className="operational-goals-tab__bulk-delete-btn"
              onClick={handleBulkDelete}
              disabled={loading}
            >
              <Trash2 className="operational-goals-tab__bulk-delete-icon" />
              <span className="operational-goals-tab__bulk-delete-text">
                {t('common.deleteSelected')} ({selectedItems.size})
              </span>
            </button>
          </div>
        )}

        <button
          className="operational-goals-tab__add-btn !w-fit"
          onClick={handleAddGoal}
          disabled={loading}
        >
          <AddCircle className="operational-goals-tab__add-btn-icon" />
          <span className="operational-goals-tab__add-btn-text">
            {t('strategy.operationalGoals.addNew')}
          </span>
        </button>
      </div>

      {/* Add/Edit Goal Modal */}
      <AddOperationalGoalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveGoal}
        editGoal={editGoal}
      />
    </div>
  );
};

export default OperationalGoalsTab;
