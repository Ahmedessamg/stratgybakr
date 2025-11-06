import { useTranslation } from 'react-i18next';
import { Eye } from 'lucide-react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { CardContent, Textarea } from '../../../components/ui';

interface PlanVisionCardProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  alwaysOpen?: boolean;
  hideToggle?: boolean;
}

const PlanVisionCard = <T extends FieldValues = FieldValues>({ control, alwaysOpen, hideToggle }: PlanVisionCardProps<T>) => {
  const { t } = useTranslation();

  return (
    <CardContent
      title={t('strategicPlan.form.visionMessageValues')}
      subtitle={t('strategicPlan.form.visionMessageCaption')}
      icon={<Eye />}
      defaultOpen={true}
      alwaysOpen={alwaysOpen}
      hideToggle={hideToggle}
    >
      <div className="space-y-2">
        <Textarea
          name={"vision" as Path<T>}
          control={control}
          label={t('strategicPlan.form.vision')}
          placeholder={t('strategicPlan.form.visionPlaceholder')}
          rows={4}
        />

        <Textarea
          name={"message" as Path<T>}
          control={control}
          label={t('strategicPlan.form.message')}
          placeholder={t('strategicPlan.form.messagePlaceholder')}
          rows={4}
        />

        <Textarea
          name={"governing_values" as Path<T>}
          control={control}
          label={t('strategicPlan.form.governingValues')}
          placeholder={t('strategicPlan.form.governingValuesPlaceholder')}
          rows={6}
        />

        <Textarea
          name={"focus_areas" as Path<T>}
          control={control}
          label={t('strategicPlan.form.focusAreas')}
          placeholder={t('strategicPlan.form.focusAreasPlaceholder')}
          rows={6}
        />
      </div>
    </CardContent>
  );
};

export default PlanVisionCard;

