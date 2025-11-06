import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import "./styles.scss";
import { Button, Pagination } from "@/components/ui";
import AddPolicyModal from "./AddPolicyModal";
import PolicyDetailsModal from "./PolicyDetailsModal";
import { usePolicies } from "@/hooks";
import { PolicyData, PolicyFormData } from "@/services/supabase/policy";

interface PoliciesTabProps {
  planId: string;
}

const PoliciesTab = ({ planId }: PoliciesTabProps) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { policies, total, totalPages, loading, error, createPolicy } =
    usePolicies(planId, currentPage, pageSize);

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitPolicy = async (data: PolicyFormData) => {
    try {
      await createPolicy(data);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create policy:", err);
    }
  };

  const handleViewDetails = (policy: PolicyData) => {
    setSelectedPolicy(policy);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedPolicy(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="policies-tab">
        <div className="policies-tab__loading">
          <Loader2 size={32} className="spinner" />
          <p>{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="policies-tab">
        <div className="policies-tab__error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="policies-tab">
      {/* Header */}
      <div className="policies-tab__header">
        <h3 className="policies-tab__title">
          {t("strategicPlans.policies.title")} <span>({total})</span>
        </h3>
        <Button onClick={handleAddNew}>
          {t("strategicPlans.policies.addNew")}
        </Button>
      </div>

      {/* Policies List */}
      {policies.length === 0 ? (
        <div className="policies-tab__empty">
          <p>{t("strategicPlans.policies.noPolicies")}</p>
        </div>
      ) : (
        <div className="policies-tab__list">
          {policies.map((policy, index) => (
            <div key={policy.id} className="policy-item">
              <div className="policy-item__number">
                {String((currentPage - 1) * pageSize + index + 1).padStart(
                  2,
                  "0"
                )}
              </div>
              <div className="policy-item__content">
                <h4 className="policy-item__name">{policy.name}</h4>
                {/* <p className="policy-item__description">{policy.description}</p> */}
              </div>
              <button
                className="policy-item__view-btn"
                onClick={() => handleViewDetails(policy)}
              >
                {t("strategicPlans.policies.viewDetails")}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {/* Add Policy Modal */}
      <AddPolicyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPolicy}
      />

      {/* Policy Details Modal */}
      <PolicyDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        policy={selectedPolicy}
      />
    </div>
  );
};

export default PoliciesTab;
