import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { CardContent, Textarea } from '../../../components/ui';

interface StrategicDetailsCardProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
}

const StrategicDetailsCard = <T extends FieldValues = FieldValues>({ control }: StrategicDetailsCardProps<T>) => {
  const { t } = useTranslation();

  return (
    <CardContent
      title={t('strategy.strategicDetails.title')}
      subtitle={t('strategy.strategicDetails.caption')}
      icon={<FileText />}
      defaultOpen={true}
    >
      <div className="space-y-4">
        {/* Strategic Details */}
        <Textarea
          name={"strategicDetails" as Path<T>}
          control={control}
          label={t('strategy.strategicDetails.details')}
          placeholder={t('strategy.strategicDetails.placeholder')}
          rows={4}
        />

        {/* Vision and Mission */}
        <Textarea
          name={"visionMission" as Path<T>}
          control={control}
          label={t('strategy.visionMission.title')}
          placeholder={t('strategy.visionMission.placeholder')}
          rows={4}
        />

        {/* Focus Areas */}
        <Textarea
          name={"focusAreas" as Path<T>}
          control={control}
          label={t('strategy.focusAreas.title')}
          placeholder={t('strategy.focusAreas.placeholder')}
          rows={4}
        />
      </div>
    </CardContent>
  );
};

export default StrategicDetailsCard;
