"use client";

import CommonConfirmModal from "@/components/common/confirmation-modal";
import OrderRow from "@/components/orders/order-row";
import { COLORS } from "@/constants/common.constants";
import { OrderStatusEnum } from "@/constants/order.constants";
import { IOrder, IOrderItem } from "@/interfaces/order.interface";
import {
  useGetOrdersByVendorId,
  useUpdateOrderProductStatus,
} from "@/lib/hooks/order.lib";
import useUserStore from "@/stores/user.store";
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
import toast from "react-hot-toast";

// fetches the collection of orders from the server
// uses the useGetOrders hook to fetch the orders
// renders the orders in a grid layout
const GetOrders = () => {
  const queryClient = useQueryClient();

  const { user } = useUserStore();

  const {
    data: orders,
    isFetching,
    refetch,
  } = useGetOrdersByVendorId(user?.Id ?? "");

  // const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusEnum | null>(
    null,
  );
  const [selectedOrderProduct, setSelectedOrderProduct] = useState<string>();
  // const [loadingProducts, setLoadingProducts] = useState<boolean>(false);

  // const { mutateAsync: updateOrderStatus } = useUpdateOrderStatus(queryClient);
  const { mutateAsync: updateOrderProductStatus } =
    useUpdateOrderProductStatus(queryClient);

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

  const handleChangeStatus = (status: OrderStatusEnum, productId: string) => {
    if (
      selectedOrder &&
      ![OrderStatusEnum.Processing, OrderStatusEnum.Dispatched].includes(
        selectedOrder.Status,
      )
    ) {
      toast.error(
        "You can only change the status of orders that are Processing or Dispatched.",
        {
          duration: 3000,
        },
      );
      return;
    }

    setSelectedStatus(status);
    setSelectedOrderProduct(productId);
    setShowConfirmation(true);
  };

  // Function to handle the status update after confirmation
  const handleConfirmChangeStatus = async () => {
    if (selectedOrder && selectedStatus !== null && selectedOrderProduct) {
      // await updateOrderStatus({
      //   orderId: selectedOrder.Id,
      //   status: selectedStatus,
      //   order: selectedOrder,
      // });

      await updateOrderProductStatus({
        orderId: selectedOrder.Id,
        status: selectedStatus,
        itemId: selectedOrderProduct,
      });
      setShowConfirmation(false);
      setShowModal(false);
      refetch();
    }
  };

  return (
    <main className=" px-5 mt-5">
      <h2 className="mb-4 text-center">Orders</h2>
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
                                    handleChangeStatus(Number(key), item.Id)
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

export default GetOrders;
