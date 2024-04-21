import { defineConfig } from "vite";
import * as path from "path";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  server: {
    proxy: {
      "/1inchapi": {
        target: "https://api.1inch.dev",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/1inchapi/, ""),
      },
      "/splitexapi": {
        target: "https://rpc.splitex.app/api",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/splitexapi/, ""),
      },
      "/chartapi": {
        target: "https://api.dexscreener.com",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/chartapi/, ""),
        // headers: {
        //   Authorization: `Bearer ${process.env.ONEINCH_API_KEY}`,
        //   "Content-Type": "application/json;charset=UTF-8",
        //   "Access-Control-Allow-Origin": "*",
        // },
      },
    },
  },
  define: {
    "process.env": {},
  },
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
});
