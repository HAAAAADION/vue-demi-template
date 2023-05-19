# 表单 Input

封装 `<Input />` `<InputNumber />`

整个用法和 element 保持一致, 新增 `readonly` `number` `textarea` 配置

## readonly
> 是否只读

与官方提供的 `readonly` `disabled` 不同

这里的 readonly 只会渲染内容本身, 不会渲染 `<Input />` 组件, readonly 比 disabled 优先级要高

## number
替换为 `<InputNumber />` 组件

## textarea
替换为 `<Input type="textarea" />` 组件
