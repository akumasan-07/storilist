"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth";
import { sanitizeRedirectPath } from "@/lib/supabase/redirect";
import { getSiteOrigin } from "@/lib/supabase/origin";
import { RECOVERY_COOKIE_NAME } from "@/lib/supabase/recovery";

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

  if (rpcError) {
    return {
      errors: {
        general: ["Couldn't create your account, please try again"],
      },
      values: { username, email },
    };
  }

  if (isAvailable === false) {
    return {
      errors: {
        username: ["Username is already taken"],
      },
      values: { username, email },
    };
  }

  const origin = await getSiteOrigin();

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

export async function forgotPassword(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = String(formData.get("email") || "");

  const validation = forgotPasswordSchema.safeParse({ email });
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      values: { email },
    };
  }

  const supabase = await createClient();
  const origin = await getSiteOrigin();
  const redirectTo = `${origin}/auth/callback?next=/reset-password`;

  try {
    await supabase.auth.resetPasswordForEmail(validation.data.email, {
      redirectTo,
    });
  } catch (err) {
    console.error("resetPasswordForEmail error:", err);
  }

  // Always show neutral success message without leaking account existence or raw errors
  return {
    successMessage:
      "If an account exists for that email, we've sent a reset link.",
    values: { email },
  };
}

export async function resetPassword(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const password = String(formData.get("password") || "");

  const validation = resetPasswordSchema.safeParse({ password });
  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const cookieStore = await cookies();
  const hasRecoveryMarker = Boolean(
    cookieStore.get(RECOVERY_COOKIE_NAME)?.value
  );

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !hasRecoveryMarker) {
    return {
      errors: {
        general: [
          "This reset link is invalid or has expired. Please request a new link.",
        ],
      },
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: validation.data.password,
  });

  if (error) {
    console.error("updateUser password error:", error);
    return {
      errors: {
        general: [
          "Unable to update your password. Please try again or request a new link.",
        ],
      },
    };
  }

  cookieStore.delete(RECOVERY_COOKIE_NAME);
  await supabase.auth.signOut({ scope: "global" });
  revalidatePath("/", "layout");
  redirect("/login?reset=success");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
