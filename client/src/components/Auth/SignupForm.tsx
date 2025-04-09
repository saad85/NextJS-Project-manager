"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useRegisterMutation } from "@/state/api";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/reduxStoreProvider";
import { setCredentials } from "@/state/authSlice";

interface SignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  subDomain: string;
  password: string;
  confirmPassword: string;
  organizationName: string;
}

export function SignupForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<SignupFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      subDomain: "",
      organizationName: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      const userData = await register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        subDomain: data.subDomain,
        organizationName: data.organizationName,
      }).unwrap();

      dispatch(setCredentials({ user: userData.user, token: userData.token }));

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully",
        variant: "default",
      });

      router.push("/dashboard");
    } catch (err: any) {
      const errorMessage = err.data?.message || "Registration failed";

      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });

      if (err.data?.errors) {
        Object.entries(err.data.errors).forEach(([field, message]) => {
          form.setError(field as keyof SignupFormValues, {
            type: "server",
            message: message as string,
          });
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
        {/* First Name */}
        <FormField
          control={form.control}
          name="firstName"
          rules={{
            required: "First name is required",
            minLength: {
              value: 2,
              message: "First name must be at least 2 characters",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-black">
                First Name
              </FormLabel>
              <FormControl>
                <Input
                  className="text-black"
                  placeholder="Your first name"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Last Name */}
        <FormField
          control={form.control}
          name="lastName"
          rules={{
            required: "Last name is required",
            minLength: {
              value: 2,
              message: "Last name must be at least 2 characters",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-black">
                Last Name
              </FormLabel>
              <FormControl>
                <Input
                  className="text-black"
                  placeholder="Your last name"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-black">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  className="text-black"
                  placeholder="your@email.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-black">
                Password
              </FormLabel>
              <FormControl>
                <Input
                  className="text-black"
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          rules={{
            required: "Please confirm your password",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-black">
                Confirm Password
              </FormLabel>
              <FormControl>
                <Input
                  className="text-black"
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sub Domain */}
        <FormField
          control={form.control}
          name="subDomain"
          rules={{
            required: "Sub domain is required",
            minLength: {
              value: 2,
              message: "Sub domain must be at least 2 characters",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-black">
                Sub Domain
              </FormLabel>
              <FormControl>
                <Input
                  className="text-black"
                  placeholder="Enter a Sub domain"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Organization Name */}
        <FormField
          control={form.control}
          name="organizationName"
          rules={{
            required: "Organization name is required",
            minLength: {
              value: 3,
              message: "Organization name must be at least 3 characters",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-black">
                Organization Name
              </FormLabel>
              <FormControl>
                <Input
                  className="text-black"
                  placeholder="Enter an Organization name"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
