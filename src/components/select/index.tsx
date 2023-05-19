import { toRefs, defineComponent, computed } from 'vue'
import { ElSelect, ElRadio } from 'element-plus'
import { isFunction } from '@/utils'

export default defineComponent({
  emits: ['update:modelValue', 'change'],
  props: {
    modelValue: {
      type: Number,
      default: undefined
    },
    data: {
      type: Array,
      default: undefined
    },
    status: {
      type: [Object, Array],
      default: () => [1, 2] // 默认支持正负选项, 具体意义外部自行定义
    },
    text: {
      type: [Object, Array],
      default: () => {}
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
      default: 'name'
    },
    valueKey: {
      type: [String, Number],
      default: 'code'
    }
  },
  setup(props, { attrs, emit }) {
    const {
      modelValue,
      data,
      status,
      text,
      radio,
      clearable,
      readonly,
      optionProps,
      placeholder,
      valueKey,
      labelKey
    } = toRefs(props)

    const selectData = computed(() => {
      if (data.value !== undefined) return data.value

      const isArrayStatus = Array.isArray(status.value)
      const isArrayText = Array.isArray(text.value)

      const statusList = isArrayStatus ? status.value : Object.keys(status.value)

      return statusList.map((key: string, index: number) => {
        const value = isArrayStatus ? key : (status.value as Record<string, string>)?.[key]
        const textCode = isArrayText ? index : value

        return {
          code: value,
          name: (text.value as Record<string, string>)?.[textCode]
        }
      })
    })

    // 只读状态
    if (readonly.value) {
      const value = computed(() => {
        const cur = selectData.value.find(
          (e: any) => (e[valueKey.value] || e.code) === modelValue.value
        ) as any

        return cur[labelKey.value] || cur?.name
      })

      return () => <span>{value.value || '-'}</span>
    }

    const Com = radio.value ? ElRadio.RadioGroup : ElSelect
    const SubCom = radio.value ? ElRadio : ElSelect.Option

    // 子组件透传参数
    const { disabled, ...params } = optionProps.value

    const handleChange = (e: number | string | boolean) => {
      emit('update:modelValue', e)
      emit('change', e)
    }

    return () => (
      <Com
        modelValue={modelValue.value}
        clearable={clearable.value}
        placeholder={placeholder.value}
        onChange={handleChange}
        {...attrs}
      >
        {selectData.value.map((e: any, i: number) => {
          const val = e[valueKey.value] || e.code
          const label = e[labelKey.value] || e.name

          return (
            <SubCom
              key={val}
              label={radio.value ? val : label}
              value={val}
              disabled={isFunction(disabled) ? disabled(e, i) : !!disabled}
              {...params}
            >
              {label}
            </SubCom>
          )
        })}
      </Com>
    )
  }
})
