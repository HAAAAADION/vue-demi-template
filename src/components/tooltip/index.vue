<template>
  <el-tooltip v-bind="attrs" :disabled="disabled">
    <template #content>
      <slot v-if="slots.content" name="content"></slot>
      <template v-else>{{ content }}</template>
    </template>
    <div
      :class="{
        [styles.multiEllipsis]: isMultiple,
        [styles.ellipsis]: line
      }"
      :style="style"
      @mouseover="checkDisabled"
    >
      <span ref="refContent">
        <slot v-if="slots.default" />
        <template v-else>{{ content }}</template>
      </span>
    </div>
  </el-tooltip>
</template>

<script lang="ts">
import { ref, computed, defineComponent } from 'vue-demi'
import { ElTooltip } from '@/components/element'
import styles from './index.module.scss'

export default defineComponent({
  name: 'BkTooltip',
  components: {
    ElTooltip
  },
  props: {
    content: {
      type: String,
      required: true
    },
    line: {
      type: [Number, String],
      default: 0
    },
    always: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { attrs, slots }): any {
    const refContent = ref(null)
    const disabled = ref(undefined)

    // 是否多行溢出隐藏
    const isMultiple = computed(() => +props.line > 1)
    // 动态样式
    const style = computed(() => {
      const result = {}

      if (isMultiple.value) result['-webkit-line-clamp'] = props.line

      return result
    })

    /**
     * 检查是否需要关闭提示
     * */
    const checkDisabled = () => {
      if (disabled.value !== undefined || props.always || slots.default) return

      const { parentNode, offsetWidth, offsetHeight } = refContent.value

      disabled.value = isMultiple.value
        ? parentNode.offsetHeight >= offsetHeight
        : parentNode.offsetWidth >= offsetWidth

      console.log('disabled.value: ', disabled.value)
    }

    return {
      styles,
      refContent,
      isMultiple,
      slots,
      attrs,
      style,
      disabled,
      checkDisabled
    }
  }
})
</script>
