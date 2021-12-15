/* eslint-disable */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), VitePWA({
        includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
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
