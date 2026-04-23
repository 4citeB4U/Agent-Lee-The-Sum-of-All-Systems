/*
LEEWAY HEADER — DO NOT REMOVE

REGION: CORE
TAG: CORE.MODULE.VITE_SDK_CONFIG.MAIN
DESCRIPTION: Auto-enforced by LeeWay Standards Enforcement Engine
AUTHORITY: LeeWay-Standards
DISCOVERY_PIPELINE: Voice → Intent → Location → Vertical → Ranking → Render

5WH:
WHAT = vite.sdk.config — governed module
WHY = Enforce LeeWay architectural standards in this file
WHO = Leeway Innovations / LeeWay Standards Enforcement Engine
WHERE = rtc/vite.sdk.config.ts
WHEN = 2026-04-18
HOW = Auto-enforced header; update manually with full 5WH detail

CHAIN: Standards → Integrated → Runtime → Projections
LICENSE: PROPRIETARY
*/

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/sdk/index.ts'),
      name: 'LeewaySDK',
      fileName: (format) => `leeway-sdk.${format}.js`
    },
    rollupOptions: {
      // Ensure we don't bundle dependencies that should be provided by the consumer
      external: ['react', 'react-dom', 'framer-motion', 'lucide-react', 'recharts', 'mediasoup-client'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'framer-motion': 'FramerMotion',
          'lucide-react': 'LucideReact',
          'recharts': 'Recharts',
          'mediasoup-client': 'MediasoupClient'
        }
      }
    }
  }
});
