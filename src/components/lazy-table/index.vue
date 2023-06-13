<template>
  <bk-fragment>
    <el-table v-loading="loading" v-bind="attrs" :data="list">
      <slot />
    </el-table>
    <el-pagination
      v-if="showPagination"
      :current-page="pagination.pageIndex"
      :page-size="pagination.pageSize"
      :page-sizes="pageSizes"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper, ->"
      :class="styles.pagination"
      @current-change="pageChange"
      @size-change="sizeChange"
    />
  </bk-fragment>
</template>

<script lang="ts">
import { reactive, toRefs, computed, defineComponent, PropType } from 'vue-demi'
import { TypeTableFetchApi } from '@/types/table'
import { ElTable, ElPagination } from '@/components/element'
import BkFragment from '@/components/fragment/index.vue'
import styles from './index.module.scss'

export default defineComponent({
  name: 'BkLazyTable',
  components: {
    ElTable,
    ElPagination,
    BkFragment
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
    fetchApi: {
      type: Function as PropType<TypeTableFetchApi>,
      required: true
    },
    // 是否开启默认异步请求
    autoFetch: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { attrs, slots, expose }): any {
    const state = reactive({
      loading: false,
      list: [] as any[],
      pagination: {
        pageCount: 0,
        pageIndex: 1,
        pageSize: props.pageSize as number,
        total: 0
      },
      query: {},
      isCache: false
    })

    const { list, pagination, loading } = toRefs(state)

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

        const { data = [] as any[], pageCount, pageIndex, total } = res || {}

        state.list = data

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

    if (props.autoFetch) fetchData()

    expose({ refresh })

    return {
      styles,
      slots,
      attrs,
      pageSizes,
      list,
      pagination,
      loading,
      pageChange,
      sizeChange,
      refresh
    }
  }
})
</script>
