<template>
  <div>
    <component
      v-bind="item.props"
      v-on="item.on"
      v-for="item in children"
      :key="item.key"
      :is="item.component"
      visible
    />
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, getCurrentInstance, onMounted } from 'vue-demi'
import { TypeModalChildren, TypeModalShowProps, TypeModalHideProps } from '@/types/modal.d'
import Fragment from '@/components/fragment/index.vue'

export default defineComponent({
  name: 'BkModal',
  components: {
    Fragment
  },
  props: {
    list: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const children = ref<TypeModalChildren[]>([])

    /**
     * 显示弹窗
     * @param {String}    key               窗口映射标识
     * @param {Object}    options           透传参数
     * @param {String=}   options.customKey 自定义弹窗缓存 key, 需要同时展示多个相同弹窗时用于标识
     * @param {String=}   emit              定义子组件的 emit 回调
     * */
    const show = async <T extends TypeModalShowProps>(
      key: string | any,
      options: T,
      emit: Record<string, (...args: any) => void>
    ) => {
      const { customKey } = options || {}

      const isCommonKey = typeof key === 'string'

      const el = isCommonKey ? (await props.list?.[key]())?.default : key
      if (!el) return

      const cacheKey = isCommonKey ? customKey || key : Symbol('key')
      const modalConfig = <TypeModalChildren>{
        component: el,
        key: cacheKey,
        props: options,
        on: emit
      }

      const index = getIndex(cacheKey)
      if (~index) {
        update(cacheKey, modalConfig)
      } else {
        children.value.push(modalConfig)
      }

      return cacheKey
    }
    /**
     * 关闭弹窗
     * @param {Object}    props     配置
     * @param {String=}   props.key 指定删除弹窗, 如不设置则删除全部弹窗
     * */
    const hide = (props: TypeModalHideProps = {}) => {
      const { key, global } = props

      if (global) {
        children.value = []
      } else if (key) {
        update(key)
      } else {
        // 默认删除最顶部的弹窗
        const lastKey = children.value[children.value.length - 1]?.key
        if (!lastKey) return
        update(lastKey)
      }
    }
    /**
     * 更新/删除弹窗
     * @param {String}            key   弹窗 key
     * @param {TypeModalChildren=}  modal vue 组件
     * */
    const update = (key: string | symbol, modal?: TypeModalChildren) => {
      const index = getIndex(key)
      if (!~index) return

      if (modal) children.value.splice(index, 1, modal)
      else children.value.splice(index, 1)
    }
    /**
     * 现有弹窗列表获取指定 key 的 index
     * @param   {String}  key 弹窗 key
     * @return  {Number}
     * */
    const getIndex = (key: string | symbol) => {
      return children.value.findIndex(e => e.key === key)
    }

    // #ifdef VUE3
    onMounted(() => {
      const instance = getCurrentInstance() as any
      if (!instance) return
      instance.appContext.config.globalProperties.$modal = {
        show,
        hide
      }
    })
    // #endif

    return {
      children,
      show,
      hide
    }
  }
})
</script>
