import { supabase } from '../client';

export interface PolicyData {
  id: string;
  strategic_plan_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  attachments?: PolicyAttachment[];
}

export interface PolicyFormData {
  name: string;
  description: string;
  attachments: File[];
}

export interface PolicyAttachment {
  id: string;
  policy_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  created_at: string;
}

export interface PaginatedPolicies {
  data: PolicyData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class PolicyService {
  async createPolicy(
    strategicPlanId: string,
    formData: PolicyFormData
  ): Promise<PolicyData> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Verify user owns the strategic plan
    const { data: plan } = await supabase
      .from('strategic_plans')
      .select('id')
      .eq('id', strategicPlanId)
      .eq('user_id', user.id)
      .single();

    if (!plan) {
      throw new Error('Strategic plan not found or access denied');
    }

    // Create policy
    const { data: policy, error } = await supabase
      .from('strategic_plan_policies')
      .insert({
        strategic_plan_id: strategicPlanId,
        name: formData.name,
        description: formData.description,
      })
      .select()
      .single();

    if (error) throw error;

    // Upload attachments if any
    if (formData.attachments && formData.attachments.length > 0) {
      await Promise.all(
        formData.attachments.map((file) =>
          this.uploadPolicyAttachment(file, policy.id, user.id)
        )
      );
    }

    // Fetch policy with attachments
    return this.getPolicyById(policy.id);
  }

  async updatePolicy(
    policyId: string,
    formData: Partial<PolicyFormData>
  ): Promise<PolicyData> {
    const updates: any = {};
    
    if (formData.name !== undefined) updates.name = formData.name;
    if (formData.description !== undefined) updates.description = formData.description;

    const { error } = await supabase
      .from('strategic_plan_policies')
      .update(updates)
      .eq('id', policyId)
      .select()
      .single();

    if (error) throw error;

    // Handle new attachments if provided
    if (formData.attachments && formData.attachments.length > 0) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await Promise.all(
          formData.attachments.map((file) =>
            this.uploadPolicyAttachment(file, policyId, user.id)
          )
        );
      }
    }

    return this.getPolicyById(policyId);
  }

  async deletePolicy(policyId: string): Promise<void> {
    // Get all attachments to delete from storage
    const { data: attachments } = await supabase
      .from('strategic_plan_policy_attachments')
      .select('file_url')
      .eq('policy_id', policyId);

    // Delete files from storage
    if (attachments && attachments.length > 0) {
      const filePaths = attachments
        .map((att) => this.extractFilePathFromUrl(att.file_url))
        .filter((path): path is string => path !== null);

      if (filePaths.length > 0) {
        await supabase.storage
          .from('strategic-plan-policy-attachments')
          .remove(filePaths);
      }
    }

    // Delete policy (attachments will be cascade deleted)
    const { error } = await supabase
      .from('strategic_plan_policies')
      .delete()
      .eq('id', policyId);

    if (error) throw error;
  }

  async getPoliciesByPlan(
    strategicPlanId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedPolicies> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Get total count
    const { count } = await supabase
      .from('strategic_plan_policies')
      .select('*', { count: 'exact', head: true })
      .eq('strategic_plan_id', strategicPlanId);

    // Get paginated data
    const { data, error } = await supabase
      .from('strategic_plan_policies')
      .select(`
        *,
        attachments:strategic_plan_policy_attachments (*)
      `)
      .eq('strategic_plan_id', strategicPlanId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  }

  async getPolicyById(policyId: string): Promise<PolicyData> {
    const { data, error } = await supabase
      .from('strategic_plan_policies')
      .select(`
        *,
        attachments:strategic_plan_policy_attachments (*)
      `)
      .eq('id', policyId)
      .single();

    if (error) throw error;
    return data;
  }

  async uploadPolicyAttachment(
    file: File,
    policyId: string,
    userId: string
  ): Promise<PolicyAttachment> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${policyId}/${Date.now()}.${fileExt}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('strategic-plan-policy-attachments')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('strategic-plan-policy-attachments')
      .getPublicUrl(fileName);

    // Save attachment record
    const { data: attachment, error: dbError } = await supabase
      .from('strategic_plan_policy_attachments')
      .insert({
        policy_id: policyId,
        file_name: file.name,
        file_url: publicUrl,
        file_size: file.size,
      })
      .select()
      .single();

    if (dbError) throw dbError;
    return attachment;
  }

  async deletePolicyAttachment(attachmentId: string): Promise<void> {
    // Get attachment to get file URL
    const { data: attachment } = await supabase
      .from('strategic_plan_policy_attachments')
      .select('file_url')
      .eq('id', attachmentId)
      .single();

    if (attachment?.file_url) {
      const filePath = this.extractFilePathFromUrl(attachment.file_url);
      if (filePath) {
        await supabase.storage
          .from('strategic-plan-policy-attachments')
          .remove([filePath]);
      }
    }

    // Delete attachment record
    const { error } = await supabase
      .from('strategic_plan_policy_attachments')
      .delete()
      .eq('id', attachmentId);

    if (error) throw error;
  }

  private extractFilePathFromUrl(url: string): string | null {
    const urlParts = url.split('/');
    const bucketIndex = urlParts.findIndex(
      (part) => part === 'strategic-plan-policy-attachments'
    );
    
    if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
      return urlParts.slice(bucketIndex + 1).join('/');
    }
    
    return null;
  }
}

export const policyService = new PolicyService();
