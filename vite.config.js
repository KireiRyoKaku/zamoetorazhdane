import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/zamoetorazhdane/",
  server: {
    port: 5173,
    host: "192.168.0.142",
  },
});
