import { useState, useEffect, useCallback } from "react";
import {
  createExecutiveGoal,
  updateExecutiveGoal,
  deleteExecutiveGoal,
  getExecutiveGoalsByPlan,
  ExecutiveGoalData,
  ExecutiveGoalFormData,
} from "@/services/supabase/executiveGoal";

export const useExecutiveGoals = (strategicPlanId: string) => {
  const [goals, setGoals] = useState<ExecutiveGoalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    if (!strategicPlanId) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getExecutiveGoalsByPlan(strategicPlanId);
      setGoals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch goals");
    } finally {
      setLoading(false);
    }
  }, [strategicPlanId]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const createGoal = async (formData: ExecutiveGoalFormData) => {
    const newGoal = await createExecutiveGoal(strategicPlanId, formData);
    setGoals((prev) => [newGoal, ...prev]);
    return newGoal;
  };

  const updateGoal = async (
    goalId: string,
    formData: Partial<ExecutiveGoalFormData>
  ) => {
    const updatedGoal = await updateExecutiveGoal(goalId, formData);
    setGoals((prev) =>
      prev.map((goal) => (goal.id === goalId ? updatedGoal : goal))
    );
    return updatedGoal;
  };

  const deleteGoal = async (goalId: string) => {
    await deleteExecutiveGoal(goalId);
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
  };

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: fetchGoals,
  };
};
