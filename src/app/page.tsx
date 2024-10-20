"use client";

import Footer from "@/components/common/footer";
import { COLORS } from "@/constants/common.constants";
import { WEB_USER_ROLES } from "@/constants/user.constants";
import useUserStore from "@/stores/user.store";
import Link from "next/link";
import { Button, Card, Col, Container, Row } from "react-bootstrap";

const HomePage = () => {
  const { user } = useUserStore();
  console.log("🚀 ~ HomePage ~ current user:", user);

  const getUserRoleLinks = () => {
    if (!user)
      return (
        <Col md={4}>
          <Card className="mb-4 text-center">
            <Card.Body>
              <h5>Admin Dashboard</h5>
              <Link href="/admin" passHref>
                <Button variant="primary">Go to Admin</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      );

    switch (user.Role) {
      case WEB_USER_ROLES.Admin:
        return (
          <>
            <Col md={4}>
              <Card className="mb-4 text-center">
                <Card.Body>
                  <h5>Admin Dashboard</h5>
                  <Link href="/admin" passHref>
                    <Button variant="primary">Go to Admin</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </>
        );
      case WEB_USER_ROLES.Vendor:
        return (
          <>
            <Col md={4} className="">
              <Card className="mb-4 text-center">
                <Card.Body>
                  <h5>Orders</h5>
                  <Link href="/orders" passHref>
                    <Button variant="primary">Go to Orders</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4 text-center">
                <Card.Body>
                  <h5>Inventory</h5>
                  <Link href="/inventory" passHref>
                    <Button variant="primary">Go to Inventory</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          </>
        );
      case WEB_USER_ROLES.CSR:
        return (
          <Col md={4}>
            <Card className="mb-4 text-center">
              <Card.Body>
                <h5>Customer Service</h5>
                <Link href="/admin" passHref>
                  <Button variant="primary">Go to CSR</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Container fluid className="px-4">
        <section
          className={`text-center py-5 `}
          style={{ backgroundColor: "#f8f9fa" }}
        >
          <h1>Welcome to Kolo</h1>
          <p className="lead">
            Your trusted eCommerce dashboard for managing everything.
          </p>
        </section>

        <section
          className=" p-5 align-items-center justify-content-center "
          style={{ backgroundColor: COLORS.PRIMARY }}
        >
          <h2 className="mb-4 text-center text-white ">Quick Links</h2>
          <Row>{getUserRoleLinks()}</Row>
        </section>
      </Container>
      <Footer />
    </>
  );
};

export default HomePage;
