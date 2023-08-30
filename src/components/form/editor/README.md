# 富文本组件

## 使用注意

#### 1. 鉴权
图片上传功能需要先鉴权, 阿里云鉴权问题请先阅读 [README.md](../upload/README.md)

复制文本后遍历内容, 将图片资源转存到我们的阿里云服务器, 转存使用的是另一个接口, 因此和鉴权一样, 也需要另外设置转存的接口地址

```javasciprt
import { BkEditor } from '@components/backend'

BkEditor.configCopyUploadApiUrl = 'http://vebk.test.gateway.huitravel.com/resource/image/upload'
```

#### 2. 基础配置文件
完成接口设置后, 需要将仓库中的 `/public/tinymce` 文件夹(语言/基础样式等)下载到项目中, 并放到静态目录根目录, 完成后即可使用

PS: 组件会自动透传所有参数, 因此有额外定制需求请先参考[文档](https://www.tiny.cloud/docs/tinymce/6/)

## 参数解释

##### preview
> boolean

是否开启预览

```vue
<editor v-model="content" :preivew="false" />
```
