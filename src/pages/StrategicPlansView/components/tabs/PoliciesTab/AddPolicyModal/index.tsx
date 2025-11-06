import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Modal from "@/components/ui/Modal";
import { Input, Textarea, Button } from "@/components/ui";
import { PolicyFormData } from "@/services/supabase/policy";
import "./styles.scss";
import { useState } from "react";

interface AddPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PolicyFormData) => void;
}

const AddPolicyModal = ({ isOpen, onClose, onSubmit }: AddPolicyModalProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<PolicyFormData>({
    defaultValues: {
      name: "",
      description: "",
      attachments: [],
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = (data: PolicyFormData) => {
    setIsLoading(true);
    onSubmit(data);
    handleClose();
    setIsLoading(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t("strategicPlans.policies.addPolicy")}
    >
      <form className="add-policy-form" onSubmit={handleSubmit(onFormSubmit)}>
        {/* Name Field */}
        <Input
          name="name"
          control={control}
          label={t("strategicPlans.policies.name")}
          placeholder={t("strategicPlans.policies.namePlaceholder")}
          required
          rules={{ required: t("validation.required") }}
        />

        {/* Description Field */}
        <Textarea
          name="description"
          control={control}
          label={t("strategicPlans.policies.description")}
          placeholder={t("strategicPlans.policies.descriptionPlaceholder")}
          rows={8}
          required
          rules={{ required: t("validation.required") }}
        />

        {/* Action Buttons */}
        <div className="form-actions">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleClose}
          >
            {t("strategicPlans.policies.cancel")}
          </Button>
          <Button type="submit" variant="primary" loading={isLoading} size="md">
            {t("strategicPlans.policies.add")}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPolicyModal;
