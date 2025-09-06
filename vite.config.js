import { visualizer } from 'rollup-plugin-visualizer';

import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        svgr({
            include: '**/*.svg?react',
        }),
        react(),
        tailwindcss(),
        visualizer({
            open: false,
            gzipSize: true,
            brotliSize: true,
        }),
    ],
    server: {
        open: '/',
    },
    build: {
        target: 'esnext',
        cssCodeSplit: true,
        sourcemap: false,
        minify: 'esbuild',
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                },
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
});
