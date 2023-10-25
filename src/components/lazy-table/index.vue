<template>
  <bk-draggable
    v-model="list"
    :multiple="drag === 'multiple'"
    :disabled="!drag"
    :row-key="rowKey"
    :options="{ handle: '.sort-handler' }"
    @change="handleDrag"
  >
    <el-table v-loading="loading" v-bind="attrs" v-on="on" :data="list" :row-key="rowKey">
      <el-table-column
        v-if="drag"
        label="排序"
        prop="index"
        width="60"
        align="center"
        class-name="sort-handler"
      >
        <bk-icon name="Sort" />
      </el-table-column>
      <slot />
    </el-table>
    <el-pagination
      v-if="isShowPagination"
      :current-page="pagination.pageIndex"
      :page-size="pagination.pageSize"
      :page-sizes="pageSizes"
      :total="pagination.total"
      :layout="layout"
      :class="styles.pagination"
      @current-change="pageChange"
      @size-change="sizeChange"
    />
  </bk-draggable>
</template>

<script lang="ts">
import { reactive, toRefs, computed, defineComponent, PropType } from 'vue-demi'
import { TypeTableFetchApi } from '@/types/table'
import { ElTable, ElTableColumn, ElPagination } from '@/components/element'
import BkDraggable from '@/components/draggable/index.vue'
import BkIcon from '@/components/icon/index.vue'
import styles from './index.module.scss'

export default defineComponent({
  name: 'BkLazyTable',
  emits: ['drag'],
  components: {
    ElTable,
    ElTableColumn,
    ElPagination,
    BkDraggable,
    BkIcon
  },
  props: {
    showPagination: {
      type: Boolean,
      default: true
    },
    pageSize: {
      type: Number,
      default: 10
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper, ->'
    },
    fetchApi: {
      type: Function as PropType<TypeTableFetchApi>,
      required: true
    },
    // 是否开启默认异步请求
    autoFetch: {
      type: Boolean,
      default: true
    },
    rowKey: {
      type: String,
      default: undefined
    },
    // 是否开启拖拽, boolean: 单行拖拽, 'multiple': 多行拖拽
    drag: {
      type: [Boolean, String],
      default: false
    }
  },
  setup(props, { attrs, listeners, slots, emit, expose }): any {
    const state = reactive({
      loading: false,
      list: [] as Record<string, any>[],
      pagination: {
        pageCount: 0,
        pageIndex: 1,
        pageSize: props.pageSize as number,
        total: 0
      },
      query: {},
      isCache: false,
      isShowPagination: props.showPagination && !props.drag
    })

    const { list, pagination, loading, isShowPagination } = toRefs(state)

    // 收集监听事件
    let on = {} as any
    // #ifdef VUE2
    on = listeners
    // #endif
    // #ifdef VUE3
    Object.keys(attrs).forEach(key => {
      if (/on[A-Z]/.test(key)) {
        on[key] = attrs[key]
      }
    })
    // #endif

    const pageSizes = computed(() => {
      const defaultSize = [10, 20, 30, 40, 50, 100]
      if (props.pageSize && !defaultSize.includes(props.pageSize)) {
        const index = defaultSize.findIndex(e => e > props.pageSize)
        defaultSize.splice(~index ? index : defaultSize.length, 0, props.pageSize)
      }

      return defaultSize
    })

    const fetchData = async () => {
      try {
        const { pageIndex: page, pageSize } = state.pagination

        state.loading = true
        const res = await props.fetchApi({
          ...state.query,
          pageIndex: page,
          pageSize
        })

        const { data = [] as Record<string, any>[], pageCount, pageIndex, total } = res || {}

        state.list = data
        if (props.showPagination && !props.drag) state.isShowPagination = !!pageIndex

        Object.assign(state.pagination, {
          pageCount,
          pageIndex,
          total
        })
      } catch (err) {
        /** */
      }

      state.loading = false
    }

    const pageChange = (page: number) => {
      state.pagination.pageIndex = page
      fetchData()
    }
    const sizeChange = (size: number) => {
      state.pagination.pageSize = size
      fetchData()
    }

    const refresh = (params = {}) => {
      state.query = params
      pageChange(1)
    }

    const handleDrag = list => {
      emit('drag', list)
    }

    if (props.autoFetch) fetchData()

    expose({ refresh, refreshCurrentPage: fetchData })

    return {
      styles,
      slots,
      attrs,
      on,
      pageSizes,
      list,
      pagination,
      loading,
      isShowPagination,
      pageChange,
      sizeChange,
      refresh,
      refreshCurrentPage: fetchData,
      handleDrag
    }
  }
})
</script>
