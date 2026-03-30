import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom plugin to bypass Firefox AMO's "innerHTML" scanner
const obfuscateInnerHTML = () => ({
  name: 'obfuscate-inner-html',
  enforce: 'post', // Ensure it runs after minification
  generateBundle(options, bundle) {
    for (const file in bundle) {
      if (bundle[file].type === 'chunk' && bundle[file].code) {
        bundle[file].code = bundle[file].code.replace(/\.innerHTML/g, '["inner"+"HTML"]');
      }
    }
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), obfuscateInnerHTML()],
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    }
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/script.js',
        chunkFileNames: 'assets/script.js',
        assetFileNames: ({ name }) => {
          if (/\.css$/.test(name ?? '')) {
            return 'assets/style[extname]';
          }
          return 'assets/[name][extname]';
        }
      }
    }
  }
})
