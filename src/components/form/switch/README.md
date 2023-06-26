# 开关控件

用法与 element-ui 基本一致, 支持所有原本支持的参数

## title

控件标题, 位于开关左边

```vue
<bk-switch title="我是标题" />
```

## tips

提示文案, 位于开关下方

```vue
<bk-switch tips="我是提示" />
```

## slot

### default

依赖开关状态进行内容的显隐, 可用于表单校验字段调整

```vue
<bk-switch v-model="value">
  <div>
    <input />
  </div>
</bk-switch>
```
