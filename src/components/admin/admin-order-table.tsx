"use client";

import CommonConfirmModal from "@/components/common/confirmation-modal";
import { COLORS } from "@/constants/common.constants";
import { OrderStatusEnum } from "@/constants/order.constants";
import { IOrder, IOrderItem } from "@/interfaces/order.interface";
import {
  useGetOrders,
  useUpdateOrderProductStatus,
  useUpdateOrderStatus,
} from "@/lib/hooks/order.lib";
import { useGetProductById } from "@/lib/hooks/products.lib";
import { orderStatusMaptoString } from "@/utils/order.utils";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Button,
  Dropdown,
  ListGroup,
  Modal,
  Spinner,
  Table,
} from "react-bootstrap";

const AdminOrderTable = () => {
  const queryClient = useQueryClient();
  const { data: orders, isFetching, refetch } = useGetOrders();

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showProductConfirmation, setShowProductConfirmation] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusEnum | null>(
    null,
  );
  const [selectedProductStatus, setSelectedProductStatus] =
    useState<OrderStatusEnum | null>(null);
  const [selectedOrderProduct, setSelectedOrderProduct] = useState<string>();
  const { mutateAsync: updateOrderProductStatus } =
    useUpdateOrderProductStatus(queryClient);

  const { mutateAsync: updateOrderStatus } = useUpdateOrderStatus(queryClient);

  if (isFetching) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </div>
    );
  }
  if (!orders || orders?.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        No orders found.
      </div>
    );
  }

  const handleRowClick = (order: IOrder) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleChangeStatus = (status: OrderStatusEnum) => {
    setSelectedStatus(status);
    setShowConfirmation(true);
  };

  const handleChangeProductStatus = (
    status: OrderStatusEnum,
    productId: string,
  ) => {
    setSelectedProductStatus(status);
    setSelectedOrderProduct(productId);
    setShowProductConfirmation(true);
  };

  // Function to handle the status update after confirmation
  const handleConfirmChangeStatus = async () => {
    if (selectedOrder && selectedStatus !== null) {
      await updateOrderStatus({
        orderId: selectedOrder.Id,
        status: selectedStatus,
        order: selectedOrder,
      });
      setShowConfirmation(false);
      refetch();
    }
  };
  const handleConfirmProductChangeStatus = async () => {
    // console.log('selectedOrderProduct', selectedOrderProduct);
    // console.log('selectedProductStatus', selectedProductStatus);
    // console.log('selectedOrder', selectedOrder);

    if (
      selectedOrder &&
      selectedProductStatus !== null &&
      selectedOrderProduct
    ) {
      await updateOrderProductStatus({
        orderId: selectedOrder.Id,
        status: selectedProductStatus,
        itemId: selectedOrderProduct,
      });
      setShowProductConfirmation(false);
      setShowModal(false);
      refetch();
    }
  };

  return (
    <main className=" px-5 mt-5">
      <h2 className="mb-4 text-center">Customer orders</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Order ID</th>
            <th>Product Name</th>
            <th>Address</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: IOrder, index: number) =>
            order.OrderItems.map((item: IOrderItem) => (
              <OrderRow
                key={item.ProductId}
                order={order}
                item={item}
                index={index}
                onClick={() => handleRowClick(order)}
              />
            )),
          )}
        </tbody>
      </Table>
      <CommonConfirmModal
        onConfirm={handleConfirmChangeStatus}
        show={showConfirmation}
        status={selectedStatus}
        setShow={setShowConfirmation}
      />
      <CommonConfirmModal
        onConfirm={handleConfirmProductChangeStatus}
        show={showProductConfirmation}
        status={selectedProductStatus}
        setShow={setShowProductConfirmation}
      />
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              <h5>Order ID: {selectedOrder.Id}</h5>
              <hr />
              <p>Customer ID: {selectedOrder.CustomerId}</p>
              <p>Address: {selectedOrder.Address}</p>
              <p>Payment: {selectedOrder.Payment}</p>
              <p>Payment Status: {selectedOrder.PaymentStatus}</p>
              <p>
                Status:{" "}
                {orderStatusMaptoString[selectedOrder.Status] ||
                  "Unknown Status"}
              </p>
              <p>Cancellation Note: {selectedOrder.CancellationNote}</p>
              <hr />

              <h6>Order Items:</h6>
              <ul>
                {selectedOrder.OrderItems.map((item) => (
                  // eslint-disable-next-line react/jsx-key
                  <ListGroup key={item.Id}>
                    {selectedOrder.OrderItems.map((item) => (
                      <ListGroup.Item
                        key={item.ProductId}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>Product ID:</strong> {item.ProductId} <br />
                          <strong>Quantity:</strong> {item.Quantity} <br />
                          <strong>Status:</strong>{" "}
                          {orderStatusMaptoString[item.Status] ||
                            "Unknown Status"}{" "}
                          <br />
                          <strong>Detail:</strong> {item.Detail}
                        </div>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="success"
                            id="dropdown-basic"
                          >
                            Change Status
                          </Dropdown.Toggle>

                          <Dropdown.Menu>
                            {Object.entries(orderStatusMaptoString).map(
                              ([key, value]) => (
                                <Dropdown.Item
                                  key={key}
                                  onClick={() =>
                                    handleChangeProductStatus(
                                      Number(key),
                                      item.Id,
                                    )
                                  }
                                >
                                  {value}
                                </Dropdown.Item>
                              ),
                            )}
                          </Dropdown.Menu>
                        </Dropdown>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Change Status
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {Object.entries(orderStatusMaptoString).map(([key, value]) => (
                <Dropdown.Item
                  key={key}
                  onClick={() => handleChangeStatus(Number(key))}
                >
                  {value}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button
            style={{ backgroundColor: COLORS.PRIMARY }}
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </main>
  );
};

const OrderRow = ({
  order,
  item,
  index,
  onClick,
}: {
  order: IOrder;
  item: IOrderItem;
  index: number;
  onClick: () => void;
}) => {
  const { data: product } = useGetProductById(item.ProductId);

  return (
    <tr onClick={onClick} style={{ cursor: "pointer" }}>
      <td>{index + 1}</td>
      <td>{order.Id}</td>
      <td>{product ? product.Name : "Loading..."}</td>
      <td>{order.Address}</td>
      <td>{order.Payment}</td>
      <td>{orderStatusMaptoString[order.Status] || "Unknown Status"}</td>
    </tr>
  );
};

export default AdminOrderTable;
