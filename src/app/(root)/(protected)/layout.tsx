"use client";

import NavbarComponent from "@/components/common/navbar";
import { WEB_USER_ROLES } from "@/constants/user.constants";
import useUserStore from "@/stores/user.store";
import { redirect, usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";

const ProtectedRouteLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  // className="px-4 py-4 h-screen"

  const { user, isLoading } = useUserStore();
  const path = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (user === null) {
        redirect("/login");
      }
    }
  }, [user]);

  useEffect(() => {
    if (path.startsWith("/admin") && user?.Role === WEB_USER_ROLES.Vendor) {
      toast.error("You are not authorized to access this page", {
        duration: 5000,
      });
      redirect("/");
    }
  }, [user, path]);

  if (isLoading) {
    return (
      <Container className=" d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <div>
      <NavbarComponent />
      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default ProtectedRouteLayout;
