import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

export default defineConfig({
  integrations: [
    // Habilitar React para componentes interactivos
    react(),
    // Configurar Tailwind
    tailwind({
      config: { path: "./tailwind.config.cjs" },
    }),
  ],
  // Configuración para el manejo de rutas
  output: "server", // Cambia esto a 'server' para habilitar el renderizado del lado del servidor (SSR)
  adapter: node({ mode: "standalone" }),
});
