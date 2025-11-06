import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Modal, Button, Input, Textarea } from '../../../../components/ui';
import { Value } from './ValueItem';

interface AddValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: Value) => void;
  editValue?: Value | null;
}

interface ValueFormData {
  name: string;
  description: string;
}

const AddValueModal = ({ isOpen, onClose, onSave, editValue }: AddValueModalProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, setValue } = useForm<ValueFormData>({
    defaultValues: {
      name: '',
      description: ''
    }
  });

  useEffect(() => {
    if (editValue) {
      setValue('name', editValue.name);
      setValue('description', editValue.description);
    } else {
      reset({
        name: '',
        description: ''
      });
    }
  }, [editValue, setValue, reset]);

  const onSubmit = (data: ValueFormData) => {
    const value: Value = {
      id: editValue?.id || Date.now().toString(),
      ...data
    };
    onSave(value);
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
      title={t('strategy.values.addNew')}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {/* Name */}
          <Input
            name="name"
            control={control}
            label={t('strategy.values.valueName')}
            placeholder={t('strategy.values.valueNamePlaceholder')}
            required
            rules={{ required: t('validation.required') }}
          />

          {/* Description */}
          <Textarea
            name="description"
            control={control}
            label={t('strategy.values.valueDescription')}
            placeholder={t('strategy.values.valueDescriptionPlaceholder')}
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

export default AddValueModal;
