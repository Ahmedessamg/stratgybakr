import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { CardContent, Button, Table, SearchInput } from '../../../../components/ui';
import AddPillarModal from './AddPillarModal';
import { Pillar } from './PillarItem';
import GoalItem from '../GoalItem';
import useLocalStorage from '../../../../hooks/useLocalStorage';
import { strategyService } from '../../../../services/supabase/strategy';
import type { StrategyPillar } from '../../../../services/supabase/strategy/types';

interface PillarsCardProps {
  isEditMode?: boolean;
  draftStrategyId?: string | null;
}

const PillarsCard = ({ isEditMode = false, draftStrategyId }: PillarsCardProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPillar, setEditPillar] = useState<Pillar | null>(null);
  const [pillars, setPillars] = useLocalStorage<Pillar[]>('strategyPillars', []);
  const [existingPillars, setExistingPillars] = useState<StrategyPillar[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<StrategyPillar[]>([]);
  const [selectedPillars, setSelectedPillars] = useState<StrategyPillar[]>([]);

  // Load existing pillars from database in edit mode
  const loadExistingPillars = useCallback(async () => {
    if (!draftStrategyId || !isEditMode) return;
    
    try {
      console.log('📂 Loading existing pillars for strategy:', draftStrategyId);
      const data = await strategyService.getPillars(draftStrategyId);
      console.log('✅ Loaded existing pillars:', data);
      setExistingPillars(data);
    } catch (error) {
      console.error('❌ Error loading existing pillars:', error);
      toast.error(t('messages.loadError'));
    }
  }, [draftStrategyId, isEditMode, t]);

  // Load existing pillars on mount
  useEffect(() => {
    loadExistingPillars();
  }, [loadExistingPillars]);

  // Search functionality for add mode
  const searchPillars = useCallback(async (term: string) => {
    console.log('🔎 Searching pillars with term:', term, 'isEditMode:', isEditMode);
    try {
      const results = await strategyService.searchPillars(term);
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
      searchPillars(value);
    } else {
      setSearchResults([]);
    }
  };

  // Handle selecting a pillar from search results
  const handleSelectPillar = async (pillar: StrategyPillar) => {
    if (isEditMode) {
      // In edit mode, save directly to database
      if (existingPillars.some(p => p.id === pillar.id)) {
        toast.info(t('messages.alreadyAdded'));
        return;
      }
      
      try {
        // Copy the pillar to current strategy
        await strategyService.addPillar({
          strategy_id: draftStrategyId || '',
          name: pillar.name,
          description: pillar.description || ''
        });
        
        toast.success(t('messages.pillarAdded'));
        await loadExistingPillars(); // Reload to show new item
      } catch (err) {
        console.error('Error adding pillar:', err);
        toast.error(t('messages.saveError'));
      }
    } else {
      // Add mode: Add to selected list
      const isAlreadySelected = selectedPillars.some(p => p.id === pillar.id);
      if (!isAlreadySelected) {
        setSelectedPillars(prev => {
          const updated = [...prev, pillar];
          localStorage.setItem('selectedPillars', JSON.stringify(updated));
          return updated;
        });
        toast.success(t('messages.pillarSelected'));
      }
    }
  };

  // Handle removing selected pillar
  const handleRemoveSelectedPillar = (pillarId: string) => {
    setSelectedPillars(prev => {
      const updated = prev.filter(p => p.id !== pillarId);
      localStorage.setItem('selectedPillars', JSON.stringify(updated));
      return updated;
    });
  };

  const handleSavePillar = async (pillar: Pillar) => {
    if (isEditMode) {
      // Edit mode: Save to database
      try {
        if (editPillar && !editPillar.id.startsWith('temp-')) {
          // Update existing pillar in database
          await strategyService.updatePillar(editPillar.id, {
            name: pillar.name,
            description: pillar.description || ''
          });
          toast.success(t('messages.updateSuccess'));
          await loadExistingPillars();
        } else {
          // Add new pillar to database (from localStorage or new)
          await strategyService.addPillar({
            strategy_id: draftStrategyId || '',
            name: pillar.name,
            description: pillar.description || ''
          });
          toast.success(t('messages.pillarAdded'));
          await loadExistingPillars();
        }
      } catch (err) {
        console.error('Error saving pillar:', err);
        toast.error(t('messages.saveError'));
      }
    } else {
      // Add mode: Add to selected pillars
      const newPillar: StrategyPillar = {
        id: `temp-${Date.now()}`, // Temporary ID
        strategy_id: draftStrategyId || '',
        name: pillar.name,
        description: pillar.description || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      if (editPillar) {
        // Update in selected pillars
        setSelectedPillars(prev => prev.map(p => p.id === editPillar.id ? newPillar : p));
        toast.success(t('messages.pillarUpdated'));
      } else {
        // Add to selected pillars
        setSelectedPillars(prev => [...prev, newPillar]);
        toast.success(t('messages.pillarAdded'));
      }
      
      // Save to localStorage for persistence
      const updatedPillars = editPillar 
        ? selectedPillars.map(p => p.id === editPillar.id ? newPillar : p)
        : [...selectedPillars, newPillar];
      localStorage.setItem('selectedPillars', JSON.stringify(updatedPillars));
    }
    
    setEditPillar(null);
    setIsModalOpen(false);
  };

  const handleEdit = (pillar: Pillar, e?: React.MouseEvent) => {
    e?.preventDefault();
    setEditPillar(pillar);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    setPillars(pillars.filter(p => p.id !== id));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditPillar(null);
  };

  const handleAddNew = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setEditPillar(null);
    setIsModalOpen(true);
  };

  // Handle deleting existing pillar from database
  const handleDeleteExistingPillar = async (id: string) => {
    try {
      await strategyService.deletePillar(id);
      toast.success(t('messages.deleteSuccess'));
      await loadExistingPillars(); // Reload to refresh the list
    } catch (error) {
      console.error('Error deleting pillar:', error);
      toast.error(t('messages.deleteError'));
    }
  };

  // Handle editing existing pillar from database
  const handleEditExistingPillar = (pillar: StrategyPillar) => {
    setEditPillar({
      id: pillar.id,
      name: pillar.name,
      description: pillar.description || ''
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <CardContent
        title={t('strategy.pillars.title')}
        subtitle={t('strategy.pillars.caption')}
        icon={<FileText />}
        defaultOpen={true}
      >
        <div className="space-y-4">
          {/* Existing Pillars (edit mode only) */}
          {isEditMode && existingPillars.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--text)]">
                {t('strategy.pillars.existingPillars')} ({existingPillars.length})
              </h4>
              <Table
                columns={[
                  { key: 'actions', label: t('common.actions'), align: 'left' },
                  { key: 'name', label: t('strategy.pillars.pillarName'), align: 'right' }
                ]}
              >
                {existingPillars.map((pillar, index) => (
                  <GoalItem
                    key={pillar.id}
                    goal={{
                      id: pillar.id,
                      name: pillar.name,
                      description: pillar.description || ''
                    } as any}
                        onEdit={() => handleEditExistingPillar(pillar)}
                        onDelete={() => handleDeleteExistingPillar(pillar.id)}
                    isLast={index === existingPillars.length - 1}
                  />
                ))}
              </Table>
            </div>
          )}

          {/* New Pillars (edit mode localStorage) */}
          {isEditMode && pillars.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--text)]">
                {t('strategy.pillars.newPillars')} ({pillars.length})
              </h4>
              <Table
                columns={[
                  { key: 'actions', label: t('common.actions'), align: 'left' },
                  { key: 'name', label: t('strategy.pillars.pillarName'), align: 'right' }
                ]}
              >
                {pillars.map((pillar, index) => (
                  <GoalItem
                    key={pillar.id}
                    goal={pillar as any}
                    onEdit={() => handleEdit(pillar)}
                    onDelete={handleDelete}
                    isLast={index === pillars.length - 1}
                  />
                ))}
              </Table>
            </div>
          )}

          {/* Search Pillars (both modes) */}
          <div>
            <h4 className="text-sm font-medium text-[var(--text)] mb-2">
              {t('strategy.pillars.choosePillars')}
            </h4>
            <SearchInput
              placeholder={t('strategy.pillars.searchPlaceholder')}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
            />
          </div>

          {/* Search Results (both modes) */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--text)]">
                {t('strategy.pillars.searchResults')} ({searchResults.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((pillar) => {
                  const isSelected = selectedPillars.some(p => p.id === pillar.id);
                  const isExisting = isEditMode && existingPillars.some(p => p.id === pillar.id);
                  return (
                    <div
                      key={pillar.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-[var(--primary-light)] border-[var(--primary)]' 
                          : 'bg-white border-gray-200 hover:border-[var(--primary)]'
                      }`}
                      onClick={() => handleSelectPillar(pillar)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-medium text-[var(--text)]">{pillar.name}</h5>
                          {pillar.description && (
                            <p className="text-sm text-[var(--muted)] mt-1">{pillar.description}</p>
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

          {/* Selected Pillars (add mode only) */}
          {!isEditMode && selectedPillars.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--text)]">
                {t('strategy.pillars.selectedPillars')} ({selectedPillars.length})
              </h4>
              <Table
                columns={[
                  { key: 'actions', label: t('common.actions'), align: 'left' },
                  { key: 'name', label: t('strategy.pillars.pillarName'), align: 'right' }
                ]}
              >
                {selectedPillars.map((pillar, index) => (
                  <GoalItem
                    key={pillar.id}
                    goal={{
                      id: pillar.id,
                      name: pillar.name,
                      description: pillar.description || ''
                    } as any}
                    onEdit={() => handleEdit({
                      id: pillar.id,
                      name: pillar.name,
                      description: pillar.description || ''
                    })}
                    onDelete={() => handleRemoveSelectedPillar(pillar.id)}
                    isLast={index === selectedPillars.length - 1}
                  />
                ))}
              </Table>
            </div>
          )}

          {/* Add New Pillar Button (both modes) */}
          <Button
            type="button"
            variant="link"
            icon={<Plus className="w-4 h-4" />}
            className="text-[var(--primary)] p-0 h-auto"
            onClick={handleAddNew}
          >
            {t('strategy.pillars.addNew')}
          </Button>
        </div>
      </CardContent>

      {/* Modal */}
      <AddPillarModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePillar}
        editPillar={editPillar}
      />
    </>
  );
};

export default PillarsCard;
