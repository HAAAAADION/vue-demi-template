# Icon 组件 

主要为解决 vue2 和 vue3 的 icon 调用不统一问题, 目前调以 element-plus 为主, 按需建立映射表

## icon 列表
- [vue2](https://element-plus.gitee.io/zh-CN/component/icon.html)
- [vue3](https://element.eleme.io/#/zh-CN/component/icon)

## 用法
1. 建立 icon 映射, 目前采用按需新增, 需要用到对应的 icon 时增量添加即可. 需要注意的时 key 值命名需要以 **vue3** 为主

```javascript
 // #ifdef VUE3
    ;(async () => {
      const { ZoomIn, Download, Edit, Delete, VideoPlay, Document, Plus } = await import(
        '@element-plus/icons-vue'
      )
      iconList.value = {
        ZoomIn
      }
    })()
    // #endif
    // #ifdef VUE2
    iconList.value = {
      ZoomIn: 'el-icon-zoom-in'
    }
    // #endif
```

2. 调用组件

```vue
<template>
  <icon name="ZoomIn" />
</template>
```
