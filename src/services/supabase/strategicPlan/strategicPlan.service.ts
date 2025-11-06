import { supabase } from '../client';

export interface StrategicPlanData {
  id: string;
  name: string;
  description?: string;
  strategy_id?: string;
  strategic_goal_id?: string;
  element?: string;
  sub_element?: string;
  duration?: string;
  owner?: string;
  privacy?: string;
  is_active?: boolean;
  vision?: string;
  message?: string;
  governing_values?: string;
  focus_areas?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  attachments?: StrategicPlanAttachment[];
}

export interface StrategicPlanFormData {
  name: string;
  description: string;
  strategy_id: string;
  strategic_goal_id: string;
  element: string;
  sub_element: string;
  duration: string;
  owner: string;
  privacy: string;
  is_active: boolean;
  vision: string;
  message: string;
  governing_values: string;
  focus_areas: string;
  attachments: (File | StrategicPlanAttachment)[];
  attachmentsToDelete: string[];
}

export interface StrategicPlanAttachment {
  id: string;
  strategic_plan_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  created_at: string;
}

export interface Strategy {
  id: string;
  name: string;
}

export interface StrategicGoal {
  id: string;
  name: string;
}

export interface Element {
  id: string;
  name: string;
}

export interface SubElement {
  id: string;
  name: string;
  element_id: string;
}

class StrategicPlanService {
  async createStrategicPlan(data: Omit<StrategicPlanFormData, 'attachments' | 'attachmentsToDelete'>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data: plan, error } = await supabase
      .from('strategic_plans')
      .insert({
        ...data,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return plan;
  }

  async updateStrategicPlan(id: string, data: Partial<Omit<StrategicPlanFormData, 'attachments' | 'attachmentsToDelete'>>) {
    const { data: plan, error } = await supabase
      .from('strategic_plans')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return plan;
  }

  async getStrategicPlan(id: string) {
    const { data, error } = await supabase
      .from('strategic_plans')
      .select(`
        *,
        attachments:strategic_plan_attachments (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async deleteStrategicPlan(id: string) {
    const { error } = await supabase
      .from('strategic_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async uploadPlanAttachment(file: File, planId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${planId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('strategic-plan-attachments')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('strategic-plan-attachments')
      .getPublicUrl(fileName);

    const { data: attachment, error: dbError } = await supabase
      .from('strategic_plan_attachments')
      .insert({
        strategic_plan_id: planId,
        file_name: file.name,
        file_url: publicUrl,
        file_size: file.size,
      })
      .select()
      .single();

    if (dbError) throw dbError;
    return attachment;
  }

  async deleteAttachment(id: string) {
    const { data: attachment } = await supabase
      .from('strategic_plan_attachments')
      .select('file_url')
      .eq('id', id)
      .single();

    if (attachment?.file_url) {
      // Extract the full path from the URL (everything after the bucket name)
      const urlParts = attachment.file_url.split('/');
      const bucketIndex = urlParts.findIndex((part: string) => part === 'strategic-plan-attachments');
      if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
        const filePath = urlParts.slice(bucketIndex + 1).join('/');
        await supabase.storage
          .from('strategic-plan-attachments')
          .remove([filePath]);
      }
    }

    const { error } = await supabase
      .from('strategic_plan_attachments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async getStrategies(): Promise<Strategy[]> {
    const { data, error } = await supabase
      .from('strategies')
      .select('id, name')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getStrategicGoals(): Promise<StrategicGoal[]> {
    const { data, error } = await supabase
      .from('strategic_goals')
      .select('id, name')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getElements(): Promise<Element[]> {
    const { data, error } = await supabase
      .from('elements')
      .select('id, name')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getSubElements(): Promise<SubElement[]> {
    const { data, error } = await supabase
      .from('sub_elements')
      .select('id, name, element_id')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getSubElementsByElement(elementId: string): Promise<SubElement[]> {
    const { data, error } = await supabase
      .from('sub_elements')
      .select('id, name, element_id')
      .eq('element_id', elementId)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  async getStrategicPlans(): Promise<StrategicPlanData[]> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('strategic_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async deleteStrategicPlanById(id: string) {
    const { error } = await supabase
      .from('strategic_plans')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

export const strategicPlanService = new StrategicPlanService();

