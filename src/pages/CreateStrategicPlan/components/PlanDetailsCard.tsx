import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { CardContent, Select, Switch } from '../../../components/ui';
import { Strategy, StrategicGoal, Element, SubElement } from '../../../services/supabase/strategicPlan/strategicPlan.service';

interface PlanDetailsCardProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  strategies: Strategy[];
  strategicGoals: StrategicGoal[];
  elements: Element[];
  subElements: SubElement[];
  loading: boolean;
  alwaysOpen?: boolean;
  hideToggle?: boolean;
}

const PlanDetailsCard = <T extends FieldValues = FieldValues>({ 
  control, 
  strategies, 
  strategicGoals, 
  elements, 
  subElements, 
  loading,
  alwaysOpen,
  hideToggle
}: PlanDetailsCardProps<T>) => {
  const { t } = useTranslation();

  const strategyOptions = [
    { value: '', label: t('strategicPlan.form.selectStrategy') },
    ...strategies.map(strategy => ({
      value: strategy.id,
      label: strategy.name
    }))
  ];

  const goalOptions = [
    { value: '', label: t('strategicPlan.form.selectGoal') },
    ...strategicGoals.map(goal => ({
      value: goal.id,
      label: goal.name
    }))
  ];

  const elementOptions = [
    { value: '', label: t('strategicPlan.form.selectElement') },
    ...elements.map(element => ({
      value: element.id,
      label: element.name
    }))
  ];

  const subElementOptions = [
    { value: '', label: t('strategicPlan.form.selectElement') },
    ...subElements.map(subElement => ({
      value: subElement.id,
      label: subElement.name
    }))
  ];

  const durationOptions = [
    { value: '', label: t('strategicPlan.form.selectDuration') },
    { value: '3months', label: '3 أشهر' },
    { value: '6months', label: '6 أشهر' },
    { value: '1year', label: 'سنة' },
  ];

  const ownerOptions = [
    { value: '', label: t('strategicPlan.form.selectOwner') },
    { value: 'owner1', label: 'مالك 1' },
    { value: 'owner2', label: 'مالك 2' },
  ];

  const privacyOptions = [
    { value: '', label: t('strategicPlan.form.selectPrivacy') },
    { value: 'public', label: 'عام' },
    { value: 'private', label: 'خاص' },
  ];

  if (loading) {
    return (
      <CardContent
        title={t('strategy.strategicDetails.title')}
        subtitle={t('strategy.strategicDetails.caption')}
        icon={<Settings />}
        defaultOpen={true}
        alwaysOpen={alwaysOpen}
        hideToggle={hideToggle}
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-sm text-gray-500">{t('common.loading')}</div>
        </div>
      </CardContent>
    );
  }

  return (
    <CardContent
      title={t('strategy.strategicDetails.title')}
      subtitle={t('strategy.strategicDetails.caption')}
      icon={<Settings />}
      defaultOpen={true}
      alwaysOpen={alwaysOpen}
      hideToggle={hideToggle}
    >
      <div className="space-y-2">
        <Select
          name={"strategy_id" as Path<T>}
          control={control}
          label={t('strategicPlan.form.generalStrategy')}
          options={strategyOptions}
        />

        <Select
          name={"strategic_goal_id" as Path<T>}
          control={control}
          label={t('strategicPlan.form.strategicGoal')}
          options={goalOptions}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            name={"element" as Path<T>}
            control={control}
            label={t('strategicPlan.form.element')}
            options={elementOptions}
          />

          <Select
            name={"sub_element" as Path<T>}
            control={control}
            label={t('strategicPlan.form.subElement')}
            options={subElementOptions}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            name={"duration" as Path<T>}
            control={control}
            label={t('strategicPlan.form.duration')}
            options={durationOptions}
          />

          <Select
            name={"owner" as Path<T>}
            control={control}
            label={t('strategicPlan.form.planOwner')}
            options={ownerOptions}
          />
        </div>

        <Select
          name={"privacy" as Path<T>}
          control={control}
          label={t('strategicPlan.form.privacy')}
          options={privacyOptions}
        />

        <Switch
          name={"is_active" as Path<T>}
          control={control}
          label={t('strategicPlan.form.activationStatus')}
        />
      </div>
    </CardContent>
  );
};

export default PlanDetailsCard;

