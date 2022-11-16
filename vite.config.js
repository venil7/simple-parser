import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    server: { port: 3030 },
    plugins: [react()],
    test: {
      globals: true,
    },
  };
});
