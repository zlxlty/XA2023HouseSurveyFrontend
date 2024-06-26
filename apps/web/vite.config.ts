import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    icons({ compiler: 'jsx', jsx: 'react', autoInstall: true }),
  ],
  define: {
    'process.env.npm_lifecycle_event': '"build"',
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        sourcemapIgnoreList: (relativeSourcePath, sourcemapPath) => {
          return relativeSourcePath.includes('node_modules')
        },
        manualChunks: {
          libreact: ['react', 'react-dom', 'react-router-dom'],
          libleancloud: ['leancloud-storage', 'leancloud-realtime'],
          libgraphics: ['vis-network', 'pikaso-react-hook', 'panolens'],
          libsentry: ['@sentry/react'],
        },
      },
    },
  },
})
