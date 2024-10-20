"use client";

import CldImagePicker from "@/components/common/image-picker";
import { COMMON_ENTITY_STATUS } from "@/constants/common.constants";
import { ProductTypes } from "@/constants/product.constants";
import { useCreateProduct } from "@/lib/hooks/products.lib";
import useUserStore from "@/stores/user.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { array, InferType, number, object, string } from "yup";

// Validation schema for the form

const tagSchema = string().typeError("Must be a text").required("Required");

const createProductSchema = object({
  name: string().required("Name is required"),
  category: string()
    .oneOf(Object.values(ProductTypes))
    .required("Category is required"),
  price: string().required("Price is required"),
  quantity: number().required("Quantity is required").min(1, "Minimum 1"),
  imageUrl: string()
    .url("Must be a valid URL")
    .required("Image URL is required"),
  tags: array().of(tagSchema),
  status: number()
    .oneOf(Object.values(COMMON_ENTITY_STATUS).map((value) => Number(value)))
    .required("Status is required"),
});

type CreateProductForm = InferType<typeof createProductSchema>;

const AddProductForm = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: createProductMutation, isPending } =
    useCreateProduct(queryClient);

  const { user } = useUserStore();
  console.log("🚀 ~ AddProductForm ~ user:", user);

  const [uploadUrl, setUploadUrl] = useState<string>();

  const form = useForm<CreateProductForm>({
    resolver: yupResolver(createProductSchema),
    defaultValues: {
      name: "",
      price: "",
      quantity: 1,
      imageUrl: "",
      tags: [],
      status: COMMON_ENTITY_STATUS.ENABLED,
    },
  });

  const onSubmit = async (data: CreateProductForm) => {
    try {
      if (!user?.Id) {
        toast.error(
          "There was an error validating your accout please try again",
        );
        return;
      }
      console.log("🚀 ~ onSubmit ~ uploadin to user", user.Id);

      await createProductMutation({
        ...data,
        vendorId: user.Id,
      });

      // await updateInventory({
      //   ownerId: user.Id,
      //   status: COMMON_ENTITY_STATUS.ENABLED,
      //   products: [],
      //   rank: { rating: 0, count: 0, comments: [] },
      //   maxQuantity: 9999,
      // });

      form.reset();
    } catch (error) {
      console.error("Error creating product: ", error);
    }
  };

  const handleImageUpload = (url: string) => {
    setUploadUrl(url);
    form.setValue("imageUrl", url);
  };
  console.log("form errors", form.formState.errors);

  return (
    <main className="d-flex align-items-center justify-content-center py-3  ">
      <div className="w-25 border border-2 p-5  ">
        <h2 className="mb-4 text-center">Add Product</h2>

        <Form onSubmit={form.handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => (
                <Form.Control
                  {...field}
                  isInvalid={!!form.formState.errors.name}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {form.formState.errors.name?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRole">
            <Form.Label>Product category</Form.Label>
            <Controller
              control={form.control}
              name="category"
              render={({ field }) => (
                <Form.Select
                  {...field}
                  aria-label="Default select example"
                  isInvalid={!!form.formState.errors.category}
                  defaultChecked={false}
                >
                  <option>Category</option>
                  {Object.values(ProductTypes).map((role) => (
                    <option value={role} key={role}>
                      {role}
                    </option>
                  ))}
                </Form.Select>
              )}
            />
            <Form.Control.Feedback type="invalid">
              {form.formState.errors.category?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Controller
              name="price"
              control={form.control}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  min={0}
                  step="0.1"
                  max={5000000}
                  {...field}
                  isInvalid={!!form.formState.errors.price}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {form.formState.errors.price?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Controller
              name="quantity"
              control={form.control}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  min={0}
                  max={9999}
                  {...field}
                  isInvalid={!!form.formState.errors.quantity}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {form.formState.errors.quantity?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center">
            <Form.Group className="my-3">
              <Form.Label>Product Image</Form.Label>

              <Form.Control.Feedback type="invalid">
                {form.formState.errors.imageUrl?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <CldImagePicker setUrl={handleImageUpload} url={uploadUrl ?? ""} />
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Controller
              name="status"
              control={form.control}
              render={({ field }) => (
                <Form.Control
                  as="select"
                  {...field}
                  isInvalid={!!form.formState.errors.status}
                >
                  <option value={1}>Active</option>
                  <option value={0}>Inactive</option>
                </Form.Control>
              )}
            />
            <Form.Control.Feedback type="invalid">
              {form.formState.errors.status?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="d-flex gap-2  align-items-center justify-content-center "
            disabled={isPending}
          >
            {isPending ? <Spinner animation="border" size="sm" /> : null}
            Create Product
          </Button>
        </Form>
      </div>
    </main>
  );
};

export default AddProductForm;
