"use client";

import { USER_STATUS } from "@/constants/user.constants";
import { IUser } from "@/interfaces/user.interface";
import { useUpdateUserStatus } from "@/lib/hooks/user.lib";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Container, Dropdown, Spinner, Table } from "react-bootstrap";
import ConfirmationModal from "./user-status-change-modal";

type Props = {
  users: IUser[];
  isFetching: boolean;
  isError: boolean;
};

const UsersTable = ({ isError, isFetching, users }: Props) => {
  const queryClient = useQueryClient();
  const { mutateAsync: updateStatus } = useUpdateUserStatus(queryClient);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [newStatus, setNewStatus] = useState<USER_STATUS | null>(null);

  if (isFetching) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (isError) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        Error fetching users.
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        No users found.
      </div>
    );
  }

  const handleShowModal = (
    userId: string,
    userName: string,
    status: USER_STATUS,
  ) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setNewStatus(status);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUserId(null);
    setSelectedUserName("");
    setNewStatus(null);
  };

  const handleConfirm = async () => {
    if (selectedUserId && newStatus !== null) {
      await updateStatus({ status: newStatus, userId: selectedUserId });
      handleCloseModal(); // Close the modal after confirming
    }
  };

  return (
    <Container>
      <h2 className="mb-4 text-center">User List</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: IUser, index: number) => (
            <tr key={user.Id}>
              <td>{index + 1}</td>
              <td>{user.FirstName}</td>
              <td>{user.LastName}</td>
              <td>{user.Email}</td>
              <td>{user.Role ?? "User"}</td>
              <td
                className={
                  user.Status === USER_STATUS.ENABLED
                    ? "text-success"
                    : "text-danger"
                }
              >
                {user.Status === USER_STATUS.ENABLED ? "Active" : "Inactive"}
              </td>
              <td>{new Date(user.CreatedAt).toLocaleDateString()}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    Change Status
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() =>
                        handleShowModal(
                          user.Id,
                          user.FirstName,
                          USER_STATUS.ENABLED,
                        )
                      }
                      disabled={user.Status === USER_STATUS.ENABLED}
                    >
                      Activate
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        handleShowModal(
                          user.Id,
                          user.FirstName,
                          USER_STATUS.DISABLED,
                        )
                      }
                      disabled={user.Status === USER_STATUS.DISABLED}
                    >
                      Deactivate
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ConfirmationModal
        show={showModal}
        onHide={handleCloseModal}
        onConfirm={handleConfirm}
        userName={selectedUserName}
      />
    </Container>
  );
};

export default UsersTable;
