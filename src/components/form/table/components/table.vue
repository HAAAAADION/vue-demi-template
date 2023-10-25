<template>
  <component ref="refForm" :is="Parent" :model="form" :rules="customRules" :class="styles.table">
    <bk-lazy-table
      ref="refLazyTable"
      v-bind="attrs"
      v-on="on"
      :fetch-api="fetchData"
      :show-pagination="showPagination"
      :page-size="pageSize"
      :auto-fetch="autoFetch"
      @drag="drag"
    >
      <slot />
    </bk-lazy-table>
  </component>
</template>

<script lang="ts">
import {
  ref,
  toRefs,
  reactive,
  computed,
  watch,
  provide,
  defineComponent,
  PropType
} from 'vue-demi'
import { isEmpty } from '@/utils'
import { TypeTableRules, TypeTableFetchApiParams, TypeTableFetchApi } from '@/types/table.d'
import { ElForm } from '@/components/element'
import BkLazyTable from '@/components/lazy-table/index.vue'
import BkFragment from '@/components/fragment/index.vue'
import useValidator from '../hook/validator'
import styles from './index.module.scss'

export default defineComponent({
  name: 'BkFormTable',
  emits: ['drag'],
  components: {
    ElForm,
    BkLazyTable,
    BkFragment
  },
  props: {
    data: {
      type: Array,
      default: () => [] as PropType<Record<string, any>[]>
    },
    ruleKey: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    rules: {
      type: Object as PropType<TypeTableRules>,
      default: () => ({})
    },
    // 异步数据请求接口
    fetchApi: {
      type: Function as PropType<TypeTableFetchApi>,
      default: undefined
    },
    // 是否开启默认异步请求
    autoFetch: {
      type: Boolean,
      default: true
    },
    // 是否展示分页, 使用 fetchApi 默认展示
    showPagination: {
      type: Boolean,
      default: true
    },
    // 分页长度
    pageSize: {
      type: Number,
      default: 10
    }
  },
  setup(props, { attrs, listeners, slots, emit, expose }): any {
    const { getListRules, validateField, clearListValidate } = useValidator()

    const refForm = ref<any>(null)
    const refLazyTable = ref<any>(null)

    const state = reactive({
      form: {
        list: props.data as Record<string, any>[]
      }
    })

    const { form } = toRefs(state)

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

    const customRules = computed(() => {
      return getListRules({
        list: form.value.list,
        ruleKey: props.ruleKey,
        rules: props.rules
      })
    })

    // 是否不需要 form
    const isPureList = computed(() => isEmpty(props.rules) && !props.ruleKey?.length)
    // 父组件
    const Parent = computed(() => (isPureList.value ? BkFragment : ElForm))

    const validate = (key?: string | string[], index?: number) => validateField(refForm, key, index)

    const clearValidate = (key?: string | string[], index?: number) =>
      clearListValidate(refForm, key, index)

    const refresh = (query?: Record<string, any>) => {
      if (!refLazyTable.value) return
      refLazyTable.value.refresh(query)
    }

    const refreshCurrentPage = () => {
      if (!refLazyTable.value) return
      refLazyTable.value.refreshCurrentPage()
    }

    const fetchData = async (params: TypeTableFetchApiParams) => {
      const { pageIndex, pageSize } = params

      // 异步数据
      if (props.fetchApi) {
        let res = (await props.fetchApi(params)) as any

        // 特殊兼容 b2b 平台返回
        if (res.status && res.data) res = res.data

        state.form.list = res?.data || []
        return res
      }

      // 静态数据
      const { list } = state.form
      const page = props.showPagination ? pageIndex : 1
      const totalSize = state.form.list.length
      const start = (page - 1) * pageSize
      const pageList = props.showPagination ? list.slice(start, start + pageSize) : list

      return {
        data: pageList,
        pageCount: Math.ceil(totalSize / pageSize),
        pageIndex: page,
        total: totalSize
      }
    }

    const drag = list => {
      emit('drag', list)
    }

    watch(
      () => props.data,
      () => {
        state.form.list = props.data as Record<string, any>[]
        refresh()
      }
    )

    provide('isPureList', isPureList)
    expose({ refresh, refreshCurrentPage, validate, clearValidate })

    return {
      styles,
      refForm,
      refLazyTable,
      attrs,
      on,
      slots,
      form,
      customRules,
      isPureList,
      Parent,
      fetchData,
      refresh,
      refreshCurrentPage,
      validate,
      clearValidate,
      drag
    }
  }
})
</script>
