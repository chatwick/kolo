"use client";

import { USER_STATUS } from "@/constants/user.constants";
import { useGetUserData, useUpdateUserProfile } from "@/lib/hooks/user.lib";
import useUserStore from "@/stores/user.store";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { InferType, number, object, string } from "yup";

const updateUserSchema = object({
  FirstName: string()
    .min(2, "FirstName is must have more than 2 characters")
    .max(255, "FirstName must be less than 255 characters")
    .optional(),
  LastName: string()
    .min(2, "LastName is must have more than 2 characters")
    .max(255, "LastName must be less than 255 characters")
    .optional(),
  Email: string().email("Invalid email format").optional(),
  Password: string().optional(),
  Status: number()
    .oneOf(Object.values(USER_STATUS).map((value) => Number(value)))
    .optional(),
});

type UpdateUserForm = InferType<typeof updateUserSchema>;

const Profile = () => {
  const { user, clearUser, setUser } = useUserStore();
  const queryClient = useQueryClient();

  const { mutateAsync: updateProfile, isPending } =
    useUpdateUserProfile(queryClient);

  const { data: fetchedUserData, isFetching } = useGetUserData(user?.Id ?? "");
  console.log("🚀 ~ Profile ~ fetchedUserData:", fetchedUserData);

  const form = useForm<UpdateUserForm>({
    resolver: yupResolver(updateUserSchema),
    defaultValues: {
      FirstName: fetchedUserData?.FirstName,
      LastName: fetchedUserData?.LastName,
      Email: fetchedUserData?.Email,
      Password: "",
      Status: fetchedUserData?.Status,
    },
  });

  useEffect(() => {
    if (fetchedUserData) {
      form.reset({
        FirstName: fetchedUserData.FirstName,
        LastName: fetchedUserData.LastName,
        Email: fetchedUserData.Email,
        Password: "",
        Status: fetchedUserData.Status,
      });
    }
  }, [fetchedUserData, form]);

  if (!fetchedUserData) {
    return (
      <Container className=" d-flex justify-content-center align-items-center min-vh-100">
        <div>Loading...</div>
      </Container>
    );
  }

  const onSubmit = async (data: UpdateUserForm) => {
    try {
      console.log("Form Data", data);

      const filteredData = { ...data };

      if (!form.formState.dirtyFields.Password) {
        delete filteredData.Password;
      }

      const res = await updateProfile({
        id: fetchedUserData.Id,
        data: { ...fetchedUserData, ...filteredData },
      });
      if (res) {
        clearUser();
        if (!isFetching && fetchedUserData) {
          setUser(fetchedUserData);
        }
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <Container>
      <main className="d-flex align-items-center justify-content-center py-3  ">
        <div className="w-50 border border-2 p-5  ">
          <h2>Update Profile</h2>
          <Form onSubmit={form.handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Controller
                name="FirstName"
                control={form.control}
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    {...field}
                    // defaultValue={user?.FirstName}
                    isInvalid={!!form.formState.errors.FirstName}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {form.formState.errors.FirstName?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Controller
                name="LastName"
                control={form.control}
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    {...field}
                    // defaultValue={user?.LastName}
                    isInvalid={!!form.formState.errors.LastName}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {form.formState.errors.LastName?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Controller
                name="Email"
                control={form.control}
                render={({ field }) => (
                  <Form.Control
                    type="email"
                    // defaultValue={user?.Email}
                    {...field}
                    isInvalid={!!form.formState.errors.Email}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {form.formState.errors.Email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Controller
                name="Password"
                control={form.control}
                render={({ field }) => (
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    {...field}
                    isInvalid={!!form.formState.errors.Password}
                  />
                )}
              />
              <Form.Control.Feedback type="invalid">
                {form.formState.errors.Password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Controller
                name="Status"
                control={form.control}
                render={({ field }) => (
                  <Form.Control
                    as="select"
                    {...field}
                    // defaultValue={user?.Status}
                    isInvalid={!!form.formState.errors.Status}
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </Form.Control>
                )}
              />
              <Form.Control.Feedback type="invalid">
                {form.formState.errors.Status?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={isPending}
              className="d-flex gap-2 w-100  align-items-center justify-content-center "
            >
              {isPending ? <Spinner animation="border" size="sm" /> : null}
              Update Profile
            </Button>
          </Form>
        </div>
      </main>
    </Container>
  );
};

export default Profile;
