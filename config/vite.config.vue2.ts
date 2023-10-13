import { resolve } from 'path'
import { preprocessor } from '../scripts/vite-plugin-preprocessor'

export default async ({ mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [preprocessor, (await import('vite-plugin-vue2')).createVuePlugin({ jsx: true })],
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
      outDir: 'dist/vue2',
      lib: {
        entry: resolve(__dirname, '../src/main.ts'),
        name: 'component',
        fileName: 'index'
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
          'sortablejs',
          'tinymce/tinymce',
          '@tinymce/tinymce-vue',
          'tinymce/themes/silver',
          'tinymce/plugins/image',
          'tinymce/plugins/media',
          'tinymce/plugins/table',
          'tinymce/plugins/wordcount',
          'tinymce/plugins/link',
          'tinymce/icons/default/icons',
          'tinymce/models/dom/model',
          'tinymce/plugins/fullscreen',
          'tinymce/skins/ui/oxide/content.min.css',
          'tinymce/skins/ui/oxide/content.inline.min.css',
          'tinymce/skins/ui/oxide/skin.min.css',
          'tinymce/skins/ui/oxide/skin.shadowdom.min.css'
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
