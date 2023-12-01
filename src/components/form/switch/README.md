# 开关控件

用法与 element-ui 基本一致, 支持所有原本支持的参数

## loading
> boolean

加载状态

原生框架中 vue3 支持, vue2 不支, 该组件抹平差异, vue2 支持 loading 状态

```vue
<bk-switch loading />
```

## title
> string

控件标题, 位于开关左边

```vue
<bk-switch title="我是标题" />
```

## tips
> string

提示文案, 位于开关下方

```vue
<bk-switch tips="我是提示" />
```

## lazy
> Promise

异步调用

配置该方法后, 点击 switch 组件后不会触发 change 事件, 改为调用自定义的`lazy`方法, 该方法异步过程中会自动修改内部的 loading 属性, 也可通过返回 boolean 值来触发更新 v-model

```vue
<bk-switch v-model="switch" :lazy="lazyLoad" />
```

```javascript
export default {
  data() {
    return {
      switch: false
    }
  },
  methods: {
    lazyLoad() {
      return new Promise(resolve => {
        setTimeout(() => {
          // this.switch = true // 可以自己维护状态
          resolve(true) // 也可以通过返回 boolean 值让组件内部自动更新 v-model
        }, 3000)
      })
    }
  }
}
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
