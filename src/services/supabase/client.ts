/**
 * Cliente de Supabase unificado
 * Configuración centralizada para acceso a Supabase
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Configuración del cliente de Supabase
 * Usa variables de entorno públicas para acceso desde el cliente
 */
const SUPABASE_URL =
  import.meta.env.PUBLIC_SUPABASE_URL ||
  "https://dxpohpvfaqwpuxsqfigi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cG9ocHZmYXF3cHV4c3FmaWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NTY5NDAsImV4cCI6MjA1OTUzMjk0MH0.5py_euLhpzAQJOYtgHxPYtj1kSvbrf-YWzv0LCU0MYM";

/**
 * Cliente de Supabase tipado con la interfaz Database
 */
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
