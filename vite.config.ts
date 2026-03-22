import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      manifest: {
        name: 'Wudle',
        short_name: 'Wudle',
        description: 'Wudle — daily 5-letter Wordle with Urban Dictionary slang words',
        theme_color: '#1a0a0a',
        background_color: '#1a0a0a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.urbandictionary\.com\//,
            handler: 'NetworkFirst',
            options: { cacheName: 'ud-api-cache', networkTimeoutSeconds: 5 },
          },
        ],
      },
    }),
  ],
})
