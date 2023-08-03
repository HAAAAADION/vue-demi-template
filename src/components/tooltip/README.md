# 提示组件

解决 ElTooltip 无法判断文本是否溢出再展示提示效果 

## 使用方法

原始溢出判断文本只支持 `纯文本字符串`, 与 ElTooltip 略有差异, 其他基本一致

```vue
<bk-tooltip content="测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试">
  <template #content>
    <div>测试1</div>
    <div>测试2</div>
  </template>
</bk-tooltip>
```

## 参数解释

##### content
> string | slot

原始文本, 仅支持字符串, 如不需要判断溢出隐藏则与 ElTooltip 一致, 可自定义 slots.default

目前计算是否需要展示提示的逻辑是通过将 `文案长度/高度` 与 `实际展示的长度/高度` 进行对比计算出的, 因此如果采用 slots.default 的方式设置 content 可能会造成计算失败(比如使用 div 等块级元素), 可通过  always = true 进行固定展示提示

```vue
<bk-tooltip>
  <template #content>
    <div>测试1</div>
    <div>测试2</div>
  </template>
  
  <!-- 可自定义 html 格式, 无法自动计算是否需要提示 -->
  <div>
    <div>
      测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试
    </div>
  </div>

  <!-- 可自动计算是否需要提示 -->
  <span>测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试</span>
</bk-tooltip>
```

#### line
> number | string

溢出行数

```vue
<bk-tooltip line="1" content="测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试" />
```

#### always
> boolean

是否总是展示提示, 默认为 false

```vue
<bk-tooltip always line="1" content="测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试" />
```

#### width

自定义溢出宽度

## slot

#### default

与 props.content 功能一样, 可自定义展示 html 样式, 但使用 `块级元素` 会导致自动计算溢出隐藏无法生效

#### content

与 ElTooltip 一样, 业务可自定义 slots.content 内容进行多样化设置提示内容, 如不设置, 则默认使用 props.content 参数进行展示
