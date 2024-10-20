import { IUser } from "@/interfaces/user.interface";
import { Container, Spinner, Table } from "react-bootstrap";

type Props = {
  users: IUser[];
  isFetching: boolean;
  isError: boolean;
};

const CSRTable = ({ isError, isFetching, users }: Props) => {
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
  return (
    <Container>
      <h2 className="mb-4 text-center">
        Customer service representaative List
      </h2>
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
              <td>{user.Status === 1 ? "Active" : "Inactive"}</td>
              <td>{new Date(user.CreatedAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CSRTable;
