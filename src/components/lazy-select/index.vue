<template>
  <div :class="styles.lazy">
    <div v-if="readonly">
      <div v-for="(item, index) in list" :key="getRowKey(item, index)">
        {{ getRender(item, index) }}
      </div>
    </div>
    <el-select
      v-else
      ref="refSelect"
      v-bind="attrs"
      remote
      filterable
      :model-value="modelValue"
      :clearable="clearable"
      :multiple="isMultiple"
      :remote-method="onSearch"
      :placeholder="placeholder || i18n('cb.select') || '请选择'"
      class="width-full"
      @change="onChange"
      @visible-change="onToggle"
    >
      <el-option
        v-for="(item, index) in list"
        :key="getRowKey(item, index)"
        :value="getRowKey(item, index)"
        :label="getRender(item, index)"
        :disabled="isFunction(optionDisabled) ? optionDisabled(item, index) : !!optionDisabled"
      >
        <slot :row="item" :$index="index" />
      </el-option>
      <el-option v-show="loading" disabled value="loading">
        <i class="el-icon-loading" />
      </el-option>
      <el-option v-if="!loading && !list.length" disabled value="notfound">
        {{ notFoundContent || i18n('cb.notFoundContentForSelect') || '暂无数据' }}
      </el-option>
    </el-select>
  </div>
</template>

<script lang="ts">
import { ref, reactive, toRefs, computed, watch, defineComponent, PropType } from 'vue-demi'
import {
  TypeLazySelectState,
  TypeLazySelectFetchBasisParams,
  TypeLazySelectFetchFunction,
  TypeLazySelectKeyFunction
} from '@/types/lazy-select.d'
import { isFunction, isEmpty, safeGet } from '@/utils'
import { i18n } from '@/utils/i18n'
import { ElSelect } from '@/components/element'
import styles from './index.module.scss'

