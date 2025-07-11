import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    port: 5173,
    host: "0.0.0.0", // For mobile access
  },
  build: {
    sourcemap: false,
  },
});
