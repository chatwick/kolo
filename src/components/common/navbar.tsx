"use client";

import { COLORS } from "@/constants/common.constants";
import { USER_ROLES } from "@/constants/user.constants";
import useAuthStore from "@/stores/auth.store";
import useUserStore from "@/stores/user.store";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

const NavbarComponent = () => {
  const { user, clearUser } = useUserStore();
  const { clearToken } = useAuthStore();

  const handleSignout = () => {
    clearUser();
    clearToken();
  };

  return (
    <Navbar expand="lg" data-bs-theme="light" className="px-4 border-bottom">
      <Navbar.Brand href="/">Kolo</Navbar.Brand>
      <Container>
        <Nav className="mx-auto">
          <Nav.Link
            href="/"
            onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.PRIMARY)}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = COLORS.NEUTRAL_GRAY)
            }
          >
            Home
          </Nav.Link>
          {user?.Role === USER_ROLES.Vendor ? (
            <>
              <Nav.Link
                href="/orders"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = COLORS.PRIMARY)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = COLORS.NEUTRAL_GRAY)
                }
              >
                Orders
              </Nav.Link>
              <Nav.Link
                href="/inventory"
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = COLORS.PRIMARY)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = COLORS.NEUTRAL_GRAY)
                }
              >
                Inventory
              </Nav.Link>
            </>
          ) : null}
          {user?.Role === USER_ROLES.CSR || user?.Role === USER_ROLES.Admin ? (
            <Nav.Link
              href="/admin"
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = COLORS.PRIMARY)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = COLORS.NEUTRAL_GRAY)
              }
            >
              Dashboard
            </Nav.Link>
          ) : null}
        </Nav>
      </Container>
      <NavDropdown
        title={
          <div className=" pe-auto  ">
            <img
              src={`https://api.dicebear.com/8.x/identicon/svg?seed=${user?.FirstName}`}
              alt="Avatar"
              style={{ borderRadius: "50%", width: "40px", height: "40px" }}
            />
          </div>
        }
        id="basic-nav-dropdown"
        align="end"
      >
        <NavDropdown.Item href="/profile">Account</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={handleSignout}>Signout</NavDropdown.Item>
      </NavDropdown>
    </Navbar>
  );
};

export default NavbarComponent;
