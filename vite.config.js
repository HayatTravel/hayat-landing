import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves the site from /hayat-landing/
export default defineConfig(({ command, isPreview }) => ({ base: command === 'build' || isPreview ? '/hayat-landing/' : '/', plugins: [react(), tailwindcss()] }))
