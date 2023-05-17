// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { fileURLToPath, URL } from 'url'

export default defineNuxtConfig({
  alias: {
    '@': './',
    '@layouts': './layouts',
    '@pages': './pages',
    '@components': './components',
    '@assets': './assets',
    '@AnimObjects2D': './AnimObjects2D',
    '@AnimObjects3D': './AnimObjects3D',
    '@auxiliary': './auxiliary',
    '@core': './core',
    '@enums': './enums',
    '@interfaces': './interfaces',
    '@mixins': './mixins',
    '@reactives': './reactives',
    '@helpers': './helpers',
    '@workers': './workers',
    '@styles': './styles',
    '@ui': './ui',
  },
  routeRules: {
    '/': { ssr: true },
  },
  vite: {
    plugins: [nodePolyfills()],
    resolve: {
      extensions: ['.js', '.ts', '.css'],
      alias: [
        {
          find: '@',
          replacement: fileURLToPath(new URL('./', import.meta.url)),
        },
        {
          find: '@core',
          replacement: fileURLToPath(new URL('./core', import.meta.url)),
        },
        {
          find: '@auxiliary',
          replacement: fileURLToPath(new URL('./auxiliary', import.meta.url)),
        },
        {
          find: '@helpers',
          replacement: fileURLToPath(new URL('./helpers', import.meta.url)),
        },
        {
          find: '@transitions',
          replacement: fileURLToPath(new URL('./transitions', import.meta.url)),
        },
        {
          find: '@interfaces',
          replacement: fileURLToPath(new URL('./interfaces', import.meta.url)),
        },
        {
          find: '@reactives',
          replacement: fileURLToPath(new URL('./reactives', import.meta.url)),
        },
        {
          find: '@ui',
          replacement: fileURLToPath(new URL('./ui', import.meta.url)),
        },
        {
          find: '@AnimObjects2D',
          replacement: fileURLToPath(
            new URL('./AnimObjects2D', import.meta.url)
          ),
        },
        {
          find: '@AnimObjects3D',
          replacement: fileURLToPath(
            new URL('./AnimObjects3D', import.meta.url)
          ),
        },
        {
          find: '@workers',
          replacement: fileURLToPath(new URL('./workers', import.meta.url)),
        },
        {
          find: '@enums',
          replacement: fileURLToPath(new URL('./enums', import.meta.url)),
        },
        {
          find: '@styles',
          replacement: fileURLToPath(new URL('./styles', import.meta.url)),
        },

        {
          find: '@mixins',
          replacement: fileURLToPath(new URL('./mixins', import.meta.url)),
        },
      ],
    },
    css: {
      preprocessorOptions: {
        stylus: {
          additionalData: `@import "${path.resolve(
            __dirname,
            './styles/variables.styl'
          )}"`,
        },
      },
    },
  },
})
