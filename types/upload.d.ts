// 阿里云配置缓存
export interface TypeOssCacheConfig {
  securityToken: string
  stsToken: string
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
}

// oss config
export interface TypeOssConfig {
  stsToken: string
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
  timeout: string
}
