import { devtools } from '@tanstack/devtools-vite'
import type { RollupLog } from 'rollup'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'

function suppressVendorWarnings(
  warning: RollupLog,
  warn: (warning: RollupLog) => void,
) {
  if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
  if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
  warn(warning)
}

const config = defineConfig({
  plugins: [
    devtools(),
    nitro({
      rollupConfig: {
        external: [/^@sentry\//],
        onwarn: suppressVendorWarnings,
      },
    }),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      onwarn: suppressVendorWarnings,
    },
  },
  environments: {
    ssr: {
      build: {
        rollupOptions: {
          onwarn: suppressVendorWarnings,
        },
      },
    },
  },
})

export default config
