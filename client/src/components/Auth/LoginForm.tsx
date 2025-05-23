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
import { useLoginMutation } from "@/state/api";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/reduxStoreProvider";
import { setCredentials } from "@/state/authSlice";
import { setAuthToken } from "@/utils/auth";
import { useEffect, useState } from "react";

interface LoginFormValues {
  email: string;
  password: string;
}

const getSubdomain = () => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");

    // Assuming a structure like `sub.example.com`
    if (parts.length > 2) {
      return parts[0]; // First part is the subdomain
    }
  }
  return null;
};

export function LoginForm() {
  const [subdomain, setSubdomain] = useState<string | null>(null);

  useEffect(() => {
    setSubdomain(getSubdomain());
  }, []);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const userData = await login({
        email: data.email,
        password: data.password,
        subDomain: subdomain || null,
      }).unwrap();

      dispatch(setCredentials({ user: userData.user, token: userData.token }));

      toast({
        title: "Login Successful",
        description: "You have been logged in successfully",
        variant: "default",
      });

      await setAuthToken(userData.token);

      router.push("/");
    } catch (err) {
      toast({
        title: "Login Failed",
        description: (err as { message: string }).message || "Unable to login",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
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
                  placeholder="your@email.com"
                  className="text-black"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
