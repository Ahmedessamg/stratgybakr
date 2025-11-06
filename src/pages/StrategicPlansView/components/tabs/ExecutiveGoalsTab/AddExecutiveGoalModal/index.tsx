import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { ExecutiveGoalFormData } from "@/services/supabase/executiveGoal";
import "./styles.scss";
import { Select } from "@/components/ui";

interface AddExecutiveGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExecutiveGoalFormData) => Promise<void>;
}

const AddExecutiveGoalModal = ({
  isOpen,
  onClose,
  onSubmit,
}: AddExecutiveGoalModalProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm<ExecutiveGoalFormData>({
    defaultValues: {
      name: "",
      description: "",
      duration: "",
      owner: "",
      element: "",
      related_to: "",
      is_active: true,
    },
  });

  const handleFormSubmit = async (data: ExecutiveGoalFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating executive goal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("strategicPlans.executiveGoals.addGoalModal.title")}
    >
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="add-goal-modal"
      >
        {/* Name Field */}
        <div className="add-goal-modal__field">
          <Input
            name="name"
            control={control}
            label={t("strategicPlans.executiveGoals.addGoalModal.name")}
            placeholder={t(
              "strategicPlans.executiveGoals.addGoalModal.namePlaceholder"
            )}
            required
            rules={{ required: t("common.required") }}
          />
        </div>

        {/* Duration and Owner Row */}
        <div className="add-goal-modal__row">
          {/* Duration Field */}
          <div className="add-goal-modal__field add-goal-modal__field--half">
            {/* <Input
              name="duration"
              control={control}
              label={t("strategicPlans.executiveGoals.addGoalModal.duration")}
              placeholder={t(
                "strategicPlans.executiveGoals.addGoalModal.durationPlaceholder"
              )}
            /> */}
            <Select
              control={control}
              name="duration"
              label={t("strategicPlans.executiveGoals.addGoalModal.duration")}
              placeholder={t(
                "strategicPlans.executiveGoals.addGoalModal.durationPlaceholder"
              )}
              options={[
                { value: "1", label: t("strategy.goalModal.duration1") },
                { value: "2", label: t("strategy.goalModal.duration2") },
                { value: "3", label: t("strategy.goalModal.duration3") },
              ]}
            />
          </div>

          {/* Owner Field */}
          <div className="add-goal-modal__field add-goal-modal__field--half">
            {/* <Input
              name="owner"
              control={control}
              label={t("strategicPlans.executiveGoals.addGoalModal.owner")}
              placeholder={t(
                "strategicPlans.executiveGoals.addGoalModal.ownerPlaceholder"
              )}
            /> */}
            <Select
              control={control}
              name="owner"
              label={t("strategicPlans.executiveGoals.addGoalModal.owner")}
              placeholder={t(
                "strategicPlans.executiveGoals.addGoalModal.ownerPlaceholder"
              )}
              options={[
                { value: "Alice", label: "Alice" },
                { value: "Bob", label: "Bob" },
                { value: "Charlie", label: "Charlie" },
              ]}
            />
          </div>
        </div>

        {/* Element and Related To Row */}
        <div className="add-goal-modal__row">
          {/* Element Field */}
          <div className="add-goal-modal__field add-goal-modal__field--half">
            {/* <Input
              name="element"
              control={control}
              label={t("strategicPlans.executiveGoals.addGoalModal.element")}
              placeholder={t(
                "strategicPlans.executiveGoals.addGoalModal.elementPlaceholder"
              )}
            /> */}
            <Select
              name="element"
              control={control}
              label={t("strategicPlans.executiveGoals.addGoalModal.element")}
              placeholder={t(
                "strategicPlans.executiveGoals.addGoalModal.elementPlaceholder"
              )}
              options={[
                { value: "1", label: t("strategicPlans.goalModal.element1") },
                { value: "2", label: t("strategicPlans.goalModal.element2") },
              ]}
            />
          </div>

          {/* Related To Field */}
          <div className="add-goal-modal__field add-goal-modal__field--half">
            <Select
              name="related_to"
              control={control}
              label={t("strategicPlans.executiveGoals.addGoalModal.relatedTo")}
              placeholder={t(
                "strategicPlans.executiveGoals.addGoalModal.relatedToPlaceholder"
              )}
              options={[
                { value: "Project A", label: "Project A" },
                { value: "Project B", label: "Project B" },
              ]}
            />
          </div>
        </div>

        {/* Description Field */}
        <div className="add-goal-modal__field">
          <Textarea
            name="description"
            control={control}
            label={t("strategicPlans.executiveGoals.addGoalModal.description")}
            placeholder={t(
              "strategicPlans.executiveGoals.addGoalModal.descriptionPlaceholder"
            )}
            rows={6}
          />
        </div>

        {/* Active Status Toggle */}

        <Controller
          name="is_active"
          control={control}
          defaultValue={true}
          render={({ field }) => (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-[var(--text)]">
                {t("strategy.goalModal.status")}
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
                  {t("strategy.goalModal.active")}
                </span>
              </label>
            </div>
          )}
        />
        {/* Action Buttons */}
        <div className="add-goal-modal__actions">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="add-goal-modal__submit"
          >
            {isSubmitting
              ? t("common.loading")
              : t("strategicPlans.executiveGoals.addGoalModal.createGoal")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t("common.cancel")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExecutiveGoalModal;
