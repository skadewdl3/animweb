// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { fileURLToPath, URL } from 'url'

export default defineNuxtConfig({
  alias: {
    '@': '.',
    '@layouts': path.resolve(__dirname, './layouts'),
    '@pages': path.resolve(__dirname, './pages'),
    '@transitions': path.resolve(__dirname, './transitions'),
    '@components': path.resolve(__dirname, './components'),
    '@assets': path.resolve(__dirname, './assets'),
    '@AnimObjects2D': path.resolve(__dirname, './AnimObjects2D'),
    '@AnimObjects3D': path.resolve(__dirname, './AnimObjects3D'),
    '@auxiliary': path.resolve(__dirname, './auxiliary'),
    '@core': path.resolve(__dirname, './core'),
    '@enums': path.resolve(__dirname, './enums'),
    '@interfaces': path.resolve(__dirname, './interfaces'),
    '@mixins': path.resolve(__dirname, './mixins'),
    '@reactives': path.resolve(__dirname, './reactives'),
    '@helpers': path.resolve(__dirname, './helpers'),
    '@workers': path.resolve(__dirname, './workers'),
    '@styles': path.resolve(__dirname, './styles'),
    '@ui': path.resolve(__dirname, './ui'),
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
          replacement: path.resolve(__dirname, '.'),
        },
        {
          find: '@layouts',
          replacement: path.resolve(__dirname, 'layouts'),
        },
        {
          find: '@pages',
          replacement: path.resolve(__dirname, 'pages'),
        },
        {
          find: '@components',
          replacement: path.resolve(__dirname, 'components'),
        },
        // create aliases for auxiliary, helpers, transitions, mixins, interfaces, reactives, ui, AnimObjects2D, AnimObjects3D, enums, styles, workers
        {
          find: '@core',
          replacement: path.resolve(__dirname, 'core'),
        },
        {
          find: '@auxiliary',
          replacement: path.resolve(__dirname, 'auxiliary'),
        },
        {
          find: '@helpers',
          replacement: path.resolve(__dirname, 'helpers'),
        },
        {
          find: '@transitions',
          replacement: path.resolve(__dirname, 'transitions'),
        },
        {
          find: '@mixins',
          replacement: path.resolve(__dirname, 'mixins'),
        },
        {
          find: '@interfaces',
          replacement: path.resolve(__dirname, 'interfaces'),
        },
        {
          find: '@reactives',
          replacement: path.resolve(__dirname, 'reactives'),
        },
        {
          find: '@ui',
          replacement: path.resolve(__dirname, 'ui'),
        },
        {
          find: '@AnimObjects2D',
          replacement: path.resolve(__dirname, 'AnimObjects2D'),
        },
        {
          find: '@AnimObjects3D',
          replacement: path.resolve(__dirname, 'AnimObjects3D'),
        },
        {
          find: '@enums',
          replacement: path.resolve(__dirname, 'enums'),
        },
        {
          find: '@styles',
          replacement: path.resolve(__dirname, 'styles'),
        },
        {
          find: '@workers',
          replacement: path.resolve(__dirname, 'workers'),
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
