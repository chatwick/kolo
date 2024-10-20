import { Button, Modal } from "react-bootstrap";

interface ConfirmationModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  userName: string;
}

const ConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  userName,
}: ConfirmationModalProps) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Status Update</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to change the status of {userName} ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
