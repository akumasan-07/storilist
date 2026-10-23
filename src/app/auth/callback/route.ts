import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sanitizeRedirectPath } from "@/lib/supabase/redirect";
import { getSiteOriginFromRequest } from "@/lib/supabase/origin";
import {
  RECOVERY_COOKIE_NAME,
  RECOVERY_COOKIE_OPTIONS,
} from "@/lib/supabase/recovery";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const targetPath = sanitizeRedirectPath(next);
  const origin = getSiteOriginFromRequest(request);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const response = NextResponse.redirect(`${origin}${targetPath}`);
      if (targetPath === "/reset-password") {
        response.cookies.set(
          RECOVERY_COOKIE_NAME,
          "1",
          RECOVERY_COOKIE_OPTIONS
        );
      }
      return response;
    }
  }

  // If code exchange failed for /reset-password, forward there without the cookie so the page can show the expired message
  if (targetPath === "/reset-password") {
    const response = NextResponse.redirect(`${origin}/reset-password`);
    response.cookies.delete(RECOVERY_COOKIE_NAME);
    return response;
  }

  // Fallback to login with an error query param if code exchange fails
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
