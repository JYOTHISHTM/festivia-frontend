


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    tsconfigPaths(),
    {
      name: "custom-logger",
      configureServer(server) {
        server.httpServer?.once("listening", () => {
          (globalThis as any).console.log("\n➜  Local:   http://localhost:3030/");
          (globalThis as any).console.log("➜  Local:   http://localhost:3030/user/login");
          (globalThis as any).console.log("➜  Local:   http://localhost:3030/creator/login");
          (globalThis as any).console.log("➜  Local:   http://localhost:3030/admin/login\n");
        });
      },
    },
  ],
  server: {
    port: 3030,
    strictPort: true,
  },
});
