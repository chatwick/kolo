import { OrderStatusEnum } from "@/constants/order.constants";
import { orderStatusMaptoString } from "@/utils/order.utils";
import { Dispatch, SetStateAction } from "react";
import { Button, Modal } from "react-bootstrap";

type Props = {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  status: OrderStatusEnum | null;
  onConfirm: () => void;
};

const CommonConfirmModal = ({ show, setShow, status, onConfirm }: Props) => {
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Change Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to change the status to{" "}
        {orderStatusMaptoString[status as OrderStatusEnum]}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommonConfirmModal;
