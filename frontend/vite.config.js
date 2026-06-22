import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Keep the heavy 3D libs in their own cacheable chunks. They're only
        // pulled in via the lazy Scene3D import, so this also keeps them out of
        // the initial entry bundle.
        manualChunks: {
          three: ['three'],
          gsap: ['gsap', 'gsap/ScrollTrigger'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'lcov'],
      // Coverage is measured on files exercised by tests. We deliberately do NOT
      // set `all: true`: the decorative, lazily-loaded 3D layer (src/three) needs
      // a real WebGL context and isn't unit-tested in jsdom, so counting it would
      // understate coverage of the code we actually test.
      exclude: [
        'src/main.jsx', // app bootstrap, nothing to assert
        'src/three/**', // WebGL layer — not testable in jsdom (excluded by intent)
        'src/**/*.lazy.jsx', // lazy chunk entrypoints (pull in three/gsap)
        'src/test/**',
        '**/*.test.{js,jsx}',
      ],
      // Regression floor, set just below the current baseline (lines ~79.8%,
      // statements ~76.8%, functions ~69%, branches ~63%). Goal: ratchet toward
      // 80% across the board as tests are added — raise these as coverage rises.
      thresholds: {
        lines: 78,
        statements: 75,
        functions: 68,
        branches: 62,
      },
    },
  },
})
