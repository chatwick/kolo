import { COMMON_ENTITY_STATUS } from "@/constants/common.constants";
import { IProduct } from "@/interfaces/product.interface";
import {
  useDeleteProduct,
  useUpdateProductStatus,
} from "@/lib/hooks/products.lib";
import { commonStatusMaptoString } from "@/utils/order.utils";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Card, Dropdown, Modal } from "react-bootstrap";

type Props = {
  product: IProduct;
};

const ProductCard = ({ product }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateStatus, isPending } =
    useUpdateProductStatus(queryClient);

  const { mutateAsync: deleteProduct } = useDeleteProduct(queryClient);
  const [showModal, setShowModal] = useState(false);

  const handleStatusUpdate = async (status: COMMON_ENTITY_STATUS) => {
    if (status === COMMON_ENTITY_STATUS.ENABLED) {
      status = COMMON_ENTITY_STATUS.DISABLED;
    } else {
      status = COMMON_ENTITY_STATUS.ENABLED;
    }

    await updateStatus({ prodId: product.Id, product, status });
  };

  const handleProductDelete = async () => {
    await deleteProduct(product.Id);
    setShowModal(false);
  };

  return (
    <>
      <Card
        style={{ width: "18rem", display: "flex", flexDirection: "column" }}
      >
        <Card.Body style={{ flex: "1 0 auto" }}>
          <div className="d-flex justify-content-between align-items-start">
            <Card.Title>{product.Name}</Card.Title>
            <Card.Subtitle className="text-primary align-self-center ">
              Rs {product.Price}
            </Card.Subtitle>
          </div>
          <Card.Img
            variant="top"
            src={product.ImageUrl}
            style={{
              height: "250px", // Set a fixed height
              objectFit: "cover", // Ensures the image covers the area without distortion
            }}
          />
          <div
            style={{
              flex: "1 1 auto",
              overflowY: "auto",
              maxHeight: "120px",
              margin: "10px 0",
            }}
          >
            <Card.Text>{product.Details}</Card.Text>
            <div className="small text-muted">
              <div>Quantity: {product.Quantity}</div>
              <div>Status: {commonStatusMaptoString[product.Status]}</div>
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="d-flex bg-white justify-content-between mt-auto ">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Modify
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href={`/inventory/${product.Id}`}>
                Update
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setShowModal(true)}>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Button
            onClick={() => handleStatusUpdate(product.Status)}
            disabled={isPending}
            className={`${
              product.Status === COMMON_ENTITY_STATUS.ENABLED
                ? "btn-warning"
                : "btn-success"
            }`}
          >
            {product.Status === COMMON_ENTITY_STATUS.ENABLED
              ? "Disable"
              : "Enable"}
          </Button>
        </Card.Footer>
      </Card>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this product? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleProductDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductCard;
