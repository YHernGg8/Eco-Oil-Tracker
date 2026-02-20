import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from "path"

export default defineConfig({
  // 1. 将 logLevel 改为 'info'，这样 Terminal 才会显示 Local 链接
  logLevel: 'info',

  // 2. 添加 server 配置来控制浏览器行为
  server: {
    open: false, // 设置为 false，就不会自动在 Google 浏览器打开了
    host: true,  // (可选) 如果你想让同局域网的手机也能看到，可以开启这个
  },

  plugins: [
    base44({
      legacySDKImports: process.env.BASE44_LEGACY_SDK_IMPORTS === 'true',
      hmrNotifier: true,
      navigationNotifier: true,
      visualEditAgent: true
    }),
    react(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});