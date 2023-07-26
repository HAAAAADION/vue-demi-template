// 阿里云配置缓存
export interface TypeOssCacheConfig {
  securityToken: string
  stsToken: string
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
  expiration: string
}

// ali-oss 实例化配置
export interface TypeOssConfig {
  stsToken: string
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
  timeout: string
}

// 上传方法额外透传参数
export interface TypeUploadOptions {
  service?: string
  headers: Record<string, any>
}

// el-upload 上传组件上传回调透传参数
export interface UploadRequestOptions {
  action: string
  method: string
  data: Record<string, string | Blob | [string | Blob, string]>
  filename: string
  file: File
  headers: Headers | Record<string, string | number | null | undefined>
  [key: string]: any
}

// ali oss 图床配置-图片缩放
export interface TypeUploadProcessResize {
  m?: string
  w?: string
  h?: string
  l?: string
  s?: string
  limit?: string
  color?: string
}

// ali oss 图床配置
export interface TypeUploadProcess {
  resize?: TypeUploadProcessResize
}
