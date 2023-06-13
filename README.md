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

## 发布
1. 运行 `npm run build`
2. 更新 package.json 的 version
3. 更新 web-types.json
4. 运行 `npm publish`

## 支持组件
- [x] input
- [x] select
- [ ] upload
- [x] table

## TODO
- 打包优化
- 多入口打包
- 动态生成 ts 并关联发布
- 条件编译

## FAQ
1. vue2 版本如何调试?
- 结论: 目前不可以
- 由于 vue2 版本的代码是根据 vue3 的代码进行构建的, 所以无法在开发阶段进行 vue2 版本的调试, 可能会出现编译前由于 vue3 的特性而导致 vue2 报错
- 且本地使用 vite 运行, 如果想要先构建 vue2 代码, 再在代码上引用构建后的代码进行测试也会出现一些不兼容的情况

