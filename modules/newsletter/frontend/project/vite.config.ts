
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'newsletter_module',
      filename: 'newsletterModule.js',
      remotes: {
        // Link to the remote components based on the finally assembled application.
        'mainApp': '../../../assets/remoteEntry.js'
      },
      // Modules to expose
      exposes: {
        './NewsletterUserModule': './src/pages/NewsletterUserModule',
        './NewsletterAdminModule': './src/pages/NewsletterAdminModule',
      },
      shared: ['react', 'react-dom', '@reduxjs/toolkit', 'react-redux'],
    }),
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
