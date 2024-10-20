"use client";

import RankModal from "@/components/inventory/info-card";
import ProductCard from "@/components/products/product-card";
import { IProduct } from "@/interfaces/product.interface";
import { useGetUserInventory } from "@/lib/hooks/inventory.lib";
import { useGetProducts } from "@/lib/hooks/products.lib";
import useUserStore from "@/stores/user.store";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Container, Form, FormControl, Spinner } from "react-bootstrap";

const Inventory = () => {
  const { data, isPending } = useGetProducts();

  const { user } = useUserStore();
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  console.log("🚀 ~ Products ~ data:", data);
  const { data: userInv } = useGetUserInventory(user?.Id ?? "");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (data) {
      const userProducts = data.filter(
        (product) => product.VendorId === user?.Id,
      );

      // Apply search filter
      const searchFiltered = userProducts.filter((product) =>
        product.Name.toLowerCase().includes(searchQuery.toLowerCase()),
      );

      setFilteredProducts(searchFiltered);
    }
  }, [data, user?.Id, searchQuery]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isPending) {
    return (
      <Container className=" d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }
  if (!data) {
    return (
      <Container className=" d-flex justify-content-center align-items-center min-vh-100">
        <div>No products found. Please add products to your inventory</div>
      </Container>
    );
  }

  return (
    <Container>
      <RankModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        rank={{
          rating: userInv?.rank.rating ?? 0,
          count: userInv?.rank.count ?? 0,
          comments: userInv?.rank.comments ?? [],
        }}
      />
      <div className="d-flex justify-content-between align-items-baseline w-100">
        <h2 className="pt-5">My Products</h2>
        <Form className="mb-3">
          <div className="d-flex gap-2 justify-content-between align-items-baseline w-100">
            <FormControl
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={handleSearchChange}
              className="mr-sm-2 "
            />
          </div>
        </Form>
        <div className="">
          <Link href="/inventory/add">
            <Button className="my-3">Add Product</Button>
          </Link>
          <Button
            variant="info"
            className="mx-1"
            onClick={() => setShowModal(true)}
          >
            Info
          </Button>
        </div>
      </div>
      <div className="d-flex flex-wrap justify-content-start gap-5 my-5">
        {filteredProducts.map((product) => (
          <ProductCard product={product} key={product.Id} />
        ))}
      </div>
    </Container>
  );
};
export default Inventory;
