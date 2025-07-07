import type { APIRoute } from "astro";

export const post: APIRoute = async ({ cookies, redirect }) => {
  // Limpiar las cookies de autenticación
  cookies.delete("sb-access-token", { path: "/" });
  cookies.delete("sb-refresh-token", { path: "/" });

  // Redirigir al homee
  return redirect("/");
};
