/**
 * Servicio de autenticación simplificado
 * Centraliza todas las operaciones relacionadas con la autenticación
 */

import { supabase } from "./supabase/client";

// Función auxiliar para establecer cookies manualmente
function setCookie(name: string, value: string, days: number = 7) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

/**
 * Servicio de autenticación
 */
export const authService = {
  /**
   * Iniciar sesión con email y contraseña
   */
  async login(email: string, password: string) {
    if (!email) throw new Error("El email es requerido");
    if (!password) throw new Error("La contraseña es requerida");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(email, password);
      console.log("error", error);
      throw error;
    }

    // Establecer cookies manualmente para asegurar que estén disponibles para el servidor
    if (data.session) {
      setCookie("sb-access-token", data.session.access_token, 7);
      setCookie("sb-refresh-token", data.session.refresh_token, 30);

      // También establecer la cookie de autenticación de Supabase
      const supabaseUrl =
        import.meta.env.PUBLIC_SUPABASE_URL ||
        "https://dxpohpvfaqwpuxsqfigi.supabase.co";
      const projectName = supabaseUrl.split("//")[1].split(".")[0];
      const supabaseCookieName = `sb-${projectName}-auth-token`;
      const supabaseCookieValue = JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + data.session.expires_in,
      });
      setCookie(supabaseCookieName, supabaseCookieValue, 7);
    }

    return data;
  },

  /**
   * Cerrar sesión
   */
  async logout() {
    // Eliminar cookies manualmente
    this.clearAuthCookies();

    // Cerrar sesión en Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }

    return true;
  },

  /**
   * Eliminar todas las cookies de autenticación
   */
  clearAuthCookies() {
    // Función para eliminar una cookie
    const deleteCookie = (name: string) => {
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
    };

    // Eliminar cookies estándar de autenticación
    deleteCookie("sb-access-token");
    deleteCookie("sb-refresh-token");

    // Eliminar cookie específica de Supabase
    const supabaseUrl =
      import.meta.env.PUBLIC_SUPABASE_URL ||
      "https://dxpohpvfaqwpuxsqfigi.supabase.co";
    const projectName = supabaseUrl.split("//")[1].split(".")[0];
    deleteCookie(`sb-${projectName}-auth-token`);
  },

  /**
   * Obtener el usuario actual
   */
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error && error.message !== "Failed to get user from storage") {
      console.error("Error al obtener usuario actual:", error);
      throw error;
    }

    return user;
  },

  /**
   * Verificar si hay una sesión activa
   */
  async isAuthenticated() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error al verificar sesión:", error);
      return false;
    }

    return !!session;
  },
};
