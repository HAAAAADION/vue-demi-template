import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { preprocessor } from '../scripts/vite-plugin-preprocessor'

export default async ({ mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [preprocessor, vue(), vueJsx()],
    publicDir: isProduction ? false : 'public',
    resolve: {
      alias: {
        '@/types': resolve(__dirname, '../types'),
        '@': resolve(__dirname, '../src')
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
      outDir: 'dist/vue3',
      lib: {
        entry: resolve(__dirname, '../src/main.ts'),
        name: 'component',
        fileName: 'index'
        // formats: ['es']
      },
      exclude: /\/public\/.*/,
      rollupOptions: {
        external: [
          'vue',
          'vue-demi',
          'element-ui',
          'element-plus',
          'async-validator',
          '@vue/composition-api',
          'axios',
          'ali-oss',
          '@element-plus/icons-vue',
          'sortablejs'
        ],
        // input: {
        //   index: 'src/main.ts'
        // },
        output: {
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          // entryFileNames: '[name].js',
          // // format: "es",
          // inlineDynamicImports: false,
          // // chunkFileNames: '[name].[hash].js',
          // manualChunks: {
          //   tinymce: chunkTinymce
          // },
          // format: 'commonjs',
          globals: {
            vue: 'Vue',
            'vue-demi': 'VueDemi'
          }
        }
      }
    }
  }
}
