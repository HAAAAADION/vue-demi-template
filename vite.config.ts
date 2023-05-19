import { defineConfig } from 'vite'
import path, { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import ElementPlus from 'unplugin-element-plus/vite'

export default defineConfig(({ mode }) => {
  const plugins = [vue(), vueJsx()]
  if (mode !== 'production') {
    plugins.push(ElementPlus())
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      lib: {
        entry: resolve(__dirname, 'src/main.ts'),
        name: 'component',
        fileName: 'index'
        // formats: ['es']
      },
      rollupOptions: {
        external: ['vue', 'element-plus', 'async-validator']
        // input: {
        //   main: 'src/main.ts'
        //   // main2: 'src/main.ts'
        // }
        // output: {
        //   // // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        //   // entryFileNames: '[name].js',
        //   // // format: "es",
        //   // inlineDynamicImports: false,
        //   globals: {
        //     vue: 'Vue',
        //     vue2: 'Vue',
        //   },
        // },
      }
    }
  }
})
