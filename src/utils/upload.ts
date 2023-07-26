import axios, { AxiosResponse } from 'axios'
import OSS from 'ali-oss'
import Compressor from 'compressorjs'
import { TypeOssCacheConfig, TypeOssConfig, TypeUploadOptions } from '@/types/upload.d'
import { isEmpty, isImg } from '@/utils'
import BkUpload from '@/components/form/upload/index.vue'
import { ElMessage } from '@/components/element'

let ossCacheConfig = {} as TypeOssCacheConfig
let fetchCache = undefined as Promise<any> | undefined // OSS 签名请求缓存

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
  try {
    if (!isEmpty(ossCacheConfig)) {
      const curTime = Date.now()
      const expired = +new Date(ossCacheConfig.expiration)

      if (curTime < expired) throw new Error('stop')
    }

    fetchCache =
      fetchCache ||
      axios.get((BkUpload as any).configApiUrl, {
        headers: { Authorization: `Bearer ${getAuthToken()}` }
      })

    const res = (await fetchCache) as AxiosResponse<TypeOssCacheConfig>

    fetchCache = undefined

    ossCacheConfig = res.data
  } catch (err) {
    /** */
  }

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

export const filterOssURL = (url: string, process?: string) => {
  if (url.startsWith('http')) return url

  let newUrl = `https://${ossCacheConfig.bucket}.${ossCacheConfig.region}.aliyuncs.com/${url}`
  if (process) newUrl += `?x-oss-process=${process}`

  return newUrl
}

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
    return filterOssURL(url, process)
  }
}

export const compressImg = (file: File): Promise<File | Blob> => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.8,
      success(result) {
        resolve(result)
      },
      error(err) {
        reject(err.message)
      }
    })
  })
}

/**
 * 生成全局唯一标识（GUID）
 * @returns
 */
export const createGuid = () =>
  'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

/**
 * 创建文件保存路径
 * @param   {File|Blob} file      需要上传的文件
 * @param   {String=}   service   自定义保存位置
 * @return  {String}
 * */
export const createFileName = (file: File | Blob, service: string): string => {
  // TODO 测试不同环境
  return `${process.env.NODE_ENV}/tenant/${service}/${createGuid()}.${file.type.split('/')[1]}`
}

/**
 * 上传文件
 * @param   {File|Blob} file            需要上传的文件
 * @param   {Object}    options
 * @param   {Object}    options.service 自定义保存位置
 * @param   {Object}    options.headers 透传 header, 可用来决定是否开启 acl
 * @return  {Promise}
 * */
export const upload = async (file: File, options = {} as TypeUploadOptions) => {
  const { service = 'common', headers } = options

  try {
    const oss = await initAliOss()
    const compressFile = isImg(file.type) ? await compressImg(file) : file
    const fileName = createFileName(compressFile, service)

    return oss.put(fileName, compressFile, { headers })
  } catch (e: any) {
    ElMessage.error(e)
  }
}
