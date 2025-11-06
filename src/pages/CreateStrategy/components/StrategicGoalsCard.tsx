import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { CardContent, SearchInput, Button, Table } from '../../../components/ui';
import AddStrategicGoalModal, { Goal } from './AddStrategicGoalModal';
import GoalItem from './GoalItem';
import { strategyService } from '../../../services/supabase/strategy';
import type { StrategicGoal } from '../../../services/supabase/strategy/types';

interface StrategicGoalsCardProps {
  draftStrategyId: string | null;
  isEditMode?: boolean;
}

const StrategicGoalsCard = ({ draftStrategyId, isEditMode = false }: StrategicGoalsCardProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editGoal, setEditGoal] = useState<StrategicGoal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [goals, setGoals] = useState<StrategicGoal[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<StrategicGoal[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<StrategicGoal[]>([]);

  const loadGoals = useCallback(async () => {
    if (!draftStrategyId || !isEditMode) return;
    
    try {
      setLoading(true);
      console.log('📂 Loading existing strategic goals for strategy:', draftStrategyId);
      const data = await strategyService.getStrategicGoals(draftStrategyId);
      console.log('✅ Loaded existing strategic goals:', data);
      setGoals(data);
    } catch (error) {
      console.error('❌ Error loading strategic goals:', error);
      toast.error(t('messages.loadError'));
    } finally {
      setLoading(false);
    }
  }, [draftStrategyId, isEditMode, t]);

  // Load goals from database
  useEffect(() => {
    if (draftStrategyId) {
      loadGoals();
    }
  }, [draftStrategyId, loadGoals]);

  // Search functionality for add mode
  const searchGoals = useCallback(async (term: string) => {
    console.log('🔎 Searching goals with term:', term, 'isEditMode:', isEditMode);
    try {
      const results = await strategyService.searchStrategicGoals(term);
      console.log('✅ Search results:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('❌ Search error:', error);
      toast.error(t('messages.searchError'));
    }
  }, [isEditMode, t]);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    console.log('🔍 Search term changed:', value, 'isEditMode:', isEditMode);
    setSearchTerm(value);
    if (value.trim()) {
      searchGoals(value);
    } else {
      setSearchResults([]);
    }
  };

  // Handle selecting a goal from search results
  const handleSelectGoal = async (goal: StrategicGoal) => {
    if (isEditMode) {
      // In edit mode, save directly to database
      if (goals.some(g => g.id === goal.id)) {
        toast.info(t('messages.alreadyAdded'));
        return;
      }
      
      try {
        // Copy the goal to current strategy
        await strategyService.addStrategicGoal({
          strategy_id: draftStrategyId || '',
          name: goal.name,
          duration: goal.duration,
          element: goal.element,
          description: goal.description || '',
          status: goal.status
        });
        
        toast.success(t('messages.goalAdded'));
        await loadGoals(); // Reload to show new item
      } catch (err) {
        console.error('Error adding strategic goal:', err);
        toast.error(t('messages.saveError'));
      }
    } else {
      // Add mode: Add to selected list
      const isAlreadySelected = selectedGoals.some(g => g.id === goal.id);
      if (!isAlreadySelected) {
        setSelectedGoals(prev => {
          const updated = [...prev, goal];
          localStorage.setItem('selectedStrategicGoals', JSON.stringify(updated));
          return updated;
        });
        toast.success(t('messages.goalSelected'));
      }
    }
  };

  // Handle removing selected goal
  const handleRemoveSelectedGoal = (goalId: string) => {
    setSelectedGoals(prev => {
      const updated = prev.filter(g => g.id !== goalId);
      localStorage.setItem('selectedStrategicGoals', JSON.stringify(updated));
      return updated;
    });
  };


  const handleSaveGoal = async (goal: Goal) => {
    if (!draftStrategyId) {
      toast.error(t('messages.saveError'));
      return;
    }

    if (isEditMode) {
      // Edit mode: Save to database
      try {
        setLoading(true);
        
        if (editGoal) {
          // Update existing goal
          await strategyService.updateStrategicGoal(editGoal.id, {
            name: goal.name,
            duration: goal.duration,
            element: goal.element,
            description: goal.description || '',
            status: goal.status,
            strategy_id: draftStrategyId
          });
          toast.success(t('messages.updateSuccess'));
        } else {
          // Add new goal to database
          await strategyService.addStrategicGoal({
            strategy_id: draftStrategyId,
            name: goal.name,
            duration: goal.duration,
            element: goal.element,
            description: goal.description || '',
            status: goal.status
          });
          toast.success(t('messages.saveSuccess'));
        }
        
        // Reload goals from database
        await loadGoals();
      } catch (error) {
        console.error('Error saving strategic goal:', error);
        const err = error as Error;
        const errorMessage = err?.message || t('messages.saveError');
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      // Add mode: Add to selected goals
      const newGoal: StrategicGoal = {
        id: `temp-${Date.now()}`, // Temporary ID
        strategy_id: draftStrategyId,
        name: goal.name,
        duration: goal.duration,
        element: goal.element,
        description: goal.description || '',
        status: goal.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      if (editGoal) {
        // Update in selected goals
        setSelectedGoals(prev => prev.map(g => g.id === editGoal.id ? newGoal : g));
        toast.success(t('messages.goalUpdated'));
      } else {
        // Add to selected goals
        setSelectedGoals(prev => [...prev, newGoal]);
        toast.success(t('messages.goalAdded'));
      }
      
      // Save to localStorage for persistence
      const updatedGoals = editGoal 
        ? selectedGoals.map(g => g.id === editGoal.id ? newGoal : g)
        : [...selectedGoals, newGoal];
      localStorage.setItem('selectedStrategicGoals', JSON.stringify(updatedGoals));
    }
    
    setEditGoal(null);
    setIsModalOpen(false);
  };

  const handleEdit = (goal: StrategicGoal) => {
    setEditGoal(goal);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await strategyService.deleteStrategicGoal(id);
      toast.success(t('messages.deleteSuccess'));
      await loadGoals();
    } catch (error) {
      console.error('Error deleting strategic goal:', error);
      toast.error(t('messages.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditGoal(null);
  };

  const handleAddNew = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setEditGoal(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <CardContent
        title={t('strategy.strategicGoals.title')}
        subtitle={t('strategy.strategicGoals.caption')}
        icon={<FileText />}
        defaultOpen={true}
      >
        <div className="space-y-4">
          {/* Existing Goals (edit mode only) */}
          {isEditMode && goals.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--text)]">
                {t('strategy.strategicGoals.existingGoals')} ({goals.length})
              </h4>
              <Table
                columns={[
                  { key: 'actions', label: t('common.actions'), align: 'left' },
                  { key: 'name', label: t('strategy.goalModal.name'), align: 'right' }
                ]}
              >
                {goals.map((goal, index) => (
                  <GoalItem
                    key={goal.id}
                    goal={goal}
                    onEdit={() => handleEdit(goal)}
                    onDelete={() => handleDelete(goal.id)}
                    isLast={index === goals.length - 1}
                  />
                ))}
              </Table>
            </div>
          )}

          {/* Search Goals (both modes) */}
          <div>
            <h4 className="text-sm font-medium text-[var(--text)] mb-2">
              {t('strategy.strategicGoals.chooseGoals')}
            </h4>
            <SearchInput
              placeholder={t('strategy.strategicGoals.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Search Results (both modes) */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--text)]">
                {t('strategy.strategicGoals.searchResults')} ({searchResults.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((goal) => {
                  const isSelected = selectedGoals.some(g => g.id === goal.id);
                  const isExisting = isEditMode && goals.some(g => g.id === goal.id);
                  return (
                    <div
                      key={goal.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-[var(--primary-light)] border-[var(--primary)]' 
                          : 'bg-white border-gray-200 hover:border-[var(--primary)]'
                      }`}
                      onClick={() => handleSelectGoal(goal)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-[var(--text)]">{goal.name}</h5>
                          {goal.description && (
                            <p className="text-sm text-[var(--muted)] mt-1">{goal.description}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          {isExisting && (
                            <span className="text-gray-500 text-sm">{t('messages.alreadyAdded')}</span>
                          )}
                          {isSelected && (
                            <span className="text-[var(--primary)] text-sm">✓ {t('common.selected')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Goals (add mode only) */}
          {!isEditMode && selectedGoals.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--text)]">
                {t('strategy.strategicGoals.selectedGoals')} ({selectedGoals.length})
              </h4>
              <Table
                columns={[
                  { key: 'actions', label: t('common.actions'), align: 'left' },
                  { key: 'name', label: t('strategy.goalModal.name'), align: 'right' }
                ]}
              >
                {selectedGoals.map((goal, index) => (
                  <GoalItem
                    key={goal.id}
                    goal={goal}
                    onEdit={() => handleEdit(goal)}
                    onDelete={() => handleRemoveSelectedGoal(goal.id)}
                    isLast={index === selectedGoals.length - 1}
                  />
                ))}
              </Table>
            </div>
          )}

          {/* Add New Goal Button (both modes) */}
          <Button
            type="button"
            variant="link"
            icon={<Plus className="w-4 h-4" />}
            className="text-[var(--primary)] p-0 h-auto"
            onClick={handleAddNew}
            disabled={!draftStrategyId || loading}
          >
            {t('strategy.strategicGoals.addNew')}
          </Button>
        </div>
      </CardContent>

      {/* Modal */}
      <AddStrategicGoalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveGoal}
        editGoal={editGoal ? {
          id: editGoal.id,
          name: editGoal.name,
          duration: editGoal.duration,
          element: editGoal.element,
          description: editGoal.description || '',
          status: editGoal.status
        } : null}
      />
    </>
  );
};

export default StrategicGoalsCard;
