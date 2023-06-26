<template>
  <fragment>
    <div :class="styles.head">
      <span v-if="title" :class="styles.title">{{ title }}</span>
      <el-switch v-bind="attrs" :value="modelValue" @change="handleChange" />
    </div>
    <div :class="styles.tips">
      <slot name="tips">{{ tips }}</slot>
    </div>
    <div v-if="modelValue" :class="styles.content">
      <slot />
    </div>
  </fragment>
</template>

<script lang="ts">
import { defineComponent } from 'vue-demi'
import { ElSwitch } from '@/components/element'
import Fragment from '@/components/fragment/index.vue'
import styles from './index.module.scss'

export default defineComponent({
  name: 'BkSwitch',
  components: { ElSwitch, Fragment },
  emits: ['update:modelValue', 'change'],
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: undefined
    },
    tips: {
      type: String,
      default: undefined
    }
  },
  setup(props, { attrs, emit }): any {
    const handleChange = (visible: boolean) => {
      emit('update:modelValue', visible)
      emit('change', visible)
    }

    return {
      styles,
      attrs,
      handleChange
    }
  }
})
</script>
