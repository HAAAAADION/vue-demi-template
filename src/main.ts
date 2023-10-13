import { defineAsyncComponent } from 'vue-demi'

import BkInput from './components/form/input/index.vue'
import BkSelect from './components/form/select/index.vue'
import BkUpload from './components/form/upload/index.vue'
import BkOssFile from './components/form/upload/components/oss-file/index.vue'
import BkSwitch from './components/form/switch/index.vue'
const BkEditor = defineAsyncComponent(() => import('./components/form/editor/index.vue'))
export * from './components/form/table'

import BkLazySelect from './components/lazy-select/index.vue'
import BkDraggable from './components/draggable/index.vue'
import BkModal from './components/modal/index.vue'
import BkTooltip from './components/tooltip/index.vue'

export {
  BkInput,
  BkSelect,
  BkUpload,
  BkOssFile,
  BkSwitch,
  BkEditor,
  BkLazySelect,
  BkDraggable,
  BkModal,
  BkTooltip
}
