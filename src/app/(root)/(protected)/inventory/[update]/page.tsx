"use client";

import CldImagePicker from "@/components/common/image-picker";
import { COMMON_ENTITY_STATUS } from "@/constants/common.constants";
import { ProductTypes } from "@/constants/product.constants";
import {
  useGetProductById,
  useUpdateProductById,
} from "@/lib/hooks/products.lib";
import useUserStore from "@/stores/user.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { CldImage } from "next-cloudinary";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { array, InferType, number, object, string } from "yup";

// Validation schema for the form

const tagSchema = string().typeError("Must be a text").required("Required");

const updateProductSchema = object({
  name: string().optional(),
  category: string().oneOf(Object.values(ProductTypes)).optional(),
  price: string().optional(),
  quantity: number().optional(),
  imageUrl: string().url("Must be a valid URL").optional(),
  tags: array().of(tagSchema).optional(),
  status: number()
    .oneOf(Object.values(COMMON_ENTITY_STATUS).map((value) => Number(value)))
    .optional(),
});

type UpdateProductForm = InferType<typeof updateProductSchema>;

const UpdateProductForm = () => {
  const queryClient = useQueryClient();
  const { user } = useUserStore();

  const params = useParams<{ update: string }>();

  const { data: productdata } = useGetProductById(params.update);

  const { mutateAsync: updateProduct, isPending } =
    useUpdateProductById(queryClient);

  const [uploadUrl, setUploadUrl] = useState(productdata?.ImageUrl);

  const form = useForm<UpdateProductForm>({
    resolver: yupResolver(updateProductSchema),
    defaultValues: {
      name: productdata?.Name,
      price: productdata?.Price,
      quantity: productdata?.Quantity,
      imageUrl: productdata?.ImageUrl,
      tags: productdata?.Tags,
      status: productdata?.Status,
    },
  });
  useEffect(() => {
    if (productdata) {
      form.reset({
        name: productdata.Name,
        price: productdata.Price,
        quantity: productdata.Quantity,
        imageUrl: productdata.ImageUrl,
        tags: productdata.Tags,
        status: productdata.Status,
      });
      setUploadUrl(productdata.ImageUrl);
    }
  }, [productdata, form]);

  if (productdata === null)
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <h1>Product not found, please try again</h1>
      </div>
    );

  const onSubmit = async (data: UpdateProductForm) => {
    try {
      if (!user?.Id) {
        toast.error(
          "There was an error validating your accout please try again",
        );
        return;
      }
      console.log("🚀 ~ onSubmit ~ updating product", data);

      let productImageURL = data.imageUrl;

      if (form.formState.dirtyFields.imageUrl) {
        productImageURL = uploadUrl;
      }

      await updateProduct({
        id: params.update,
        data: {
          ...data,
          VendorId: user.Id,
          Id: params.update,
          ImageUrl: productImageURL,
        },
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
        <h2 className="mb-4 text-center">Update Product</h2>

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
              <CldImage
                alt="product-image"
                src={uploadUrl ?? ""}
                width={300}
                height={300}
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  objectFit: "contain",
                  margin: "0 auto",
                  borderRadius: "5px",
                }}
              />

              <Form.Control.Feedback type="invalid">
                {form.formState.errors.imageUrl?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="d-flex justify-content-center align-self-center">
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
            className="d-flex gap-2  align-items-center justify-content-center w-100"
            disabled={isPending}
          >
            {isPending ? <Spinner animation="border" size="sm" /> : null}
            Update
          </Button>
        </Form>
      </div>
    </main>
  );
};

export default UpdateProductForm;
