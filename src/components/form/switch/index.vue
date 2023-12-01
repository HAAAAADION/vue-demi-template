<template>
  <fragment>
    <div :class="styles.head">
      <span v-if="title" :class="styles.title">{{ title }}</span>
      <div :class="styles.switch">
        <el-switch v-bind="attrs" :value="modelValue" @change="handleChange" />
        <!--#ifdef VUE2-->
        <div :class="styles.loading">
          <icon v-if="attrs.loading" name="Loading" />
        </div>
        <!--#endif-->
      </div>
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
import { ref, computed, defineComponent } from 'vue-demi'
import { ElSwitch } from '@/components/element'
import Fragment from '@/components/fragment/index.vue'
import Icon from '@/components/icon/index.vue'
import styles from './index.module.scss'

export default defineComponent({
  name: 'BkSwitch',
  components: { ElSwitch, Fragment, Icon },
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
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Function,
      default: undefined
    }
  },
  setup(props, { attrs, emit }): any {
    const internalLoading = ref(false)

    const handleChange = async (visible: boolean) => {
      if (props.lazy) {
        internalLoading.value = true
        const res = await props.lazy(visible)
        internalLoading.value = false

        if (typeof res === 'boolean') emit('update:modelValue', res)
      } else {
        emit('update:modelValue', visible)
        emit('change', visible)
      }
    }

    const loading = computed(() => internalLoading.value || props.loading)
    const attributes = computed(() => ({
      ...attrs,
      disabled: props.disabled || loading.value,
      loading: loading.value
    }))

    return {
      styles,
      internalLoading,
      attrs: attributes,
      handleChange
    }
  }
})
</script>
