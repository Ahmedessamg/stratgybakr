import { useState } from "react";
import { useTranslation } from "react-i18next";
import GoalItem from "@/pages/StrategyView/components/shared/GoalItem";
import { useExecutiveGoals } from "@/hooks/useExecutiveGoals";
import { ExecutiveGoalData, ExecutiveGoalFormData } from "@/services/supabase/executiveGoal";
import AddExecutiveGoalModal from "./AddExecutiveGoalModal";
import EditExecutiveGoalModal from "./EditExecutiveGoalModal";
import { DeleteConfirmationModal } from "@/components/ui";
import "./styles.scss";
import { AddCircle } from "@/components/icons/svg";
import { Loader2 } from "lucide-react";

interface ExecutiveGoalsTabProps {
  planId: string;
}

const ExecutiveGoalsTab = ({ planId }: ExecutiveGoalsTabProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<ExecutiveGoalData | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { goals, loading, error, createGoal, updateGoal, deleteGoal } =
    useExecutiveGoals(planId);

  const handleGoalChange = async (goalId: string, checked: boolean) => {
    try {
      await updateGoal(goalId, { is_active: checked });
    } catch (err) {
      console.error("Error updating goal:", err);
    }
  };

  const handleAddGoal = () => {
    setIsAddModalOpen(true);
  };

  const handleCreateGoal = async (formData: ExecutiveGoalFormData) => {
    await createGoal(formData);
  };

  const handleEditGoal = (goal: ExecutiveGoalData) => {
    setSelectedGoal(goal);
    setIsEditModalOpen(true);
  };

  const handleUpdateGoal = async (goalId: string, formData: Partial<ExecutiveGoalFormData>) => {
    await updateGoal(goalId, formData);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoalToDelete(goalId);
  };

  const confirmDelete = async () => {
    if (goalToDelete) {
      setIsDeleting(true);
      try {
        await deleteGoal(goalToDelete);
        setGoalToDelete(null);
      } catch (err) {
        console.error("Error deleting goal:", err);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const cancelDelete = () => {
    setGoalToDelete(null);
  };

   if (loading) {
    return (
      <div className="executive-goals-tab">
        <div className="executive-goals-tab__loading">
          <Loader2 size={32} className="spinner" />
          <p>{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="executive-goals-tab">
        <div className="executive-goals-tab__error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="executive-goals-tab">
      {/* Header */}
      <div className="executive-goals-tab__header">
        <h3 className="executive-goals-tab__title">
          {t("strategicPlans.executiveGoals.title")}{" "}
          <span>({goals.length})</span>
        </h3>
      </div>

      {/* Goals List */}
      <div className="executive-goals-tab__list">
        {goals.map((goal) => (
          <GoalItem
            key={goal.id}
            id={goal.id}
            text={goal.name}
            isRTL={isRTL}
            defaultChecked={goal.is_active}
            onChange={(checked) => handleGoalChange(goal.id, checked)}
            showActions={true}
            onEdit={() => handleEditGoal(goal)}
            onDelete={() => handleDeleteGoal(goal.id)}
          />
        ))}
      </div>

      {/* Add Goal Button */}
      <button className="executive-goals-tab__add-btn" onClick={handleAddGoal}>
        <AddCircle width={15} height={15} />
        <span>{t("strategicPlans.executiveGoals.addGoal")}</span>
      </button>

      {/* Add Goal Modal */}
      <AddExecutiveGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateGoal}
      />

      {/* Edit Goal Modal */}
      <EditExecutiveGoalModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGoal(null);
        }}
        onSubmit={handleUpdateGoal}
        goal={selectedGoal}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!goalToDelete}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title={t("strategicPlans.executiveGoals.deleteConfirm.title")}
        message={t("strategicPlans.executiveGoals.deleteConfirm.message")}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ExecutiveGoalsTab;
