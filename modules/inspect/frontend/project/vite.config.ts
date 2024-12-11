
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'inspect_module',
      filename: 'inspectModule.js',
      remotes: {
        // Link to the remote components based on the finally assembled application.
        'mainApp': '../../../assets/remoteEntry.js'
      },
      // Modules to expose
      exposes: {
        './InspectModule': './src/pages/Inspect',
        './InspectSettingsModule': './src/pages/InspectSettings',
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
