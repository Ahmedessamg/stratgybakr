import { useState, useEffect, useCallback } from 'react';
import { policyService, PolicyData, PolicyFormData, PaginatedPolicies } from '@/services/supabase/policy';

export const usePolicies = (strategicPlanId: string, page: number = 1, limit: number = 10) => {
  const [policies, setPolicies] = useState<PaginatedPolicies>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await policyService.getPoliciesByPlan(strategicPlanId, page, limit);
      setPolicies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch policies');
      console.error('Error fetching policies:', err);
    } finally {
      setLoading(false);
    }
  }, [strategicPlanId, page, limit]);

  useEffect(() => {
    if (strategicPlanId) {
      fetchPolicies();
    }
  }, [strategicPlanId, fetchPolicies]);

  const createPolicy = async (formData: PolicyFormData): Promise<PolicyData> => {
    try {
      setError(null);
      const policy = await policyService.createPolicy(strategicPlanId, formData);
      await fetchPolicies(); // Refresh the list
      return policy;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create policy';
      setError(errorMessage);
      throw err;
    }
  };

  const updatePolicy = async (policyId: string, formData: Partial<PolicyFormData>): Promise<PolicyData> => {
    try {
      setError(null);
      const policy = await policyService.updatePolicy(policyId, formData);
      await fetchPolicies(); // Refresh the list
      return policy;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update policy';
      setError(errorMessage);
      throw err;
    }
  };

  const deletePolicy = async (policyId: string): Promise<void> => {
    try {
      setError(null);
      await policyService.deletePolicy(policyId);
      await fetchPolicies(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete policy';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteAttachment = async (attachmentId: string): Promise<void> => {
    try {
      setError(null);
      await policyService.deletePolicyAttachment(attachmentId);
      await fetchPolicies(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete attachment';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    policies: policies.data,
    total: policies.total,
    page: policies.page,
    limit: policies.limit,
    totalPages: policies.totalPages,
    loading,
    error,
    createPolicy,
    updatePolicy,
    deletePolicy,
    deleteAttachment,
    refetch: fetchPolicies,
  };
};
