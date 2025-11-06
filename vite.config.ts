import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

const testing = process.env.NODE_ENV === 'testing'

const config = defineConfig({
  plugins: [
    viteTsConfigPaths(),
    tanstackStart(),
    viteReact(),
    tailwindcss(),
  ],
  build: {
    ...(testing && {
      minify: false,
    }),
  },
  ssr: {
    noExternal: ['streamdown','@rolder/streamdown', '@rolder/ui-kit-react'],
  },
})

export default config
