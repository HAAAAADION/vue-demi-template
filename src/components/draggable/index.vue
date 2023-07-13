<template>
  <div ref="refDrag">
    <template v-if="slots.item">
      <!--#ifdef VUE3-->
      <slot v-for="item in list" :key="item[rowKey]" name="item" :item="item" />
      <!--#endif-->
      <!--#ifdef VUE2-->
      <span v-for="item in list" :key="item[rowKey]" :data-id="item[rowKey]">
        <slot name="item" :item="item" />
      </span>
      <!--#endif-->
    </template>
    <slot v-else />
  </div>
</template>

<script lang="ts">
import { ref, watch, defineComponent, onMounted, PropType } from 'vue-demi'
import Sortable, { MultiDrag } from 'sortablejs'
import useMultiple from './hook/multiple'

export default defineComponent({
  name: 'BkDraggable',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Array,
      default: () => [] as PropType<Record<string, any>[]>
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    options: {
      type: Object,
      default: () => ({})
    },
    // 是否开启多行拖拽
    multiple: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit, slots }): any {
    const refDrag = ref<any>(null)

    const insSort = ref<any>(null)
    const list = ref<Record<string, any>[]>([])

    const { getMultipleOptions, clearMultipleSelected, initMultipleId } = useMultiple()

    /**
     * 单行拖拽回调
     * */
    const handleSingleDrag = ({ newIndex, oldIndex }: Sortable.SortableEvent) => {
      const list = JSON.parse(JSON.stringify(props.modelValue))

      const currRow = list.splice(oldIndex, 1)[0]
      list.splice(newIndex, 0, currRow)
      emit('update:modelValue', list)
    }

    /**
     * 多行拖拽回调
     * */
    const handleMultipleDrag = (evt: Sortable.SortableEvent) => {
      const { items } = evt

      // 清除批量选中缓存
      clearMultipleSelected(items)

      const newList = insSort.value
        .toArray()
        .map((e: string) => list.value.find(v => String(v[props.rowKey]) === e))

      // 重新排序刷新列表
      // insSort.value.sort(list.value.map(e => e.age))

      emit('update:modelValue', newList)
    }

    const buildMultipleConfig = (el: HTMLElement): Sortable.Options => {
      const options = <Sortable.Options>{
        animation: 150,
        multiDrag: props.multiple,
        selectedClass: 'bk-draggable-multiple-selected',
        onEnd: props.multiple ? handleMultipleDrag : handleSingleDrag
      }

      // 点击批量选择只支持表格
      if (props.multiple) {
        Object.assign(options, getMultipleOptions(el))
      }

      return {
        ...options,
        ...props.options
      }
    }

    const rowDrop = (el: HTMLElement) => {
      // 初始化 drag id
      initMultipleId(el)

      if (props.multiple) Sortable.mount(new MultiDrag())

      insSort.value = Sortable.create(el, buildMultipleConfig(el))
    }

    const updateList = () => {
      list.value = props.modelValue as Record<string, any>[]
    }

    watch(
      () => props.modelValue,
      () => {
        updateList()
      },
      {
        immediate: true
      }
    )

    onMounted(() => {
      setTimeout(() => {
        const elTable = refDrag.value.querySelector('.el-table__body-wrapper tbody')
        if (elTable) rowDrop(elTable)
        else rowDrop(refDrag.value)
      }, 100)
    })

    return {
      slots,
      refDrag,
      list
    }
  }
})
</script>
