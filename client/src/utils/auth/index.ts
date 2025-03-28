"use server";
import { cookies } from "next/headers";

export async function getAuthToken() {
  return cookies().get("auth-token")?.value || null;
}

export async function setAuthToken(token: string) {
  return cookies().set("auth-token", token);
}

export async function removeAuthToken() {
  return cookies().delete("auth-token");
}
