import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { resolve } from 'path';


export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }]
        ],
        
        presets: [
          ['@babel/preset-react', {
            runtime: 'automatic',
            development: process.env.NODE_ENV === 'development',
            
            importSource: 'react'
          }]
        ]
      },
      include: "**/*.{jsx,js,tsx,ts}",
      
      fastRefresh: true,
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
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      'react-router-dom': path.resolve(__dirname, './node_modules/react-router-dom')
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
    dedupe: ['react', 'react-dom', 'react-router-dom'] 
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
    
    jsx: 'automatic',
    jsxInject: "import React from 'react'",
  },
  build: {
    outDir: 'build',
    sourcemap: 'hidden',
    chunkSizeWarningLimit: 2000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        ecma: 2020,
        passes: 2
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      external: [], 
      output: {
        
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'scheduler'],
          'vendor-router': ['react-router-dom'],
          'vendor-mui': ['@mui/material', '@mui/icons-material', '@mui/system', '@emotion/react', '@emotion/styled'],
          'vendor': [
            'framer-motion', 
            'axios',
            'socket.io-client',
            'react-hot-toast',
            'react-helmet-async',
            'date-fns',
            'emoji-picker-react'
          ]
        },
        
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    
    target: 'es2020',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    
    cssMinify: true,
  },
  
  publicDir: 'public',
  
  server: {
    host: '0.0.0.0',
    port: 3000,
    
    hmr: true,
    
    fs: {
      strict: true,
    },
    proxy: {
      '/api': {
        target: 'https://k-connect.ru', 
        changeOrigin: true,
        secure: true,
        ws: true,
        
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
            
            proxyReq.setHeader('X-Forwarded-Proto', 'https');
            proxyReq.setHeader('X-Forwarded-Host', 'k-connect.ru');
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            
            const cookies = proxyRes.headers['set-cookie'];
            if (cookies) {
              console.log('Setting cookies:', cookies);
            }
          });
        }
      }
    }
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled'
    ],
    force: true, 
    
    esbuildOptions: {
      
      target: 'es2020',
    }
  }
});
