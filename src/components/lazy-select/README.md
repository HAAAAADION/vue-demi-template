# 异步菜单选择器

用法与 `BkSelect` 组件类似, 支持异步请求数据, 一般不应直接在业务上使用, 应该先进行二次封装

## data

异步加载方法

```javascript
export default {
  methods: {
    async getList(params) {
      // 自定义数据获取
      
      // 返回带分页的配置后, 会监听列表滚动进行动态分页加载, keyword 筛选会请求接口进行
      return {
        pageIndex: number
        total: number
        data: object[]
      }
      
      // 返回一个纯数组列表后, 不会再进行滚动加载, keyword 筛选会在前端使用 Array.filter 进行
      return object[]
    }
  }
}
```

```vue
<bk-lazy-select :data="getList" />
```

## nameKey

展示渲染主键, 支持 string 和 Function

- 只传 string 则会在内部进行路径查找
- 传 Function 需要调用方自定义返回

```javascript
export default {
  methods: {
    getNameKey(item, index) {
      return string
    }
  }
}
```

```vue
<bk-lazy-select name-key="content.name" />
<bk-lazy-select :name-key="getNameKey" />
```

## rowKey

渲染唯一主键

用法与 nameKey 一致

## optionProps

子组件透传参数, 目前仅支持 optionProps.disabled 用于判断 Option 项是否需要禁用

支持 boolean 和 Function, Function 的用法与 nameKey 一致, 区别在于需要返回 boolean 类型

```vue
<bk-lazy-select :option-props="{ disabled: boolean | customFun(item, index) }" />
```

## readonly

知否只读, 为 true 只会显示文案, 不会显示组件

## placeholder

提示文案, 默认为 "请选择"

## notFoundContent

没有数据的文案展示, 默认为 "暂无数据"

## customList

自定义初始列表, 由于存在需要默认值的场景, 而 Select 需要 key value 对照

如果不传如则会自动进行接口请求, 如果接口请求消耗太大或在全局已经有列表数据, 则可自定义列表数据避免首次的默认请求

```vue
<bk-lazy-select
  :custom-list="[{ id: '123456', name: 'abcdef' }]"
  value="123456"
  row-key="id"
  name-key="name"
/>
```

## disabledCache

是否禁用列表缓存, 如果 `data` 方法没有返回分页配置, 则默认会进行本地数据缓存, 因此数据不会再进行刷新, 如果希望数据不进行缓存可通过该参数进行取消内部缓存

```vue
<bk-lazy-select :disabled-cache="false" />
```

## clearable

是否可以清除选中内容
