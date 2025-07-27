import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const PORT = parseInt(process.env.PORT || "3001", 10);

export default defineConfig({
  server: {
    port: PORT,
    host: true
  },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
});
