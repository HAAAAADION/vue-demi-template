import path from 'path'
import { isVue2 } from 'vue-demi'
import fs from 'fs'
import fsExtra from 'fs-extra'
import elementUiMap from './element-ui-component.js'

// 1. 替换 vue 版本
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
const __dirname = dirname(fileURLToPath(import.meta.url))

const DefaultVue = path.join(__dirname, '../node_modules/vue')
const Vue2 = path.join(__dirname, '../node_modules/vue2')
const Vue3 = path.join(__dirname, '../node_modules/vue3')
const comElement = path.join(__dirname, '../src/components/element.ts')

fsExtra.copySync(isVue2 ? Vue2 : Vue3, DefaultVue, { overwrite: true })

// 2. 统一 element
fs.writeFileSync(
  comElement,
  isVue2
    ? `export { ${Object.keys(elementUiMap)
        .map(e => {
          const name = e.replace(/^(\w)|(-(\w))/gm, ($0, $1, $2, $3) =>
            ($1 || $3).toLocaleUpperCase()
          )
          return `${name} as El${[name]}`
        })
        .join(',')} } from 'element-ui'`
    : "export * from 'element-plus'"
)
