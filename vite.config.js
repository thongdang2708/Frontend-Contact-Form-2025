import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [react()],
  server: {
    proxy: {
      "/api": "https://back-end-contact-form-thesis-2025.onrender.com",
    }  
  } 
})
