<template>
  <div :class="styles.input">
    <div
      :class="{
        [styles.inputNumber]: number,
        [styles.inputPrepend]: slots.prepend,
        [styles.inputAppend]: slots.append
      }"
    >
      <span v-if="readonly">{{ modelValue || '-' }}</span>
      <template v-else>
        <span v-if="number && slots.prepend" :class="styles.prepend">
          <slot name="prepend" />
        </span>
        <component
          v-bind="attrs"
          :is="component"
          :model-value="modelValue"
          @input="listeners.input"
          @change="listeners.change"
          @blur="listeners.blur"
        >
          <template v-if="slots.prefix" #prefix><slot name="prefix" /></template>
          <template v-if="slots.suffix" #suffix><slot name="suffix" /></template>
          <template v-if="slots.prepend" #prepend><slot name="prepend" /></template>
          <template v-if="slots.append" #append><slot name="append" /></template>
        </component>
        <span v-if="number && slots.append" :class="styles.append">
          <slot name="append" />
        </span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { toRefs, computed, defineComponent } from 'vue-demi'
import { ElInput, ElInputNumber } from '@/components/element'
import { isEmpty } from '@/utils'
import { i18n } from '@/utils/i18n'
import styles from './index.module.scss'

export default defineComponent({
  name: 'BkInput',
  emits: ['update:modelValue', 'change', 'blur'],
  slot: ['append'],
  props: {
    modelValue: {
      type: null,
      default: undefined
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    number: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Boolean,
      default: false
    },
    textarea: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    precision: {
      type: Number,
      default: null
    },
    min: {
      type: Number,
      default: undefined
    },
    max: {
      type: Number,
      default: undefined
    }
  },
  setup(props, { attrs, emit, slots }): any {
    const { disabled, textarea, max, number } = toRefs(props)

    const handleChange = (type: string, e: any) => {
      const value = typeof e === 'object' ? e?.target?.value : e

      if (!number.value && max.value && e?.length > max.value) return

      const res = number.value && !isEmpty(value) ? +value : value || undefined

      if (type === 'blur') {
        emit('blur', res)
      } else if (type === 'change') {
        emit('change', res)
      } else {
        emit('update:modelValue', res)
      }
    }

    const listeners = ['input', 'change', 'blur'].reduce((res, key) => {
      res[key] = !attrs[key] ? handleChange.bind(this, key) : attrs[key]
      return res
    }, {} as Record<string, any>)

    const component = computed(() => {
      return (number.value ? ElInputNumber : ElInput) as any
    })

    const newAttrs = computed(() => ({
      ...attrs,
      ...props,
      placeholder: i18n('cb.input') || props.placeholder,
      maxlength: max.value,
      showWordLimit: !disabled.value && max.value && textarea.value,
      type: textarea.value ? 'textarea' : attrs.type || 'text'
    }))

    return {
      styles,
      attrs: newAttrs,
      listeners,
      slots,
      component
    }
  }
})
</script>
