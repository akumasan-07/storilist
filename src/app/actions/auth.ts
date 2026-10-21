"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validation/auth";
import { sanitizeRedirectPath } from "@/lib/supabase/redirect";

export interface AuthActionState {
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    general?: string[];
  };
  values?: {
    username?: string;
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

  const validation = loginSchema.safeParse({ email, password });
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
  const username = String(formData.get("username") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const nextParam = formData.get("next") ? String(formData.get("next")) : undefined;
  const targetPath = sanitizeRedirectPath(nextParam);

  const validation = signupSchema.safeParse({ username, email, password });
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      values: { username, email },
    };
  }

  const supabase = await createClient();

  // Check username availability via security-definer RPC function
  const { data: isAvailable, error: rpcError } = await supabase.rpc(
    "is_username_available",
    { name: validation.data.username }
  );

  if (rpcError || !isAvailable) {
    return {
      errors: {
        username: ["Username is already taken"],
      },
      values: { username, email },
    };
  }

  const headerList = await headers();
  const host = headerList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const origin = `${protocol}://${host}`;

  const { data, error } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
    options: {
      data: {
        username: validation.data.username,
      },
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(targetPath)}`,
    },
  });

  if (error) {
    return {
      errors: {
        general: [
          "Couldn't create your account, please try a different username or try again",
        ],
      },
      values: { username, email },
    };
  }

  // If email confirmation is enabled, user exists but session is null
  if (data.user && !data.session) {
    return {
      requiresConfirmation: true,
      values: { username, email },
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
