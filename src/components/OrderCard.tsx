import { Button, Card } from "react-bootstrap";

type OrderCardProps = {
  order: {
    id: string;
    title: string;
    date: string;
    total: number;
    status: string;
  };
};

const OrderCard = ({ order }: OrderCardProps) => {
  return (
    <Card className="border-light shadow-sm">
      <Card.Body>
        <Card.Title>{order.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{order.date}</Card.Subtitle>
        <Card.Text>Total: ${order.total.toFixed(2)}</Card.Text>
        <Card.Text>Status: {order.status}</Card.Text>
        <Button variant="primary">View Details</Button>
      </Card.Body>
    </Card>
  );
};

export default OrderCard;
