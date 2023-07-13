<template>
  <el-dialog
    close-on-click-modal
    :model-value="visible"
    title="修改密码"
    width="600px"
    @closed="close"
  >
    123123123
  </el-dialog>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'

const emit = defineEmits(['ok'])

const props = defineProps({
  visible: {
    required: true,
    type: Boolean,
    default: false
  },
  name: {
    type: String
  }
})

console.log('qweqwe: ', props.name)

const instance = getCurrentInstance() as any

const close = () => {
  emit('ok', 'qweqweqweqwe')
  instance?.proxy?.$modal?.hide()
}
</script>
