<template>
  <!--#ifdef VUE3-->
  <el-icon @click="handleClick"><component :is="iconList[name]" /></el-icon>
  <!--#endif-->
  <!--#ifdef VUE2-->
  <i :class="iconList[name]" @click="handleClick" />
  <!--#endif-->
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue-demi'
import { ElIcon } from '@/components/element'

export default defineComponent({
  name: 'BkIcon',
  components: {
    ElIcon
  },
  emits: ['click'],
  props: {
    name: {
      type: String,
      required: true
    }
  },
  setup(props, { attrs, emit }): any {
    const iconList = ref<Record<string, any>>({})

    // #ifdef VUE3
    ;(async () => {
      const { ZoomIn, Download, Edit, Delete, Document, Plus } = await import(
        '@element-plus/icons-vue'
      )
      iconList.value = {
        ZoomIn,
        Download,
        Edit,
        Delete,
        Document,
        Plus
      }
    })()
    // #endif
    // #ifdef VUE2
    iconList.value = {
      ZoomIn: 'el-icon-zoom-in',
      Download: 'el-icon-download',
      Edit: 'el-icon-edit-outline',
      Delete: 'el-icon-delete',
      Document: 'el-icon-document',
      Plus: 'el-icon-plus'
    }
    // #endif

    const handleClick = () => {
      emit('click')
    }

    return {
      attrs,
      iconList,
      handleClick
    }
  }
})
</script>
