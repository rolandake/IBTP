import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // écoute toutes les interfaces, pas seulement localhost
    proxy: {
      "/api": "http://localhost:5000", // backend local
    },
  },
});
