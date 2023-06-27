// 内部 state
export interface TypeLazySelectState {
  loading: boolean
  keyword?: string
  list: Record<string, any>[]
  originList: Record<string, any>[]
  isTotalList: boolean
  pagination: {
    page: number
    size: number
    total: number
  }
  elList?: HTMLDivElement
}

// 请求接口基础参数
export interface TypeLazySelectFetchBasisParams {
  page?: number
  size?: number
  ids?: Array<string | number>
  id?: Array<string | number>
}

// 异步请求方法
export type TypeLazySelectFetchFunction = (item: {
  pageIndex: number
  pageSize: number
  keyWord?: string
  [key: string]: any
}) => any

// nameKey rowKey 方法
export type TypeLazySelectKeyFunction = (item: any, index?: number) => any
