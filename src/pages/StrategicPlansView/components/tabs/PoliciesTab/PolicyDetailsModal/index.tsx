import { useTranslation } from "react-i18next";
import { Eye, Download } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { PolicyData } from "@/services/supabase/policy";
import "./styles.scss";

interface PolicyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: PolicyData | null;
}

const PolicyDetailsModal = ({ isOpen, onClose, policy }: PolicyDetailsModalProps) => {
  const { t } = useTranslation();

  if (!policy) return null;

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    if (ext === 'pdf') {
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.625 0H22.5L28.125 7.5V28.125C28.125 29.1625 27.2875 30 26.25 30H5.625C4.5875 30 3.75 29.1625 3.75 28.125V1.875C3.75 0.8375 4.5875 0 5.625 0Z" fill="#E2E5E7"/>
          <path d="M22.5 0L28.125 7.5H24.375C23.3375 7.5 22.5 6.6625 22.5 5.625V0Z" fill="#B0B7BD"/>
          <path d="M22.5 7.5L28.125 15V7.5H22.5Z" fill="#CAD1D8"/>
          <path d="M1.875 14.0625H24.375V25.3125H1.875V14.0625Z" fill="#F15642"/>
          <text x="50%" y="21" fontSize="5.25" fontWeight="600" fill="white" textAnchor="middle">PDF</text>
        </svg>
      );
    }
    
    if (['jpg', 'jpeg', 'png'].includes(ext || '')) {
      return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.625 0H22.5L28.125 7.5V28.125C28.125 29.1625 27.2875 30 26.25 30H5.625C4.5875 30 3.75 29.1625 3.75 28.125V1.875C3.75 0.8375 4.5875 0 5.625 0Z" fill="#E2E5E7"/>
          <path d="M22.5 0L28.125 7.5H24.375C23.3375 7.5 22.5 6.6625 22.5 5.625V0Z" fill="#B0B7BD"/>
          <path d="M22.5 7.5L28.125 15V7.5H22.5Z" fill="#CAD1D8"/>
          <path d="M1.875 14.0625H24.375V25.3125H1.875V14.0625Z" fill="#50BEE8"/>
          <text x="50%" y="21" fontSize="4.5" fontWeight="600" fill="white" textAnchor="middle">{ext?.toUpperCase()}</text>
        </svg>
      );
    }

    return (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.625 0H22.5L28.125 7.5V28.125C28.125 29.1625 27.2875 30 26.25 30H5.625C4.5875 30 3.75 29.1625 3.75 28.125V1.875C3.75 0.8375 4.5875 0 5.625 0Z" fill="#E2E5E7"/>
        <path d="M22.5 0L28.125 7.5H24.375C23.3375 7.5 22.5 6.6625 22.5 5.625V0Z" fill="#B0B7BD"/>
      </svg>
    );
  };

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const handlePreview = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("strategicPlans.policies.viewDetails")}>
      <div className="policy-details-modal">
        {/* Policy Name */}
        <div className="policy-details-modal__section">
          <h4 className="policy-details-modal__label">
            {t("strategicPlans.policies.name")}
          </h4>
          <p className="policy-details-modal__value">{policy.name}</p>
        </div>

        {/* Policy Description */}
        <div className="policy-details-modal__section">
          <h4 className="policy-details-modal__label">
            {t("strategicPlans.policies.description")}
          </h4>
          <p className="policy-details-modal__value policy-details-modal__value--description">
            {policy.description}
          </p>
        </div>

        {/* Attachments Tab */}
        {policy.attachments && policy.attachments.length > 0 && (
          <>
            <div className="policy-details-modal__tabs">
              <div className="policy-details-modal__tab policy-details-modal__tab--active">
                {t("strategicPlans.policies.attachments")}
              </div>
            </div>

            {/* Attachments List */}
            <div className="policy-details-modal__attachments">
              {policy.attachments.map((attachment) => (
                <div key={attachment.id} className="attachment-item">
                  <div className="attachment-item__icon">
                    {getFileIcon(attachment.file_name)}
                  </div>
                  
                  <div className="attachment-item__info">
                    <p className="attachment-item__name">{attachment.file_name}</p>
                  </div>

                  <div className="attachment-item__actions">
                    <button
                      className="attachment-item__action-btn"
                      onClick={() => handlePreview(attachment.file_url)}
                      title={t("common.preview")}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="attachment-item__action-btn"
                      onClick={() => handleDownload(attachment.file_url)}
                      title={t("common.download")}
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default PolicyDetailsModal;
