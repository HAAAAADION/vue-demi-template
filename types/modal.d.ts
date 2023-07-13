// 弹窗注册配置
export interface TypeModalChildren {
  component: any
  key: string | symbol
  props: Record<string, any>
  on: Record<string, (...args: any) => void>
}

// 弹窗透传参数
export interface TypeModalShowProps {
  customKey?: string
}

// 关闭弹窗透传参数
export interface TypeModalHideProps {
  key?: string
  global?: boolean
}
