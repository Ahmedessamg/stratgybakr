import { useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useParams, useLocation } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';
import { useBreadcrumb } from '../../hooks/useBreadcrumb';
import { useCreateStrategicPlan } from '../../hooks/useCreateStrategicPlan';
import { useStrategicPlanFormData } from '../../hooks/useStrategicPlanFormData';
import { useStrategicPlan } from '../../hooks/useStrategicPlan';
import { StrategicPlanFormData } from '../../services/supabase/strategicPlan/strategicPlan.service';
import { ROUTES } from '../../constants';
import { Button } from '../../components/ui';
import { PlanInfoCard, PlanDetailsCard, PlanVisionCard } from './components';
import './CreateStrategicPlan.scss';

const CreateStrategicPlan = () => {
  const { t } = useTranslation();
  const { setBreadcrumb } = useBreadcrumb();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  // Force re-render when route changes
  const location = useLocation();

  const { control, handleSubmit, reset } = useForm<StrategicPlanFormData>({
    defaultValues: {
      name: '',
      description: '',
      strategy_id: '',
      strategic_goal_id: '',
      element: '',
      sub_element: '',
      duration: '',
      owner: '',
      privacy: '',
      is_active: true,
      vision: '',
      message: '',
      governing_values: '',
      focus_areas: '',
      attachments: [],
      attachmentsToDelete: []
    }
  });

  const { loading, createStrategicPlan } = useCreateStrategicPlan(id, isEditMode);
  const { strategies, strategicGoals, elements, subElements, loading: formDataLoading } = useStrategicPlanFormData();
  const { plan: planData, loading: planLoading, error: planError } = useStrategicPlan(id);

  const handleCreateClick = useCallback(async () => {
    const formData = await new Promise<StrategicPlanFormData>((resolve) => {
      handleSubmit((data) => resolve(data))();
    });
    await createStrategicPlan(formData);
  }, [handleSubmit, createStrategicPlan]);

  // Create a stable button component
  const headerButton = useMemo(() => (
    <Button
      type="button"
      variant="primary"
      disabled={loading}
      onClick={handleCreateClick}
    >
      {loading ? t('common.loading') : t('strategicPlan.form.createPlan')}
    </Button>
  ), [loading, handleCreateClick, t]);

  // Populate form when plan data loads in edit mode
  useEffect(() => {
    if (isEditMode && planData) {
      reset({
        name: planData.name || '',
        description: planData.description || '',
        strategy_id: planData.strategy_id || '',
        strategic_goal_id: planData.strategic_goal_id || '',
        element: planData.element || '',
        sub_element: planData.sub_element || '',
        duration: planData.duration || '',
        owner: planData.owner || '',
        privacy: planData.privacy || '',
        is_active: planData.is_active ?? true,
        vision: planData.vision || '',
        message: planData.message || '',
        governing_values: planData.governing_values || '',
        focus_areas: planData.focus_areas || '',
        attachments: planData.attachments || [],
        attachmentsToDelete: []
      });
    }
  }, [isEditMode, planData, reset]);

  useEffect(() => {
    setBreadcrumb(
      [
        { label: <HomeIcon size={16} />, url: ROUTES.HOME },
        { label: t('nav.home'), url: ROUTES.HOME },
        { label: t('nav.strategicPlans'), url: ROUTES.STRATEGIC_PLANS },
      ],
      isEditMode ? t('strategicPlans.editTitle') : t('strategicPlans.createNew'),
      headerButton
    );
  }, [t, setBreadcrumb, isEditMode, location.pathname]);


  // Show loading state
  if (planLoading || formDataLoading) {
    return (
      <div className="create-strategic-plan">
        <div className="flex items-center justify-center py-12">
          <div className="text-sm text-gray-500">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  // Show error state for edit mode
  if (isEditMode && planError) {
    return (
      <div className="create-strategic-plan">
        <div className="flex items-center justify-center py-12">
          <p className="text-red-500">{planError}</p>
        </div>
      </div>
    );
  }

  // Show not found state for edit mode
  if (isEditMode && !planData) {
    return (
      <div className="create-strategic-plan">
        <div className="flex items-center justify-center py-12">
          <p>{t('strategicPlans.noResults')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="create-strategic-plan">
      <div className="create-strategic-plan__layout">
        <div className="create-strategic-plan__right">
          <PlanInfoCard control={control} alwaysOpen hideToggle />
          <PlanDetailsCard 
            control={control} 
            strategies={strategies}
            strategicGoals={strategicGoals}
            elements={elements}
            subElements={subElements}
            loading={formDataLoading}
            alwaysOpen
            hideToggle
          />
        </div>
        <div className="create-strategic-plan__left">
          <PlanVisionCard control={control} alwaysOpen hideToggle />
        </div>
        
      </div>
    </div>
  );
};

export default CreateStrategicPlan;

