import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

const alias = {
  '@': path.resolve(__dirname, './src'),
  'react': path.resolve(__dirname, './node_modules/react'),
  'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
  'react-router-dom': path.resolve(__dirname, './node_modules/react-router-dom'),
};

export default defineConfig({
  base: '/',
  publicDir: 'public',
  
  plugins: [
    react({
      include: "**/*.{jsx,js,tsx,ts}",
      fastRefresh: true,
      jsxRuntime: 'automatic',
    }),
    svgr({ 
      svgrOptions: {
        exportType: 'named',
        ref: true,
        svgo: false,
        titleProp: true,
      },
      include: "**/*.svg"
    }),
  ],

  resolve: {
    alias,
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
  },

  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.[jt]sx?$/,
    exclude: [],
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.ts': 'tsx',
        '.tsx': 'tsx'
      },
    },
  },

  server: {
    host: true,
    port: 3005,
    hmr: true,
    fs: { strict: false },
    proxy: {
      '/api': {
        target: 'https://k-connect.ru',
        changeOrigin: true,
        secure: true,
        ws: true,
      },
      '/socket.io': {
        target: 'https://k-connect.ru',
        ws: true,
      },
      '/static': {
        target: 'https://k-connect.ru',
        changeOrigin: true,
        secure: true,
      },
    }
  },
}); 