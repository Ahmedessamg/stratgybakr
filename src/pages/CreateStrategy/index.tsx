import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';
import { useBreadcrumb, useStrategy } from '../../hooks';
import { useDraftStrategy } from '../../hooks/useDraftStrategy';
import { useCreateStrategy } from '../../hooks/useCreateStrategy';
import { ROUTES } from '../../constants';
import { Button } from '../../components/ui';
import { StrategyInfoCard, StrategicDetailsCard, StrategicGoalsCard, OperationalGoalsCard, ValuesCard, PillarsCard, AttachmentsCard } from './components';
import { parseArabicDateToISO, parseFocusAreasToText } from '../../utils/dateFormatter';
import './CreateStrategy.scss';

interface StrategyFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  strategicDetails: string;
  visionMission: string;
  focusAreas: string;
}

const CreateStrategy: React.FC = () => {
  const { t } = useTranslation();
  const { setBreadcrumb } = useBreadcrumb();
 
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  // Fetch strategy data if in edit mode
  const { strategy: strategyData, loading: strategyLoading, error: strategyError } = useStrategy(id);

  const { control, handleSubmit, reset } = useForm<StrategyFormData>({
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      strategicDetails: '',
      visionMission: '',
      focusAreas: ''
    }
  });
 
  const { draftStrategyId, loading: draftLoading } = useDraftStrategy(isEditMode ? id : undefined);
  const { loading, createStrategy } = useCreateStrategy(draftStrategyId, isEditMode);

  const onSubmit = useCallback(async (data: StrategyFormData) => {
    await createStrategy(data);
  }, [createStrategy]);
 

  useEffect(() => {
    // Load strategy data in edit mode
    if (isEditMode && strategyData) {
      reset({
        name: strategyData.name || '',
        description: strategyData.description || '',
        startDate: parseArabicDateToISO(strategyData.startDate),
        endDate: parseArabicDateToISO(strategyData.endDate),
        strategicDetails: strategyData.strategicDetails || '',
        visionMission: strategyData.visionMission || '',
        focusAreas: Array.isArray(strategyData.focusAreas) 
          ? strategyData.focusAreas.join('\n')
          : parseFocusAreasToText(strategyData.focusAreas || null)
      });
    }
  }, [isEditMode, strategyData, reset]);

  useEffect(() => {
    setBreadcrumb(
      [
        { label: <HomeIcon size={16} />, url: ROUTES.HOME },
        { label: t('nav.home'), url: ROUTES.HOME },
        { label: t('nav.strategy'), url: ROUTES.STRATEGY },
      ],
      isEditMode ? t('strategy.editTitle') : t('strategy.addNew'),
      // Action Buttons
      <div className="flex gap-3">
        <Button
          type="button"
          variant="primary"
          disabled={loading || !draftStrategyId}
          onClick={() => handleSubmit(onSubmit)()}
        >
          {loading ? t('common.loading') : t('common.save')}
        </Button>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, setBreadcrumb, loading, draftStrategyId, isEditMode]);

  // Show loading state
  if (draftLoading || (isEditMode && strategyLoading)) {
    return (
      <div className="create-strategy">
        <div className="flex items-center justify-center py-12">
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Show error state for edit mode
  if (isEditMode && strategyError) {
    return (
      <div className="create-strategy">
        <div className="flex items-center justify-center py-12">
          <p className="text-red-500">{strategyError}</p>
        </div>
      </div>
    );
  }

  // Show not found state for edit mode
  if (isEditMode && !strategyData) {
    return (
      <div className="create-strategy">
        <div className="flex items-center justify-center py-12">
          <p>{t('strategy.noResults')}</p>
        </div>
      </div>
    );
  }
 

  return (
    <div className="create-strategy">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Strategy Form Sections */}
        <StrategyInfoCard control={control} />
        <StrategicDetailsCard control={control} />
        <StrategicGoalsCard draftStrategyId={draftStrategyId} isEditMode={isEditMode} />
        <OperationalGoalsCard draftStrategyId={draftStrategyId} isEditMode={isEditMode} />
        <ValuesCard isEditMode={isEditMode} draftStrategyId={draftStrategyId} />
        <PillarsCard isEditMode={isEditMode} draftStrategyId={draftStrategyId} />
        <AttachmentsCard draftStrategyId={draftStrategyId} isEditMode={isEditMode} />
      </form>
    </div>
  );
};

export default CreateStrategy;