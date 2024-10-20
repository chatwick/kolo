"use client";

import { COMMON_ENTITY_STATUS } from "@/constants/common.constants";
import { WEB_USER_ROLES } from "@/constants/user.constants";
import { useCreateUser } from "@/lib/hooks/auth.lib";
import { useCreateInventory } from "@/lib/hooks/inventory.lib";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Form, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { InferType, object, string } from "yup";

// Create user schema
const createUserSchema = object({
  firstName: string().required("First name is required"),
  lastName: string().required("Last name is required"),
  email: string().email().required("Email is required"),
  password: string().required("Password is required"),
  role: string()
    .oneOf(Object.values(WEB_USER_ROLES))
    .required("Role is required"),
});

type CreateUserForm = InferType<typeof createUserSchema>;

// Signup component
const Signup = () => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const { mutateAsync: createUser, isPending } = useCreateUser(queryClient);
  const { mutateAsync: createInventory } = useCreateInventory(queryClient);

  // Form hook initialization
  const form = useForm<CreateUserForm>({
    resolver: yupResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: WEB_USER_ROLES.Admin,
    },
  });

  // Form submit. Calls the createUser function asynchronously
  const onSubmit = async (data: CreateUserForm) => {
    try {
      console.log("🚀 ~ onSubmit ~ data:", data);
      const res = await createUser(data);
      if (
        (res.user && res.user.Role === WEB_USER_ROLES.Vendor) ||
        res.user.Role === WEB_USER_ROLES.Admin
      ) {
        await createInventory({
          ownerId: res.user.Id,
          status: COMMON_ENTITY_STATUS.ENABLED,
          products: [],
          rank: { rating: 0, count: 0, comments: [] },
          maxQuantity: 9999,
        });
      }

      router.push("/login");
    } catch (error) {
      console.error("🚀 ~ onSubmit ~ error", error);
    }
  };

  return (
    <main className="d-flex  align-items-center justify-content-around min-vh-100 ">
      <div className="d-flex text-center flex-column ">
        <Image src="/signup2.svg" alt="logo" width={350} height={350} />
      </div>
      <div className="w-25 border border-2 p-5">
        <Form className="" onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="mb-4 text-center">Sign Up</h2>

          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Controller
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <Form.Control
                  type="text"
                  placeholder="Enter your first name"
                  {...field}
                  isInvalid={!!form.formState.errors.firstName}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {form.formState.errors.firstName?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Controller
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <Form.Control
                  type="text"
                  placeholder="Enter your last name"
                  {...field}
                  isInvalid={!!form.formState.errors.lastName}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {form.formState.errors.lastName?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email address</Form.Label>

            <Controller
              control={form.control}
              name="email"
              render={({ field }) => (
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                  isInvalid={!!form.formState.errors.email}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {form.formState.errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Password</Form.Label>

            <Controller
              control={form.control}
              name="password"
              render={({ field }) => (
                <Form.Control
                  type="password"
                  placeholder="Enter a password"
                  {...field}
                  isInvalid={!!form.formState.errors.password}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {form.formState.errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRole">
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Form.Select
                  {...field}
                  aria-label="Default select example"
                  isInvalid={!!form.formState.errors.role}
                  defaultChecked={false}
                >
                  {Object.values(WEB_USER_ROLES).map((role) => (
                    <option value={role} key={role}>
                      {role}
                    </option>
                  ))}
                </Form.Select>
              )}
            />
            <Form.Control.Feedback type="invalid">
              {form.formState.errors.role?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            variant="primary"
            disabled={isPending}
            type="submit"
            className="d-flex gap-2  align-items-center justify-content-center w-100"
          >
            {isPending ? <Spinner animation="border" size="sm" /> : null}
            Sign Up
          </Button>
        </Form>
        <p className=" text-center pt-5 ">
          Already an account?&nbsp;
          <Link
            href="/login"
            className=" text-decoration-underline text-primary "
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Signup;
