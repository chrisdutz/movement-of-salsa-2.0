
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                {
                    src: 'src/assets/fontawesome',
                    dest: 'assets'
                }
            ]
        }),
        federation({
            name: 'app',
            remotes: {
                // "ReferenceError: __rf_placeholder__shareScope is not defined"
                dummy: "dummy.js",
            },
            exposes: {
                './BaseStore': './src/store/types',
                './ApplicationModule': './src/utils/ApplicationModule',
                './components/AdminList': './src/components/AdminList'
            },
            shared: ['react', 'react-dom', '@reduxjs/toolkit', 'react-redux'],
        })
    ],
    build: {
        modulePreload: false,
        target: 'esnext',
        minify: false,
        cssCodeSplit: false
    }
})
