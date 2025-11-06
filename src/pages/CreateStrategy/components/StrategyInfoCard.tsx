 import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { CardContent, Input, Textarea, DatePicker } from '../../../components/ui';

interface StrategyInfoCardProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
}

const StrategyInfoCard = <T extends FieldValues = FieldValues>({ control }: StrategyInfoCardProps<T>) => {
  const { t } = useTranslation();

  return (
    <CardContent
      title={t('strategy.strategyInfo.title')}
      subtitle={t('strategy.strategyInfo.caption')}
      icon={<FileText />}
      defaultOpen={true}
    >
      <div className="space-y-2">
        {/* Name Field */}
        <Input
          name={"name" as Path<T>}
          control={control}
          label={t('strategy.strategyInfo.name')}
          placeholder={t('strategy.strategyInfo.name')}
          required
          rules={{ required: t('validation.required') }}
        />

        {/* Description Field */}
        <Textarea
          name={"description" as Path<T>}
          control={control}
          label={t('strategy.strategyInfo.description')}
          placeholder={t('strategy.strategyInfo.description')}
          rows={2}
        />

        {/* Date Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DatePicker
            name={"startDate" as Path<T>}
            control={control}
            label={t('strategy.strategyInfo.startDate')}
            required
            rules={{ required: t('validation.required') }}
          />

          <DatePicker
            name={"endDate" as Path<T>}
            control={control}
            label={t('strategy.strategyInfo.endDate')}
            required
            rules={{ required: t('validation.required') }}
          />
        </div>
      </div>
    </CardContent>
  );
};

export default StrategyInfoCard;
