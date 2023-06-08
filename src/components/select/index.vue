<template>
  <template v-if="readonly">{{ text }}</template>
  <component
    v-else
    v-bind="attrs"
    :is="parentComponent"
    :modelValue="modelValue"
    @input="handleInput"
    @change="handleChange"
  >
    <component
      v-for="(item, index) in selectData"
      :is="subComponent"
      :key="item.code"
      :label="radio ? item.code : item.name"
      :value="item.code"
      :disabled="
        isFunction(optionProps.disabled)
          ? optionProps.disabled(item, index)
          : !!optionProps.disabled
      "
    >
      {{ item.name }}
    </component>
  </component>
</template>

<script lang="ts">
import { toRefs, defineComponent, computed, isVue2, PropType } from 'vue-demi'
import { ElSelect, ElRadio, ElRadioGroup, ElOption } from '@/components/element'
import { isFunction } from '@/utils'
import { TypeSelectStatus, TypeSelectData } from '@/types/select.d'

export default defineComponent({
  name: 'BkSelect',
  emits: ['update:modelValue', 'change'],
  props: {
    modelValue: {
      type: Number,
      default: null
    },
    data: {
      type: Array as PropType<Array<Record<string, any>>>,
      default: null
    },
    status: {
      type: [Object, Array] as PropType<TypeSelectStatus>,
      default: () => [1, 2] // 默认支持正负选项, 具体意义外部自行定义
    },
    text: {
      type: [Object, Array] as PropType<TypeSelectStatus>,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: false
    },
    radio: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    optionProps: {
      type: Object,
      default: () => ({})
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    labelKey: {
      type: [String, Number],
      default: null
    },
    valueKey: {
      type: [String, Number],
      default: null
    }
  },
  setup(props, { attrs, emit }): any {
    const { modelValue, data, status, text, radio, readonly, valueKey, labelKey } = toRefs(props)

    const selectData = computed<TypeSelectData>(() => {
      if (data.value !== null) {
        return data.value!.map(e => ({
          code: e[valueKey.value] || e.code,
          name: e[labelKey.value] || e.name
        }))
      }

      const isArrayStatus = Array.isArray(status.value)
      const isArrayText = Array.isArray(text.value)

      const statusList = isArrayStatus ? status.value : Object.keys(status.value)

      return statusList!.map((key: string | number, index: number) => {
        const value = isArrayStatus ? key : (status.value as Record<string | number, any>)?.[key]
        const textCode = isArrayText ? index : value

        return {
          code: value,
          name: text.value?.[textCode]
        }
      })
    })

    // 只读文案
    if (readonly.value) {
      const value = computed(() => {
        const cur = selectData.value.find(
          (e: any) => (e[valueKey.value] || e.code) === modelValue.value
        ) as any
        return cur[labelKey.value] || cur.name
      })

      return {
        text: value.value || '-'
      }
    }

    const Com = radio.value ? ElRadioGroup : ElSelect
    const SubCom = radio.value ? ElRadio : ElOption

    const handleChange = (type: 'input' | 'change', e: number | string | boolean) => {
      if ((isVue2 && type !== 'input') || (!isVue2 && type !== 'change')) return

      emit('update:modelValue', e)
      emit('change', e)
    }

    return {
      selectData,
      attrs: {
        ...attrs,
        ...props
      },
      parentComponent: Com,
      subComponent: SubCom,
      isFunction,
      handleInput: handleChange.bind(this, 'input'),
      handleChange: handleChange.bind(this, 'change')
    }
  }
})
</script>
