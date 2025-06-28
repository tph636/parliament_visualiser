import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

// Load env variables
const PORT = parseInt(process.env.PORT, 10);

export default defineConfig({
  server: {
    port: PORT,
  },
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
  ],
});
