import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Modal, Button, Input, Textarea } from '../../../../components/ui';
import { Pillar } from './PillarItem';

interface AddPillarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pillar: Pillar) => void;
  editPillar?: Pillar | null;
}

interface PillarFormData {
  name: string;
  description: string;
}

const AddPillarModal = ({ isOpen, onClose, onSave, editPillar }: AddPillarModalProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, setValue } = useForm<PillarFormData>({
    defaultValues: {
      name: '',
      description: ''
    }
  });

  useEffect(() => {
    if (editPillar) {
      setValue('name', editPillar.name);
      setValue('description', editPillar.description);
    } else {
      reset({
        name: '',
        description: ''
      });
    }
  }, [editPillar, setValue, reset]);

  const onSubmit = (data: PillarFormData) => {
    const pillar: Pillar = {
      id: editPillar?.id || Date.now().toString(),
      ...data
    };
    onSave(pillar);
    reset({
      name: '',
      description: ''
    });
    onClose();
  };

  const handleCancel = () => {
    reset({
      name: '',
      description: ''
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={t('strategy.pillars.addNew')}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {/* Name */}
          <Input
            name="name"
            control={control}
            label={t('strategy.pillars.pillarName')}
            placeholder={t('strategy.pillars.pillarNamePlaceholder')}
            required
            rules={{ required: t('validation.required') }}
          />

          {/* Description */}
          <Textarea
            name="description"
            control={control}
            label={t('strategy.pillars.pillarDescription')}
            placeholder={t('strategy.pillars.pillarDescriptionPlaceholder')}
            rows={4}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="primary"
              className="flex-1"
              onClick={handleSubmit(onSubmit)}
            >
              {t('common.add')}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddPillarModal;
