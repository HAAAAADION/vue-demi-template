# 通用弹窗模块

通用全局弹窗管理组件, 支持 `按需加载` 和 `全局注册` 的方式

## 使用方法

在项目根节点引入组件并渲染

```vue
<bk-modal ref="refModal" />
```

### 如何调用

#### vue3
在 vue3 环境下, 会在 onMounted 生命周期下全局 globalProperties 下注册 `$modal` 函数供业务调用: 

```vue
<script setup lang="ts">
import { getCurrentInstance } from 'vue'

const { proxy }: any = getCurrentInstance()

proxy.$modal.show(MODAL_KEY)
</script>
```

#### vue2

在 vue2 环境下, 项目需要手动注册全局方法供业务使用:

```vue
<template>
  <bk-modal ref="refModal" />
</template>

<script>
import { BkModal } from '@component/backend'
import Vue from 'vue'

export default {
  name: 'App',
  components: {
    BkModal
  },
  mounted() {
    Vue.prototype.$modal = {
      show: this.$refs.refModal.show,
      hide: this.$refs.refModal.hide
    }
  }
}
</script>
```

## 如何注册弹窗

#### 全局注册

在根节点渲染 `<bk-modal>` 时传入 `list` 参数即可:

```vue
<script setup lang="ts">
// import...

const globalModalList = ref({
  test: () => import('./components/modal.vue')
})

const { proxy }: any = getCurrentInstance()
const openModal = () => {
  proxy.$modal.show('test', {
    name: 'xiaoming'
  })
}
</script>

<template>
  <div @click="openModal">打开弹窗</div>
  <bk-modal :list="globalModalList" />
</template>
```

#### 按需注册调用

各业务各自管理属于自己的弹窗组件, 避免全局污染: 

```vue
<script setup lang="ts">
// import...
import TestModal from './components/test-modal.vue'

const { proxy }: any = getCurrentInstance()
const openModal = () => {
  proxy.$modal.show(TestModal, {
    name: 'xiaoming'
  })
}
</script>

<template>
  <div @click="openModal">打开弹窗</div>
</template>
```

## 具体调用方法

####  打开弹窗

调用 `$modal.show` 后会返回当前弹窗的映射 key 值, 业务可自定义后续管理操作

如果是采用 `按需注册调用` 的方式, 返回的则是一个全局唯一的 `Symbol` 值

```javascript
/**
 * @param   {String | ComponentOptions}    [Key, Component]  弹窗映射主键或具体组件
 * @param   {Object=}                      props             透传参数
 * @param   {String=}                      props.customKey   与前面的 key 不同, 这个字段是用于标识具体弹窗, 例如同一场景可能需要弹窗两个相同类型的全局弹窗, 而关闭时不能一次全部关闭, 该字段就是用于区别这种情况
 * @param   {Object=}                      emit              定义子组件的 emit 回调
 * @return  {Promise<Symbol>}                                当传入的第一参数为 Component 时, 组件内部会生成全局唯一的 symbol 值用于标识弹窗, 相当于 `key`, 指定关闭时候需要根据返回的 key 进行关闭
 * */
const key = await ${instance}.$modal.show(key || Component, props, emit)
```

#### 关闭弹窗
```javascript
/**
 * @param {Object=}   props               透传参数
 * @param {String=}   props.key           对应关闭的弹窗映射 key, 不传则默认关闭最顶层弹窗
 * @param {String=}   props.global        是否关闭所有弹窗
 * */
${instance}.$modal.show(props)
```
