import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { strategicPlanService, StrategicPlanFormData } from '../services/supabase/strategicPlan/strategicPlan.service';
import { ROUTES } from '../constants';

export const useCreateStrategicPlan = (planId?: string, isEditMode: boolean = false) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const createStrategicPlan = async (data: StrategicPlanFormData) => {
    try {
      setLoading(true);

      // Extract attachments and attachmentsToDelete from data
      const { attachments, attachmentsToDelete, ...planData } = data;

      let plan;
      if (isEditMode && planId) {
        plan = await strategicPlanService.updateStrategicPlan(planId, planData);
        toast.success(t('messages.updateSuccess'));
      } else {
        plan = await strategicPlanService.createStrategicPlan(planData);
        toast.success(t('messages.saveSuccess'));
      }

      // Handle attachments after plan is created/updated
      if (plan && attachments) {
        // Upload new files
        const newFiles = attachments.filter(attachment => attachment instanceof File);
        for (const file of newFiles) {
          await strategicPlanService.uploadPlanAttachment(file, plan.id);
        }

        // Delete attachments marked for deletion
        for (const attachmentId of attachmentsToDelete) {
          await strategicPlanService.deleteAttachment(attachmentId);
        }
      }

      navigate(ROUTES.STRATEGIC_PLANS);
    } catch (error) {
      toast.error(t('messages.saveError'));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createStrategicPlan,
  };
};

