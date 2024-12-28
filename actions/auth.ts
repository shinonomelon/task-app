// actions/authActions.ts
"use server";

import { handleAuth } from "@/lib/auth";

export async function signIn(formData: FormData) {
  await handleAuth(formData, "signIn");
}

export async function signUp(formData: FormData) {
  await handleAuth(formData, "signUp");
}
