/* eslint-disable */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), VitePWA({
        includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
            "name": "Photo Rater App",
            "short_name": "Photoraterapp",
            "description": "Get the opinion of people from all over the world to rate your photos, for dating and social profiles",
            "icons": [
                {
                    "src": "/pwa-chrome-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "/pwa-chrome-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png"
                }
            ],
            "theme_color": "#2196f3",
            "background_color": "#ffffff",
            "display": "standalone"
        },
        registerType: 'autoUpdate',
        workbox: {
            sourcemap: true
        }
    })],
    resolve: {
        alias: [
            {
                find: /^@mui\/icons-material\/(.*)/,
                replacement: '@mui/icons-material/esm/$1'
            }
        ]
    },
    server: {
        port: 3001
    },
    assetsInclude: ['**/*.txt']
});
