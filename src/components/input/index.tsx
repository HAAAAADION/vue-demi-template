import { toRefs, defineComponent } from 'vue'
import { ElInput, ElInputNumber } from 'element-plus'
import { isEmpty } from '@/utils'

export default defineComponent({
  name: 'FormInput',
  emits: ['update:modelValue', 'change', 'blur'],
  props: {
    modelValue: {
      type: null,
      default: undefined
    },
    readonly: {
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
    }
  },
  setup(props, { attrs, emit }) {
    const { modelValue, textarea, placeholder, controls, readonly, number } = toRefs(props)

    const maxLength = attrs.maxlength as number

    const handleChange = (type: string, e: any) => {
      const value = typeof e === 'object' ? e?.target?.value : e

      if (!number.value && maxLength && e?.length > maxLength) return

      const res = number.value && !isEmpty(value) ? +value : value

      emit('update:modelValue', res)
      emit('change', res)
      if (type === 'blur') emit('blur', res)
    }

    const listeners = ['onInput', 'onChange', 'onBlur'].reduce((res, key) => {
      res[key] = !attrs[key] ? handleChange.bind(this, key) : attrs[key]
      return res
    }, {} as Record<string, any>)

    // 只读状态只输出文案
    if (readonly.value) return () => (!isEmpty(modelValue.value) ? modelValue.value : '-')

    const Com = (number.value ? ElInputNumber : ElInput) as any

    return () => (
      <Com
        {...attrs}
        {...listeners}
        modelValue={modelValue.value}
        maxlength={maxLength}
        showWordLimit={maxLength && textarea.value}
        type={textarea.value ? 'textarea' : 'text'}
        placeholder={placeholder.value}
        controls={controls.value}
      />
    )
  }
})
