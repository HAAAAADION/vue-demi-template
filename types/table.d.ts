import { RuleItem } from 'async-validator'

export type TypeTableRules = Record<string, RuleItem | RuleItem[]>

// 构建表单规则函数入参
export interface TypeTableGetRulesParams {
  list: any[]
  ruleKey?: string[]
  rules?: TypeTableRules
}

// 表格异步查找方法入参
export interface TypeTableFetchApiParams {
  pageIndex: number
  pageSize: number
  [key: string]: any
}

// 表格异步查找方法
export type TypeTableFetchApi = (params: TypeTableFetchApiParams) => Promise<{
  data: any[]
  pageCount: number
  pageIndex: number
  total: number
}>
