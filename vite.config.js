import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Expense-Tracker/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['Ep.png'],
      manifest: {
        name: 'PFMA – Expense Tracker',
        short_name: 'PFMA',
        description: 'Track your expenses and budget offline',
        theme_color: '#FFF8F0',
        background_color: '#FFF8F0',
        display: 'standalone',
        start_url: '/Expense-Tracker/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
