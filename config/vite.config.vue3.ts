import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { preprocessor } from '../scripts/vite-plugin-preprocessor'

export default async () => {
  // const chunkTinymce = [
  //   'tinymce/tinymce',
  //   'tinymce-vue3',
  //   // '@tinymce/tinymce-vue',
  //   'tinymce/themes/silver',
  //   'tinymce/plugins/image',
  //   'tinymce/plugins/media',
  //   'tinymce/plugins/table',
  //   'tinymce/plugins/wordcount',
  //   'tinymce/plugins/link',
  //   'tinymce/icons/default/icons',
  //   'tinymce/models/dom/model',
  //   'tinymce/plugins/fullscreen',
  //   'tinymce/skins/ui/oxide/content.min.css',
  //   'tinymce/skins/ui/oxide/content.inline.min.css',
  //   'tinymce/skins/ui/oxide/skin.min.css',
  //   'tinymce/skins/ui/oxide/skin.shadowdom.min.css'
  // ]

  return {
    plugins: [preprocessor, vue(), vueJsx()],
    build: {
      outDir: 'dist/vue3',
      rollupOptions: {
        external: [
          'vue',
          'vue-demi',
          'element-ui',
          'element-plus',
          'async-validator',
          '@vue/composition-api',
          'axios',
          // 'ali-oss',
          '@element-plus/icons-vue',
          'sortablejs'
        ]
        // input: {
        //   index: 'src/main.ts',
        //   utils: 'src/utils/index.ts',
        //   upload: 'src/utils/upload.ts'
        // },
        // output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        // entryFileNames: '[name].js',
        // // format: "es",
        // inlineDynamicImports: false,
        // // chunkFileNames: '[name].[hash].js',
        // manualChunks: {
        //   tinymce: chunkTinymce
        // },
        // format: 'commonjs',
        // globals: {
        //   vue: 'Vue',
        //   'vue-demi': 'VueDemi'
        // }
        // }
      }
    }
  }
}
