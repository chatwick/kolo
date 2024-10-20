import { ProductTypes } from "@/constants/product.constants";
import React, { useState } from "react";
import { Alert, Button, Container, Form, ListGroup } from "react-bootstrap";

const ManageCategories = () => {
  const [categories, setCategories] = useState<string[]>(
    Object.values(ProductTypes),
  );
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAddCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newCategory.trim() === "") {
      setError("Category name cannot be empty.");
      return;
    }
    if (categories.includes(newCategory)) {
      setError("Category already exists.");
      return;
    }

    setCategories([...categories, newCategory]);
    setNewCategory("");
    setError(null);
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    setCategories(
      categories.filter((category) => category !== categoryToDelete),
    );
  };

  return (
    <Container>
      <h2 className="mb-4">Manage Product Categories</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleAddCategory} className="mb-4">
        <Form.Group controlId="formBasicCategory">
          <Form.Label>Add New Category</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" className="my-2" type="submit">
          Add Category
        </Button>
      </Form>
      <h4>Current Categories</h4>
      <ListGroup>
        {categories.map((category, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between align-items-center"
          >
            {category}
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeleteCategory(category)}
            >
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default ManageCategories;
