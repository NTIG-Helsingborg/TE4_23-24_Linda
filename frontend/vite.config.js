import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/randomize": "http://localhost:3000",
      "/getGroups": "http://localhost:3000",
      "/getStudentPreference": "http://localhost:3000",
      "/setStudentPreference": "http://localhost:3000",
    },
  },
});
