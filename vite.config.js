import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import dynamicImport from 'vite-plugin-dynamic-import'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { fileURLToPath, URL } from "url";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: [
//       { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
//       { find: '@assets', replacement: fileURLToPath(new URL('./src/shared/assets', import.meta.url)) },
//       { find: '@cmp', replacement: fileURLToPath(new URL('./src/shared/cmp', import.meta.url)) },
//       { find: '@stores', replacement: fileURLToPath(new URL('./src/shared/stores', import.meta.url)) },
//       { find: '@use', replacement: fileURLToPath(new URL('./src/shared/use', import.meta.url)) },
//     ],
//   },
// });

export default defineConfig({
  plugins: [
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    }),
    // better dynamic imports for lazy importing modules
    dynamicImport(),
    // polyfills for vectorize-text library
    nodePolyfills(), 
  ],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '@core', replacement: fileURLToPath(new URL('./src/core', import.meta.url)) },
      { find: '@auxiliary', replacement: fileURLToPath(new URL('./src/auxiliary', import.meta.url)) },
      { find: '@helpers', replacement: fileURLToPath(new URL('./src/helpers', import.meta.url)) },
      { find: '@transitions', replacement: fileURLToPath(new URL('./src/transitions', import.meta.url)) },
      { find: '@interfaces', replacement: fileURLToPath(new URL('./src/interfaces', import.meta.url)) },
      { find: '@ui', replacement: fileURLToPath(new URL('./src/ui', import.meta.url)) },
      { find: '@AnimObjects2D', replacement: fileURLToPath(new URL('./src/AnimObjects2D', import.meta.url)) },
      { find: '@AnimObjects3D', replacement: fileURLToPath(new URL('./src/AnimObjects3D', import.meta.url)) },
      { find: '@workers', replacement: fileURLToPath(new URL('./src/workers', import.meta.url)) },
    ],
  }
});