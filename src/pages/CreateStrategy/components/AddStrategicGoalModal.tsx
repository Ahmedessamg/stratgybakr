import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { Modal, Button, Input, Select } from '../../../components/ui';

export interface Goal {
  id: string;
  name: string;
  duration: string;
  element: string;
  description: string;
  status: boolean;
}

interface AddStrategicGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: Goal) => Promise<void>;
  editGoal?: Goal | null;
}

interface GoalFormData {
  name: string;
  duration: string;
  element: string;
  description: string;
  status: boolean;
}

const AddStrategicGoalModal = ({ isOpen, onClose, onSave, editGoal }: AddStrategicGoalModalProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit, reset, setValue } = useForm<GoalFormData>({
    defaultValues: {
      name: '',
      duration: '',
      element: '',
      description: '',
      status: true
    }
  });

  // Populate form when editing
  useEffect(() => {
    if (editGoal) {
      setValue('name', editGoal.name);
      setValue('duration', editGoal.duration);
      setValue('element', editGoal.element);
      setValue('description', editGoal.description);
      setValue('status', editGoal.status);
    } else {
      reset({
        name: '',
        duration: '',
        element: '',
        description: '',
        status: true
      });
    }
  }, [editGoal, setValue, reset]);

  const onSubmit = async (data: GoalFormData) => {
    const goal: Goal = {
      id: editGoal?.id || Date.now().toString(),
      ...data
    };
    await onSave(goal);
    reset({
      name: '',
      duration: '',
      element: '',
      description: '',
      status: true
    });
  };

  const handleCancel = () => {
    reset({
      name: '',
      duration: '',
      element: '',
      description: '',
      status: true
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={editGoal ? t('strategy.goalModal.edit') : t('strategy.strategicGoals.addNew')}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          {/* Name */}
          <Input
            name="name"
            control={control}
            label={t('strategy.goalModal.name')}
            placeholder={t('strategy.goalModal.namePlaceholder')}
            required
            rules={{ required: t('validation.required') }}
          />

          {/* Duration and Element in Row */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              name="duration"
              control={control}
              label={t('strategy.goalModal.duration')}
              placeholder={t('strategy.goalModal.durationPlaceholder')}
              options={[
                { value: '1', label: t('strategy.goalModal.duration1') },
                { value: '2', label: t('strategy.goalModal.duration2') },
                { value: '3', label: t('strategy.goalModal.duration3') }
              ]}
            />

            <Select
              name="element"
              control={control}
              label={t('strategy.goalModal.element')}
              placeholder={t('strategy.goalModal.elementPlaceholder')}
              options={[
                { value: '1', label: t('strategy.goalModal.element1') },
                { value: '2', label: t('strategy.goalModal.element2') }
              ]}
            />
          </div>

          {/* Description */}
          <Input
            name="description"
            control={control}
            label={t('strategy.goalModal.description')}
            placeholder={t('strategy.goalModal.descriptionPlaceholder')}
          />

          {/* Activation Status Toggle */}
          <Controller
            name="status"
            control={control}
            defaultValue={true}
            render={({ field }) => (
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-[var(--text)]">
                  {t('strategy.goalModal.status')}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={field.value}
                    onChange={field.onChange}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--primary)]/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                  <span className="ms-3 text-sm font-medium text-[var(--muted)]">
                    {t('strategy.goalModal.active')}
                  </span>
                </label>
              </div>
            )}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="primary"
              className="flex-1"
              onClick={handleSubmit(onSubmit)}
            >
              {t('strategy.goalModal.create')}
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

export default AddStrategicGoalModal;
