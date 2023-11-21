import { preprocessor } from '../scripts/vite-plugin-preprocessor'

export default async () => {
  return {
    plugins: [preprocessor, (await import('vite-plugin-vue2')).createVuePlugin({ jsx: true })],
    build: {
      outDir: 'dist/vue2',
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
        ]
      }
    }
  }
}
