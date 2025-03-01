import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "!see",
        short_name: "!see",
        description: "bang!",
        theme_color: "#0c0a09",
        icons: [
          {
            src: "search.svg",
            type: "image/svg+xml",
          },
        ],
      },
    }),
    viteStaticCopy({
      targets: [
        {
          src: "_headers",
          dest: "",
        },
      ],
    }),
  ],
});
