<template>
  <!--#ifdef VUE3-->
  <slot />
  <!--#endif-->
  <!--#ifdef VUE2-->
  <div v-if="childrenSize > 1">
    <slot />
  </div>
  <slot v-else />
  <!--#endif-->
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue-demi'
import { TypeSetupReturnParams } from '@/types/fragment'

export default defineComponent({
  name: 'BkFragment',
  setup(props, { slots }): any {
    const params = {} as TypeSetupReturnParams

    // #ifdef VUE2
    params.childrenSize = computed(() => {
      return slots.default ? slots.default().length : 0
    })
    // #endif

    return params
  }
})
</script>
