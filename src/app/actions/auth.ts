"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { authSchema } from "@/lib/validation/auth";
import { sanitizeRedirectPath } from "@/lib/supabase/redirect";

export interface AuthActionState {
  errors?: {
    email?: string[];
    password?: string[];
    general?: string[];
  };
  values?: {
    email?: string;
  };
  requiresConfirmation?: boolean;
  successMessage?: string;
}

export async function login(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const nextParam = formData.get("next") ? String(formData.get("next")) : undefined;
  const targetPath = sanitizeRedirectPath(nextParam);

  const validation = authSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      values: { email },
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  });

  if (error) {
    return {
      errors: {
        general: ["Invalid email or password"],
      },
      values: { email },
    };
  }

  revalidatePath("/", "layout");
  redirect(targetPath);
}

export async function signup(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const nextParam = formData.get("next") ? String(formData.get("next")) : undefined;
  const targetPath = sanitizeRedirectPath(nextParam);

  const validation = authSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      values: { email },
    };
  }

  const headerList = await headers();
  const host = headerList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const origin = `${protocol}://${host}`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(targetPath)}`,
    },
  });

  if (error) {
    return {
      errors: {
        general: ["Unable to create account. Please check your information and try again."],
      },
      values: { email },
    };
  }

  // If email confirmation is enabled, user exists but session is null
  if (data.user && !data.session) {
    return {
      requiresConfirmation: true,
      values: { email },
      successMessage: "Please check your email to confirm your account before logging in.",
    };
  }

  // If email confirmation is off, user is logged in immediately
  revalidatePath("/", "layout");
  redirect(targetPath);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
