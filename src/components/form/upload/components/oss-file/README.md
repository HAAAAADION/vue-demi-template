# 阿里云 OSS 文件展示控件

## 使用注意

该组件可单独使用, 阿里云鉴权问题请先阅读 [README.md](../../README.md)

## url

oss 文件地址, 如: 
- https://saas-files.oss-cn-shenzhen.aliyuncs.com/localhost/tenant/common/c2f90130b74948a38ce1ddf8cdd49c8e.png
- localhost/tenant/common/c2f90130b74948a38ce1ddf8cdd49c8e.png

带 http 后会直接展示, 否则会自动生成 OSS 可访问地址

## action

文件操作选择, 配置解释:

### preview

> 文件预览

图片文件会调用 element-ui 内置的图片预览效果, 其他类型文件会直接在浏览器打开

### download

> 文件下载

除图片类型文件支持动态下载外, 其他类型文件均采用浏览器直接打开, 部分文件浏览器不会触发下载, 如视频会在浏览器打开后自动播放


### edit

> 文件修改

供 `BkUpload` 组件使用

### remove 

> 删除文件

供 `BkUpload` 组件使用

## acl

是否开启加密解析, 默认不开启

## imgStyle

自定义图片尺寸, 默认为 `100px * 100px`, 如:

```vue
<bk-oss-file :img-style="{ width: `200px`, height: `200px` }" />
```

## fileList

预览列表, 不传则预览当前文件

## process

OSS 图床配置

## fit

确定图片如何适应容器框，同原生 object-fit, 支持参数: fill / contain / cover / none / scale-down

默认为 contain
