import axios, { AxiosResponse } from 'axios'
import OSS from 'ali-oss'
import { isEmpty } from '@/utils'
import { TypeOssCacheConfig, TypeOssConfig } from '@/types/upload.d'
import BkOssFile from '@/components/oss-file/index.vue'

let ossCacheConfig = {} as TypeOssCacheConfig

const getAuthToken = () => {
  let authToken

  // #ifdef VUE3
  authToken = localStorage.getItem('token')
  // #endif
  // #ifdef VUE2
  authToken = document?.cookie
    ?.split('; ')
    ?.find(e => e.startsWith('Authorization'))
    ?.split('=')?.[1]
  // #endif

  return authToken
}

const getOssConfig = async (): Promise<TypeOssConfig> => {
  const res = (await axios.get((BkOssFile as any).uploadUrl, {
    headers: { Authorization: `Bearer ${getAuthToken()}` }
  })) as AxiosResponse<TypeOssCacheConfig>

  ossCacheConfig = res.data

  return {
    stsToken: ossCacheConfig.securityToken,
    region: ossCacheConfig.region,
    accessKeyId: ossCacheConfig.accessKeyId,
    accessKeySecret: ossCacheConfig.accessKeySecret,
    bucket: ossCacheConfig.bucket,
    timeout: '120s'
  }
}

export const initAliOss = async () => {
  const config = await getOssConfig()

  return new OSS({
    ...config,
    refreshSTSToken: async () => {
      const info = await getOssConfig()
      return {
        accessKeyId: info.accessKeyId,
        accessKeySecret: info.accessKeySecret,
        stsToken: info.stsToken
      }
    }
  })
}

export const filterOssURL = (url: string) =>
  url.startsWith('http')
    ? url
    : `https://${ossCacheConfig.bucket}.${ossCacheConfig.region}.aliyuncs.com/${url}`

/**
 * 鉴权阿里云文件地址
 * @param   {String}          url     文件路径
 * @param   {Object=}         options 自定义配置
 * @return  {Promise<String>}
 * */
export const formatOssUrl = async (url: string, options = {}) => {
  const { acl, process } = options as { acl?: boolean; process?: string }

  if (acl) {
    const ins = await initAliOss()
    return ins.signatureUrl(url, {
      expires: 3600,
      process
    })
  } else {
    if (isEmpty(ossCacheConfig)) await getOssConfig()
    return filterOssURL(url)
  }
}
