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
  setup(props, { emit }): any {
    const iconList = ref<Record<string, any>>({})

    // #ifdef VUE3
    ;(async () => {
      const { ZoomIn, Download, Edit, Delete, VideoPlay, Document } = await import(
        '@element-plus/icons-vue'
      )
      iconList.value = {
        ZoomIn,
        Download,
        Edit,
        Delete,
        VideoPlay,
        Document
      }
    })()
    // #endif
    // #ifdef VUE2
    iconList.value = {
      ZoomIn: 'el-icon-zoom-in',
      Download: 'el-icon-download',
      Edit: 'el-icon-edit-outline',
      Delete: 'el-icon-delete',
      VideoPlay: 'el-icon-video-play',
      Document: 'el-icon-document'
    }
    // #endif

    const handleClick = () => {
      emit('click')
    }

    return {
      iconList,
      handleClick
    }
  }
})
</script>
