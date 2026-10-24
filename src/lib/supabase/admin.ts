/**
 * SERVER-ONLY ADMIN CLIENT (SERVICE ROLE)
 *
 * CRITICAL SECURITY NOTICE:
 * This module creates a privileged Supabase client using the service-role key.
 * - It BYPASSES Row Level Security (RLS).
 * - It may ONLY be imported by the server-side data layer (`src/lib/db/`) or Server Actions.
 * - NEVER import this file in React components (Server Components or Client Components).
 * - NEVER expose the service-role key to the browser or use NEXT_PUBLIC_ variables for it.
 */

import { createClient } from "@supabase/supabase-js";

if (typeof window !== "undefined") {
  throw new Error(
    "Security Violation: src/lib/supabase/admin.ts may only be executed on the server, never in a browser context."
  );
}

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL environment variables for admin client."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
