# vue3 + vue2 公共组件仓库模版

## 目录结构
```
.
 ⌞src       // 组件文件
 ⌞test      // 本地测试文件, 不会参与打包
 ⌞types     // 组件类型, 不会参与打包
```


## 开发
开发期间均采用 vue3 的开发规范进行开发, 运行 `npm run dev` 即可启动本地服务

测试组件效果可修改 `/test/App.vue` 文件进行测试组件实际效果

## 条件编译
部分场景需要根据 vue2 和 vue3 进行代码区分, 使用方法与 uni-app 类似: 
```javascript
// #ifdef VUE3
console.log('vue3')
// #endif
// #ifdef VUE2
console.log('vue2')
// #endif
```

```vue
<template>
<!--#ifdef VUE3-->
<div>vue3</div>
<!--#endif-->
<!--#ifdef VUE2-->
<div>vue2</div>
<!--#endif-->
</template>
```

## 发布
1. 运行 `npm run build`
2. 更新 package.json 的 version
3. 更新 web-types.json
4. 运行 `npm publish`

## 支持组件

- 表单组件

- [x] [input](./src/components/form/input/README.md) 文本框组件
- [x] [select](./src/components/form/select/README.md) 下拉菜单组件
- [x] [upload](./src/components/form/upload/README.md) 文件上传组件
- [x] [table](./src/components/form/table/README.md) 表单表格组件
- [x] [switch](./src/components/form/switch/README.md) 开关组件


- 普通组件

- [x] [draggable](./src/components/draggable/README.md) 拖拽组件
- [x] [oss-file](./src/components/form/upload/components/oss-file/README.md) oss 文件预览组件
- [x] [lazy-select](./src/components/lazy-select/README.md) 异步加载下拉菜单组件
- [x] [lazy-table](./src/components/lazy-table/README.md) 异步加载表格组件
- [x] [modal](./src/components/modal/README.md) 弹窗组件
- [x] [tooltip](./src/components/tooltip/README.md) 文本省略提示组件

## TODO
- ~~打包优化~~
- ~~多入口打包~~
- [ ] 动态生成 ts 并关联发布
- [x] 条件编译

## FAQ
1. vue2 版本如何调试?
- 结论: 目前不可以
- 由于 vue2 版本的代码是根据 vue3 的代码进行构建的, 所以无法在开发阶段进行 vue2 版本的调试, 可能会出现编译前由于 vue3 的特性而导致 vue2 报错
- 且本地使用 vite 运行, 如果想要先构建 vue2 代码, 再在代码上引用构建后的代码进行测试也会出现一些不兼容的情况