export default defineComponent({
  name: 'BkLazySelect',
  components: {
    ElSelect
  },
  emits: ['update:modelValue', 'change'],
  props: {
    modelValue: {
      type: null,
      default: undefined
    },
    // 异步加载方法
    data: {
      type: Function as PropType<TypeLazySelectFetchFunction>,
      required: true
    },
    // 展示渲染主键
    nameKey: {
      type: [String, Function] as PropType<string | TypeLazySelectKeyFunction>,
      required: true
    },
    // 渲染唯一主键
    rowKey: {
      type: [String, Function] as PropType<string | TypeLazySelectKeyFunction>,
      required: true
    },
    // 子组件透传参数
    optionProps: {
      type: Object,
      default: () => ({})
    },
    readonly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: undefined
    },
    // 没有数据的文案展示
    notFoundContent: {
      type: String,
      default: undefined
    },
    // 自定义 select 列表
    customList: {
      type: Array as PropType<Record<string, any>[]>,
      default: undefined
    },
    // 是否禁用列表缓存
    disabledCache: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { attrs, emit, expose }): any {
    const refSelect = ref<any>(null)

    const state = reactive<TypeLazySelectState>({
      loading: false,
      keyword: undefined,
      list: [],
      originList: [],
      isTotalList: false, // 是否全量查询的数据
      pagination: {
        page: 1,
        size: 10,
        total: 0
      },
      elList: undefined
    })

    const { loading, list } = toRefs(state)

    const isMultiple = computed(() => Array.isArray(props.modelValue))
    const optionDisabled = computed(() => props.optionProps?.disabled)
    // 是否到最大上限
    const isTotal = computed(() => {
      const { page, size, total } = state.pagination
      return page * size >= total
    })

    /** ******************
     *      methods     *
     * ******************/
    const getRender = (item: Record<string, any>, index?: number) => {
      return isFunction(props.nameKey)
        ? (props.nameKey as TypeLazySelectKeyFunction)(item, index)
        : safeGet(item, props.nameKey as string)
    }

    const getRowKey = (item: Record<string, any>, index?: number) => {
      return isFunction(props.rowKey)
        ? (props.rowKey as TypeLazySelectKeyFunction)(item, index)
        : safeGet(item, props.rowKey as string)
    }

    /**
     * 静态数据过滤处理
     * */
    const formatStaticList = () => {
      // TODO 数据量大还需要检查上一次的结果与本次查询的条件是否匹配, 如果没有变化就不需要进行 filter 处理
      state.list = state.originList.filter(
        (e, i) => !state.keyword || ~getRender(e, i)?.indexOf(state.keyword)
      )

      return state.list
    }

    /**
     * 异步请求接口数据
     * @param {Object}  params  透传参数
     * */
    const fetchData = async (params = {} as TypeLazySelectFetchBasisParams) => {
      try {
        const { page: oPage, size: oSize } = state.pagination
        const { page: nPage, size: nSize, ...query } = params
        const page = nPage || oPage
        const size = nSize || oSize

        const postData = {
          ...query,
          pageIndex: page,
          pageSize: size,
          keyWord: state.keyword
        }

        state.loading = true
        const res = await props.data(postData)
        // 记录是否请求所有数据
        state.isTotalList = !props.disabledCache && !res?.pageIndex

        const list = (res?.pageIndex ? res?.data : res) || []
        // 如果请求了所有数据, 需要缓存原始列表数据, 为做静态 filter
        if (state.isTotalList) state.originList = list

        state.list = page <= 1 ? list : state.list.concat(list)

        Object.assign(state.pagination, {
          page: res?.pageIndex || page,
          total: res?.total || 0
        })

        if (isTotal.value) removeListener()
      } catch (err) {
        // this.$message.error(err?.msg || '调用失败，请稍后再试')
      }

      state.loading = false
      return state.list
    }

    const loadData = (params: TypeLazySelectFetchBasisParams) => {
      // 如果上一次请求了所有数据, 则不请求接口, 改为本地过滤
      if (state.isTotalList) {
        return formatStaticList()
      } else {
        return fetchData(params)
      }
    }

    const onScroll = (e: any) => {
      const target = e.target
      const { page } = state.pagination

      // 是否到底
      const isEnd = target.scrollTop + target.offsetHeight >= target.scrollHeight

      if (!state.loading && !isTotal.value && isEnd) {
        loadData({ page: page + 1 })
      }
    }

    const addListener = () => {
      let refPopper

      // #ifdef VUE3
      refPopper = refSelect.value.popperPaneRef
      // #endif
      // #ifdef VUE2
      refPopper = refSelect.value.popperElm
      // #endif

      state.elList = refPopper?.querySelector('.el-select-dropdown__wrap')

      if (!state.elList) return
      state.elList.addEventListener('scroll', onScroll)
    }

    const removeListener = () => {
      if (!state.elList) return
      state.elList.removeEventListener('scroll', onScroll)
      state.elList = undefined
    }

    const init = () => {
      if (Array.isArray(props.customList) && props.customList?.length && !state.list.length) {
        state.list = [...props.customList]
      } else {
        if (isEmpty(props.modelValue) || state.list.length) return
        const ids = isMultiple.value ? props.modelValue.join(',') : props.modelValue

        loadData({
          page: 1,
          size: 99,
          id: ids
        })
      }
    }

    const onSearch = (val?: string) => {
      state.keyword = val
      loadData({ page: 1 })
    }

    const onChange = (val: any) => {
      emit('update:modelValue', val)

      const cur = isMultiple.value
        ? state.list.filter(e => val.includes(getRowKey(e)))
        : state.list.find(e => val === getRowKey(e))

      emit('change', cur || val)
    }

    const onToggle = (visible: boolean) => {
      if (!visible) return

      removeListener()
      addListener()
      onSearch()
    }

    const refresh = () => {
      state.isTotalList = false
      loadData({ page: 1 })
    }

    const clear = () => {
      state.isTotalList = false
      state.list = []
      state.pagination = {
        page: 1,
        size: 10,
        total: 0
      }
    }

    expose({ refresh, clear })

    watch(
      () => props.modelValue,
      () => init()
    )

    // created
    init()

    return {
      styles,
      attrs,
      refSelect,
      isMultiple,
      optionDisabled,
      isTotal,
      loading,
      list,
      i18n,
      isFunction,
      onSearch,
      onToggle,
      onChange,
      getRender,
      getRowKey,
      refresh,
      clear
    }
  }
})
</script>
