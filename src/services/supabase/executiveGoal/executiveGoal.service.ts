import { supabase } from "../client";

export interface ExecutiveGoalData {
  id: string;
  strategic_plan_id: string;
  name: string;
  description?: string;
  duration?: string;
  owner?: string;
  element?: string;
  related_to?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ExecutiveGoalFormData {
  name: string;
  description?: string;
  duration?: string;
  owner?: string;
  element?: string;
  related_to?: string;
  is_active: boolean;
}

export const createExecutiveGoal = async (
  strategicPlanId: string,
  formData: ExecutiveGoalFormData
): Promise<ExecutiveGoalData> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("strategic_plan_executive_goals")
    .insert({
      strategic_plan_id: strategicPlanId,
      user_id: user.id,
      ...formData,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateExecutiveGoal = async (
  goalId: string,
  formData: Partial<ExecutiveGoalFormData>
): Promise<ExecutiveGoalData> => {
  const { data, error } = await supabase
    .from("strategic_plan_executive_goals")
    .update(formData)
    .eq("id", goalId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteExecutiveGoal = async (goalId: string): Promise<void> => {
  const { error } = await supabase
    .from("strategic_plan_executive_goals")
    .delete()
    .eq("id", goalId);

  if (error) {
    throw new Error(error.message);
  }
};

export const getExecutiveGoalsByPlan = async (
  strategicPlanId: string
): Promise<ExecutiveGoalData[]> => {
  const { data, error } = await supabase
    .from("strategic_plan_executive_goals")
    .select("*")
    .eq("strategic_plan_id", strategicPlanId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const toggleExecutiveGoalStatus = async (
  goalId: string,
  isActive: boolean
): Promise<ExecutiveGoalData> => {
  return updateExecutiveGoal(goalId, { is_active: isActive });
};
