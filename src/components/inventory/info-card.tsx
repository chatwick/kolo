import { IInventoryComment } from "@/interfaces/inventory.interface";
import { Button, Modal } from "react-bootstrap";

type Props = {
  show: boolean;
  handleClose: () => void;
  rank: {
    rating: number;
    count: number;
    comments: IInventoryComment[];
  };
};

const RankModal = ({ show, handleClose, rank }: Props) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Inventory Rank & Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>Rating: {rank.rating}</h5>
        <p>Count: {rank.count}</p>

        <h6>Comments:</h6>
        <ul>
          {rank.comments.length > 0 ? (
            rank.comments.map((comment, index) => (
              <li key={index}>
                <strong>User {comment.email}:</strong> {comment.comment}
              </li>
            ))
          ) : (
            <p>No comments available.</p>
          )}
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RankModal;
