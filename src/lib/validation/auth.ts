import { z } from "zod";

const encoder = new TextEncoder();

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username cannot exceed 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => encoder.encode(val).length <= 72, {
      message: "Password cannot exceed 72 bytes",
    }),
});

export type SignupInput = z.infer<typeof signupSchema>;

// Backwards-compatible aliases
export const authSchema = loginSchema;
export type AuthInput = LoginInput;
