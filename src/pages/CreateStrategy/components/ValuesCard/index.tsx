import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { CardContent, Button, Table, SearchInput } from '../../../../components/ui';
import AddValueModal from './AddValueModal';
import { Value } from './ValueItem';
import GoalItem from '../GoalItem';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import { strategyService } from '../../../../services/supabase/strategy';
import type { StrategyValue } from '../../../../services/supabase/strategy/types';

interface ValuesCardProps {
  isEditMode?: boolean;
  draftStrategyId?: string | null;
}

const ValuesCard = ({ isEditMode = false, draftStrategyId }: ValuesCardProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editValue, setEditValue] = useState<Value | null>(null);
  const [values, setValues] = useLocalStorage<Value[]>('strategyValues', []);
  const [existingValues, setExistingValues] = useState<StrategyValue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<StrategyValue[]>([]);
  const [selectedValues, setSelectedValues] = useState<StrategyValue[]>([]);

  // Load existing values from database in edit mode
  const loadExistingValues = useCallback(async () => {
    if (!draftStrategyId || !isEditMode) return;
    
    try {
      console.log('📂 Loading existing values for strategy:', draftStrategyId);
      const data = await strategyService.getValues(draftStrategyId);
      console.log('✅ Loaded existing values:', data);
      setExistingValues(data);
    } catch (error) {
      console.error('❌ Error loading existing values:', error);
      toast.error(t('messages.loadError'));
    }
  }, [draftStrategyId, isEditMode, t]);

  // Load existing values on mount
  useEffect(() => {
    loadExistingValues();
  }, [loadExistingValues]);

  // Search functionality for add mode
  const searchValues = useCallback(async (term: string) => {
    console.log('🔎 Searching values with term:', term, 'isEditMode:', isEditMode);
    try {
      const results = await strategyService.searchValues(term);
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
      searchValues(value);
    } else {
      setSearchResults([]);
    }
  };

  // Handle selecting a value from search results
  const handleSelectValue = async (value: StrategyValue) => {
    if (isEditMode) {
      // In edit mode, save directly to database
      if (existingValues.some(v => v.id === value.id)) {
        toast.info(t('messages.alreadyAdded'));
        return;
      }
      
      try {
        // Copy the value to current strategy
        await strategyService.addValue({
          strategy_id: draftStrategyId || '',
          name: value.name,
          description: value.description || ''
        });
        
        toast.success(t('messages.valueAdded'));
        await loadExistingValues(); // Reload to show new item
      } catch (err) {
        console.error('Error adding value:', err);
        toast.error(t('messages.saveError'));
      }
    } else {
      // Add mode: Add to selected list
      const isAlreadySelected = selectedValues.some(v => v.id === value.id);
      if (!isAlreadySelected) {
        setSelectedValues(prev => {
          const updated = [...prev, value];
          localStorage.setItem('selectedValues', JSON.stringify(updated));
          return updated;
        });
        toast.success(t('messages.valueSelected'));
      }
    }
  };

  // Handle removing selected value
  const handleRemoveSelectedValue = (valueId: string) => {
    setSelectedValues(prev => {
      const updated = prev.filter(v => v.id !== valueId);
      localStorage.setItem('selectedValues', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSaveValue = async (value: Value) => {
    if (isEditMode) {
      // Edit mode: Save to database
      try {
        if (editValue && !editValue.id.startsWith('temp-')) {
          // Update existing value in database
          await strategyService.updateValue(editValue.id, {
            name: value.name,
            description: value.description || ''
          });
          toast.success(t('messages.updateSuccess'));
          await loadExistingValues();
        } else {
          // Add new value to database (from localStorage or new)
          await strategyService.addValue({
            strategy_id: draftStrategyId || '',
            name: value.name,
            description: value.description || ''
          });
          toast.success(t('messages.valueAdded'));
          await loadExistingValues();
        }
      } catch (err) {
        console.error('Error saving value:', err);
        toast.error(t('messages.saveError'));
      }
    } else {
      // Add mode: Add to selected values
      const newValue: StrategyValue = {
        id: `temp-${Date.now()}`, // Temporary ID
        strategy_id: draftStrategyId || '',
        name: value.name,
        description: value.description || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      if (editValue) {
        // Update in selected values
        setSelectedValues(prev => prev.map(v => v.id === editValue.id ? newValue : v));
        toast.success(t('messages.valueUpdated'));
      } else {
        // Add to selected values
        setSelectedValues(prev => [...prev, newValue]);
        toast.success(t('messages.valueAdded'));
      }
      
      // Save to localStorage for persistence
      const updatedValues = editValue 
        ? selectedValues.map(v => v.id === editValue.id ? newValue : v)
        : [...selectedValues, newValue];
      localStorage.setItem('selectedValues', JSON.stringify(updatedValues));
    }
    
    setEditValue(null);
    setIsModalOpen(false);
  };

  const handleEdit = (value: Value, e?: React.MouseEvent) => {
    e?.preventDefault();
    setEditValue(value);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    setValues(values.filter(v => v.id !== id));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditValue(null);
  };

  const handleAddNew = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setEditValue(null);
    setIsModalOpen(true);
  };

  // Handle deleting existing value from database
  const handleDeleteExistingValue = async (id: string) => {
    try {
      await strategyService.deleteValue(id);
      toast.success(t('messages.deleteSuccess'));
      await loadExistingValues(); // Reload to refresh the list
    } catch (error) {
      console.error('Error deleting value:', error);
      toast.error(t('messages.deleteError'));
    }
  };

  // Handle editing existing value from database
  const handleEditExistingValue = (value: StrategyValue) => {
    setEditValue({
      id: value.id,
      name: value.name,
      description: value.description || ''
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <CardContent
        title={t('strategy.values.title')}
        subtitle={t('strategy.values.caption')}
        icon={<FileText />}
        defaultOpen={true}
      >
        <div className="space-y-4">
          {/* Existing Values (edit mode only) */}
          {isEditMode && existingValues.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--text)]">
                {t('strategy.values.existingValues')} ({existingValues.length})
              </h4>
              <Table
                columns={[
                  { key: 'actions', label: t('common.actions'), align: 'left' },
                  { key: 'name', label: t('strategy.values.valueName'), align: 'right' }
                ]}
              >
                {existingValues.map((value, index) => (
                  <GoalItem
                    key={value.id}
                    goal={{
                      id: value.id,
                      name: value.name,
                      description: value.description || ''
                    } as any}
                        onEdit={() => handleEditExistingValue(value)}
                        onDelete={() => handleDeleteExistingValue(value.id)}
                    isLast={index === existingValues.length - 1}
                  />
                ))}
              </Table>
            </div>
          )}

          {/* New Values (edit mode localStorage) */}
          {isEditMode && values.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--text)]">
                {t('strategy.values.newValues')} ({values.length})
              </h4>
              <Table
                columns={[
                  { key: 'actions', label: t('common.actions'), align: 'left' },
                  { key: 'name', label: t('strategy.values.valueName'), align: 'right' }
                ]}
              >
                {values.map((value, index) => (
                  <GoalItem
                    key={value.id}
                    goal={value as any}
                    onEdit={() => handleEdit(value)}
                    onDelete={handleDelete}
                    isLast={index === values.length - 1}
                  />
                ))}
              </Table>
            </div>
          )}

          {/* Search Values (both modes) */}
          <div>
            <h4 className="text-sm font-medium text-[var(--text)] mb-2">
              {t('strategy.values.chooseValues')}
            </h4>
            <SearchInput
              placeholder={t('strategy.values.searchPlaceholder')}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Search Results (both modes) */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--text)]">
                {t('strategy.values.searchResults')} ({searchResults.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((value) => {
                  const isSelected = selectedValues.some(v => v.id === value.id);
                  const isExisting = isEditMode && existingValues.some(v => v.id === value.id);
                  return (
                    <div
                      key={value.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-[var(--primary-light)] border-[var(--primary)]' 
                          : 'bg-white border-gray-200 hover:border-[var(--primary)]'
                      }`}
                      onClick={() => handleSelectValue(value)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-[var(--text)]">{value.name}</h5>
                          {value.description && (
                            <p className="text-sm text-[var(--muted)] mt-1">{value.description}</p>
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

          {/* Selected Values (add mode only) */}
          {!isEditMode && selectedValues.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--text)]">
                {t('strategy.values.selectedValues')} ({selectedValues.length})
              </h4>
              <Table
                columns={[
                  { key: 'actions', label: t('common.actions'), align: 'left' },
                  { key: 'name', label: t('strategy.values.valueName'), align: 'right' }
                ]}
              >
                {selectedValues.map((value, index) => (
                  <GoalItem
                    key={value.id}
                    goal={{
                      id: value.id,
                      name: value.name,
                      description: value.description || ''
                    } as any}
                    onEdit={() => handleEdit({
                      id: value.id,
                      name: value.name,
                      description: value.description || ''
                    })}
                    onDelete={() => handleRemoveSelectedValue(value.id)}
                    isLast={index === selectedValues.length - 1}
                  />
                ))}
              </Table>
            </div>
          )}

          {/* Add New Value Button (both modes) */}
          <Button
            type="button"
            variant="link"
            icon={<Plus className="w-4 h-4" />}
            className="text-[var(--primary)] p-0 h-auto"
            onClick={handleAddNew}
          >
            {t('strategy.values.addNew')}
          </Button>
        </div>
      </CardContent>

      {/* Modal */}
      <AddValueModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveValue}
        editValue={editValue}
      />
    </>
  );
};

export default ValuesCard;
