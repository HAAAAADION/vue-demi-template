import { defineConfig } from 'vite'
import path, { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import vueJsx from '@vitejs/plugin-vue2-jsx'
// import ElementPlus from 'unplugin-element-plus/vite'
import { isVue2, version } from 'vue-demi'
// import { createVuePlugin } from 'vite-plugin-vue2'
import { preprocessor } from './scripts/vite-plugin-preprocessor'

export default defineConfig(async ({ mode }) => {
  console.log('===vue 版本===: ', mode, version)

  const isProduction = mode === 'production'
  const plugins = [preprocessor]

  if (isVue2) {
    plugins.push((await import('vite-plugin-vue2')).createVuePlugin({ jsx: true }))
  } else {
    plugins.push(vue(), vueJsx())
  }

  return {
    plugins,
    publicDir: isProduction ? false : 'public',
    resolve: {
      alias: {
        '@/types': path.resolve(__dirname, './types'),
        '@': path.resolve(__dirname, './src')
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
      outDir: isVue2 ? 'dist/vue2' : 'dist/vue3',
      lib: {
        entry: resolve(__dirname, 'src/main.ts'),
        name: 'component',
        fileName: 'index'
        // formats: ['es', 'umd', 'cjs']
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
          globals: {
            vue: 'Vue',
            'vue-demi': 'VueDemi'
          }
        }
      }
    }
  }
})
