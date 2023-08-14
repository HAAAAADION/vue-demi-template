<template>
  <!--#ifdef VUE3-->
  <el-icon @click="handleClick"><component :is="icon" /></el-icon>
  <!--#endif-->
  <!--#ifdef VUE2-->
  <i :class="icon" @click="handleClick" />
  <!--#endif-->
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue-demi'
import { ElIcon } from '@/components/element'
import icons from './list'

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
    const icon = computed(() => icons[props.name])

    const handleClick = () => emit('click')

    return {
      attrs,
      icon,
      handleClick
    }
  }
})
</script>
