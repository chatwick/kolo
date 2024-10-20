import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#343a40",
        color: "white",
        padding: "1.5rem 0",
        position: "fixed",
        bottom: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <Container>
        <Row>
          <Col md={3}>
            <h5>About</h5>
            <p className="text-sm-start ">
              We are committed to providing quality service and ensuring
              customer satisfaction.
            </p>
          </Col>
          <Col md={3}>
            <h5>Quick Links</h5>
            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/">About</Link>
              </li>
              <li>
                <Link href="/">Support</Link>
              </li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>Contact</h5>
            <p>
              Email: info.kolo@gmail.com <br />
              Phone: +123 456 7890
            </p>
          </Col>
          <Col md={3} className="text-center align-self-center ">
            <p>&copy; {new Date().getFullYear()} Kolo. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
