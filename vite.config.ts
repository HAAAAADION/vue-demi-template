import { defineConfig } from 'vite'
import { isVue2, version } from 'vue-demi'
import { resolve } from 'path'
import { smoothObjectAssign } from './scripts/object'
import { getLangConfig } from './scripts/lang'
import configVue2 from './config/vite.config.vue2'
import configVue3 from './config/vite.config.vue3'

export default defineConfig(async (params): any => {
  const { mode } = params
  console.log('===vue 版本===: ', mode, version)

  const isProduction = mode === 'production'

  // 获取多语言配置
  const langConfig = await getLangConfig()

  const common = {
    publicDir: isProduction ? false : 'public',
    resolve: {
      alias: {
        '@/types': resolve(__dirname, 'types'),
        '@': resolve(__dirname, 'src')
      }
    },
    optimizeDeps: {
      exclude: ['vue-demi']
    },
    css: {
      modules: {
        localsConvention: 'camelCaseOnly'
      }
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/main.ts'),
        name: 'component',
        fileName: 'index',
        formats: ['es']
      },
      exclude: /\/public\/.*/,
      rollupOptions: {
        input: {
          ...langConfig,
          index: 'src/main.ts'
        },
        output: {
          entryFileNames: e => {
            if (e.name.startsWith('lang')) {
              return '[name].js'
            }
            return '[name].js'
          },
          inlineDynamicImports: false,
          globals: {
            vue: 'Vue',
            'vue-demi': 'VueDemi'
          }
        }
      }
    }
  }

  return isVue2
    ? smoothObjectAssign(common, await configVue2(params))
    : smoothObjectAssign(common, await configVue3(params))
})
