/**
 * Simplified authentication middleware
 * Manages protection of administrative routes
 */

import { defineMiddleware } from "astro:middleware";
import { supabase } from "./services/supabase/client";

export const onRequest = defineMiddleware(async (context, next) => {
  const { locals, url, redirect, cookies } = context;

  // Check if we are in administrative routes
  const isAdminRoute = url.pathname.startsWith("/admin");

  // Get authentication cookies
  const accessTokenCookie = cookies.get("sb-access-token");
  const refreshTokenCookie = cookies.get("sb-refresh-token");

  // Check if there are valid authentication cookies
  let user = null;
  let session = null;

  // 1. Try with Supabase getSession
  try {
    const { data, error } = await supabase.auth.getSession();
    if (!error && data.session) {
      session = data.session;
      user = data.session.user;
    }
  } catch (e) {
    console.error("Error getting session:", e);
  }

  // 2. If no session, try using cookies directly
  if (!session && accessTokenCookie && refreshTokenCookie) {
    try {
      // Set session manually using cookies
      const { data, error } = await supabase.auth.setSession({
        access_token: accessTokenCookie.value,
        refresh_token: refreshTokenCookie.value,
      });

      if (!error && data.session) {
        session = data.session;
        user = data.session.user;
      }
    } catch (e) {
      console.error("Error setting session with cookies:", e);
    }
  }

  // Store user in locals for page access
  locals.user = user || null;

  // If we're not in an administrative route, continue without further verification
  if (!isAdminRoute) {
    return next();
  }

  // For admin routes, verify authentication
  if (!user) {
    // Clear cookies
    cookies.delete("sb-access-token", { path: "/" });
    cookies.delete("sb-refresh-token", { path: "/" });

    // Also clear the specific Supabase cookie
    const supabaseUrl =
      import.meta.env.PUBLIC_SUPABASE_URL ||
      "https://dxpohpvfaqwpuxsqfigi.supabase.co";
    const projectName = supabaseUrl.split("//")[1].split(".")[0];
    cookies.delete(`sb-${projectName}-auth-token`, { path: "/" });

    return redirect("/login/");
  }

  // Here you could add role verification if needed
  // For now, we just verify that the user is authenticated

  return next();
});
