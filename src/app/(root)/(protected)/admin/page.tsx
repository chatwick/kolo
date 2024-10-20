"use client";

import AdminOrderTable from "@/components/admin/admin-order-table";
import AdminTable from "@/components/admin/admin-table";
import ManageCategories from "@/components/admin/category-update-";
import CSRTable from "@/components/admin/csr-table";
import UsersTable from "@/components/admin/users-table";
import VendorsTable from "@/components/admin/vendors-table";
import { USER_ROLES } from "@/constants/user.constants";
import { IUser } from "@/interfaces/user.interface";
import { useGetAllUsers } from "@/lib/hooks/user.lib";
import useUserStore from "@/stores/user.store";
import { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";

const AdminCSR = () => {
  const [key, setKey] = useState("orders");
  const { data: users, isFetching, isError } = useGetAllUsers();

  const { user } = useUserStore();

  const vendors = users?.filter(
    (user: IUser) => user.Role === USER_ROLES.Vendor,
  );
  const csrs = users?.filter((user: IUser) => user.Role === USER_ROLES.CSR);
  const admins = users?.filter((user: IUser) => user.Role === USER_ROLES.Admin);
  const normalUsers = users?.filter(
    (user: IUser) => user.Role === USER_ROLES.User,
  );

  return (
    <Tabs
      id="controlled-tab-example"
      activeKey={key}
      onSelect={(k) => setKey(k || "")}
      className="mb-3"
    >
      <Tab eventKey="orders" title="Orders">
        <AdminOrderTable />
      </Tab>

      {user?.Role === USER_ROLES.Admin && (
        <Tab eventKey="vendors" title="Vendors">
          <VendorsTable
            users={vendors || []}
            isFetching={isFetching}
            isError={isError}
          />
        </Tab>
      )}
      {user?.Role === USER_ROLES.Admin && (
        <Tab eventKey="users" title="Users">
          <UsersTable
            users={normalUsers || []}
            isFetching={isFetching}
            isError={isError}
          />
        </Tab>
      )}

      {user?.Role === USER_ROLES.Admin && (
        <Tab eventKey="csr" title="Csr">
          <CSRTable
            users={csrs || []}
            isFetching={isFetching}
            isError={isError}
          />
        </Tab>
      )}
      {user?.Role === USER_ROLES.Admin && (
        <Tab eventKey="admin" title="Admins">
          <AdminTable
            users={admins || []}
            isFetching={isFetching}
            isError={isError}
          />
        </Tab>
      )}
      {user?.Role === USER_ROLES.Admin && (
        <Tab eventKey="category" title="Product Types">
          <ManageCategories />
        </Tab>
      )}
    </Tabs>
  );
};

export default AdminCSR;
