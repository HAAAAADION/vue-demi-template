<template>
  <el-table-column v-bind="attrs">
    <template v-if="slots.header" #header><slot name="header" /></template>
    <template v-if="slots.default || prop" #default="{ row, $index }">
      <component :is="Component" :prop="`list[${$index}].${prop}`">
        <slot :row="row" :$index="$index">
          {{ !slots.default && prop ? safeGet(row, prop) : null }}
        </slot>
      </component>
    </template>
  </el-table-column>
</template>

<script lang="ts">
import { computed, inject, defineComponent, Ref } from 'vue-demi'
import { safeGet } from '@/utils'
import { ElTableColumn, ElFormItem } from '@/components/element'
import BkFragment from '@/components/fragment/index.vue'

export default defineComponent({
  name: 'BkFormTableColumn',
  components: {
    ElTableColumn,
    ElFormItem,
    BkFragment
  },
  props: {
    prop: {
      type: String,
      default: undefined
    }
  },
  setup(props, { attrs, slots }): any {
    const isPureList = inject<Ref<boolean>>('isPureList')

    const Component = computed(() => (isPureList?.value ? BkFragment : ElFormItem) as any)

    return {
      isPureList,
      attrs,
      slots,
      safeGet,
      Component
    }
  }
})
</script>
