# 阿里云 OSS 文件上传控件

## 使用注意

由于 OSS 生成链接需要鉴权, 鉴权的配置需要从后端获取, 虽然内部已经集成了接口请求的逻辑, 但由于不同项目之间的接口不一致, 因此在使用前需要先设置鉴权接口的 API 地址, 如: 

```javasciprt
window.configApiUrl = 'http://vebk.test.gateway.huitravel.com/resource/sts/assumerole'
```

业务项目中可能存在多个不同 OSS 环境的情况, 如: vebk.web, 会存在`普通环境`和`梅州环境`, 而组件库是无法获取到具体业务的环境变量的, 因此业务可以通过显式定义`OSSHost`字段来区分, 如:

PS: 非上述情况的可以忽略该配置
```javascript
window.OSSHost = 'https://saas-files.oss-cn-shenzhen.aliyuncs.com'
```

## readonly

是否只读, 为 true 相当于禁用上传/编辑/删除功能

```vue
<bk-upload readonly />
```

## service

业务类型, 用于构建 OSS 存储路径, 默认为 `common`

```javascript
// 构建的路径规则大致如下
https://${prefix}.aliyuncs.com/${service}/${url}
```

## max

最大文件上传数量, 默认为 1

```vue
<bk-upload :max="1" />
<bk-upload max="1" />
```

## imgStyle

上传控件的尺寸, 单位 `px`, 默认为 100px * 100px

```vue
<bk-upload :img-style="{ width: '100px', height: '100px' }" />
```

## acl

上传是否开启私有访问

同一个组件不能私有和公开的混在一起用

## accept

支持文件上传的类型, 默认全支持

```vue
<bk-upload accept="image/png,image/gif" />
<bk-upload :accept="['image/png', 'image/gif']" />
```

## size

支持文件上传的最大容量限制, 单位为 `kb`

```vue
<bk-upload :size="10" />
```

## drag
> boolean

是否开启拖拽, 默认为 true
