// 状态/文案
export type TypeSelectStatus = string[] | number[] | Record<string | number, any>

// 下拉列表数据
export type TypeSelectData = Array<{
  code: string | number
  name: string | number
}>
