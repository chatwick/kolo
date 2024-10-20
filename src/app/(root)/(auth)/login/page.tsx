/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useLoginUser } from "@/lib/hooks/auth.lib";
import useAuthStore from "@/stores/auth.store";
import useUserStore from "@/stores/user.store";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Form, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { InferType, object, string } from "yup";

const loginUserSchema = object({
  email: string().email().required("Email is required"),
  password: string().required("Password is required"),
});

type LoginUserForm = InferType<typeof loginUserSchema>;

// Login component
const Login = () => {
  const queryClient = useQueryClient();

  // login user hook
  const { mutateAsync: loginUser, isPending } = useLoginUser(queryClient);

  const { setToken } = useAuthStore();
  const { setUser } = useUserStore();

  const router = useRouter();

  const form = useForm<LoginUserForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // calls loginuser function asynchronously
  const onSubmit = async (data: LoginUserForm) => {
    try {
      const res = await loginUser(data);
      if (res?.user && res?.token) {
        setToken(res.token);
        setUser(res.user);
        router.push("/");
      } else {
        toast.error("Invalid email or password, please try again");
      }
    } catch (error) {
      console.error("🚀 ~ onSubmit ~ error", error);
      toast.error("Invalid account credentials, please try again");
    }
  };

  return (
    <div>
      <div className="d-flex  align-items-center justify-content-around min-vh-100 ">
        <div className="d-flex text-center flex-column ">
          <Image src="/loginsvg.svg" alt="logo" width={350} height={350} />
        </div>
        <div className="w-25 border border-2 p-5">
          <Form className="" onSubmit={form.handleSubmit(onSubmit)}>
            <h2 className="mb-4 text-center">Log In</h2>
            <Form.Group className="mb-3" controlId="formFirstName">
              <Form.Label>Email</Form.Label>
              <Controller
                control={form.control}
                name="email"
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    placeholder="Account email"
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
                    placeholder="Account password"
                    {...field}
                    isInvalid={!!form.formState.errors.password}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {form.formState.errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              disabled={isPending}
              variant="primary"
              type="submit"
              className="d-flex gap-2  align-items-center justify-content-center w-100"
            >
              {isPending ? <Spinner animation="border" size="sm" /> : null}
              Login
            </Button>
          </Form>

          <p className=" text-center pt-5 ">
            Don&apos;t have an account?&nbsp;
            <Link
              href="/signup"
              className=" text-decoration-underline text-primary "
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
