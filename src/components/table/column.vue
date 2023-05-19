<template>
  <el-table-column v-bind="$attrs" :prop="prop">
    <template #default="scope">
      <el-form-item :prop="getItemProp(scope)">
        <slot :row="scope.row" :$index="scope.$index" />
      </el-form-item>
    </template>
  </el-table-column>
</template>

<script setup lang="ts">
import { ElTableColumn, ElFormItem } from 'element-plus'

defineOptions({ name: 'FormTableColumn' })
const props = defineProps({
  prop: {
    type: String,
    default: undefined
  }
})

const getItemProp = (scope = {} as any) => {
  const { $index } = scope
  return `list[${$index}].${props.prop}`
}
</script>
