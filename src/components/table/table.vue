<template>
  <el-form ref="refForm" :rules="state.customRules" :model="state.form">
    <el-table v-bind="$attrs" :data="state.form.list">
      <slot />
    </el-table>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { RuleItem } from 'async-validator'
import { isEmpty, safeGet } from '@/utils'
import { ElForm, ElTable, FormInstance } from 'element-plus'

defineOptions({ name: 'FormTable' })
defineExpose({ validate: validateField })
const props = defineProps({
  data: {
    type: Array,
    default: () => [] as any
  },
  ruleKey: {
    type: Array,
    default: () => [] as string[]
  },
  rules: {
    type: Object,
    default: () => ({} as Record<string, RuleItem[]>)
  }
})

const state = reactive({
  customRules: {} as Record<string, RuleItem[]>,
  form: {
    list: [] as any
  }
})

const refForm = ref<FormInstance>()

/**
 * 构建列表规则
 * @param   {String}  key   校验字段
 * @param   {Number}  index 当前下标
 * @return  {String}
 * */
const buildRuleField = (key: string, index: number) => {
  const cur = state.form.list[index]
  const search = /([^\\.].+)\.|^((?!\.).)*$/g.exec(key)
  const path = (search?.[1] || search?.[0]) as string
  const isExist = safeGet(cur, path)
  return isExist || path === key ? `list[${index}].${key}` : undefined
}

/**
 * 获取列表校验规则
 * @desc   默认只校验必填, 业务可通过设置 rules 增加自定义校验规则(与正常的表单校验设置一致)
 * @param   {Array}   keys  需要校验的字段
 * @return  {Object}
 * */
const getListRules = (keys = [] as string[]) => {
  const { list = [] } = state.form || {}

  const customRuleKeys = Object.keys(props.rules || {})
  const totalKeys = [...keys, ...customRuleKeys]

  return list.reduce((res: Record<string, RuleItem>, item: any, index: number) => {
    totalKeys.forEach(k => {
      const key = buildRuleField(k, index)
      if (!key) return res

      // 业务自定义校验规则
      const customRules = props.rules?.[k]

      res[key] = customRules || [
        {
          required: true,
          message: `请输入 ${k}`,
          trigger: ['change', 'blur']
        }
      ]
    })
    return res
  }, {} as Record<string, RuleItem>)
}

/**
 * 获取列表 key prop name
 * @param   {Array|String}  key   校验字段
 * @param   {Number}        index 当前数据下标
 * @return  {Array}
 * */
const getFieldKeys = (key = [] as string[] | string, index: number) => {
  const keys = Array.isArray(key) ? key : [key]
  const regex = new RegExp(`list\\[${isEmpty(index) ? '.+' : index}\\]\\.(${keys.join('|')})`)
  return Object.keys(state.customRules).filter(e => regex.test(e))
}

// /**
//  * 清除列表异常校验
//  * @param {Array|String}  key   校验字段
//  * @param {Number}        index 当前数据下标
//  * */
// const clearListValidate = (key: string[] | string, index: number) => {
//   if (!refForm.value) return
//   refForm.value.clearValidate(getFieldKeys(key, index))
// }

/**
 * 列表校验
 * @param {Array|String}  key   校验字段
 * @param {Number}        index 当前数据下标
 * */
function validateField(key = [] as string[] | string, index: number) {
  if (!refForm.value) return

  return new Promise((resolve, reject) => {
    if (isEmpty(key)) {
      refForm.value!.validate((valid, error) => {
        if (!valid) reject(error)
        else resolve(undefined)
      })
      return
    }

    refForm.value!.validateField(getFieldKeys(key, index), err => {
      if (err) reject(err)
      else resolve(undefined)
    })
  })
}

watch(
  () => props.data,
  () => {
    state.form.list = props.data
    state.customRules = getListRules(props.ruleKey as string[])
  },
  { immediate: true }
)
</script>
