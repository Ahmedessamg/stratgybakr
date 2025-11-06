import Modal from "./Modal";
import Button from "./Button";
import "./DeleteConfirmationModal.scss";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDeleting?: boolean;
}

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDeleting = false,
}: DeleteConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="delete-confirmation-modal">
        <p className="delete-confirmation-modal__message">{message}</p>
        <div className="delete-confirmation-modal__actions">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isDeleting}
            className="delete-confirmation-modal__delete-btn"
          >
            {isDeleting ? "Deleting..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
