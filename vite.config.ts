import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

// const dev = process.env.NODE_ENV === 'development'

const config = defineConfig({
  plugins: [
    viteTsConfigPaths(),
    tanstackStart(),
    viteReact(),
    tailwindcss(),
  ],
  // build: {
  //   ...(dev && {
  //     minify: false,
  //   }),
  // },
  ssr: {
    noExternal: ['streamdown'],
  },
})

export default config
