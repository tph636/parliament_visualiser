import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths"; // optional, if you're using path aliases

// Load env variables
const PORT = parseInt(process.env.PORT, 10);

export default defineConfig({
  server: {
    port: PORT,
  },
  plugins: [
    reactRouter(),
    tsconfigPaths(), // Optional but recommended for path alias support
  ],
});
