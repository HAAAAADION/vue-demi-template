import { defineConfig } from 'vite'
import { isVue2, version } from 'vue-demi'
import configVue2 from './config/vite.config.vue2'
import configVue3 from './config/vite.config.vue3'

export default defineConfig(async (params): any => {
  const { mode } = params
  console.log('===vue 版本===: ', mode, version)

  return isVue2 ? configVue2(params) : configVue3(params)
})
