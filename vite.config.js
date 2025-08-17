import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["xlsx"], // força Vite a otimizar o pacote xlsx
  },
  build: {
    rollupOptions: {
      external: [], // garante que não vai excluir o xlsx do bundle
    },
  },
})
