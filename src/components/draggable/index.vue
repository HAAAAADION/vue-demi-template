<template>
  <div ref="refDrag">
    <template v-if="slots.item">
      <!--#ifdef VUE3-->
      <slot v-for="item in list" :key="item[rowKey]" name="item" :item="item" />
      <!--#endif-->
      <!--#ifdef VUE2-->
      <span v-for="item in list" :key="item[rowKey]"><slot name="item" :item="item" /></span>
      <!--#endif-->
    </template>
    <slot v-else />
  </div>
</template>

<script lang="ts">
import { ref, watch, defineComponent, onMounted, PropType } from 'vue-demi'
import Sortable from 'sortablejs'

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
    }
  },
  setup(props, { emit, slots }): any {
    const refDrag = ref<any>(null)

    const list = ref<Record<string, any>[]>([])

    const rowDrop = (el: HTMLElement) => {
      Sortable.create(el, {
        animation: 150,
        ...props.options,
        onEnd: ({ newIndex, oldIndex }: Sortable.SortableEvent) => {
          const list = JSON.parse(JSON.stringify(props.modelValue))

          const currRow = list.splice(oldIndex, 1)[0]
          list.splice(newIndex, 0, currRow)
          emit('update:modelValue', list)
        }
      } as Sortable.Options)
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
      const elTable = refDrag.value.querySelector('.el-table__body-wrapper tbody')
      if (elTable) rowDrop(elTable)
      else rowDrop(refDrag.value)
    })

    return {
      slots,
      refDrag,
      list
    }
  }
})
</script>
