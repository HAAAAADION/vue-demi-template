import axios, { AxiosResponse } from 'axios'
import OSS from 'ali-oss'
import Compressor from 'compressorjs'
import {
  TypeOssCacheConfig,
  TypeOssConfig,
  TypeUploadOptions,
  TypeUploadProcess
} from '@/types/upload.d'
import { isEmpty, isImg, isImgGif } from '@/utils'
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

export const getOssConfig = async (): Promise<TypeOssConfig> => {
  try {
    if (!isEmpty(ossCacheConfig)) {
      const curTime = Date.now()
      const expired = +new Date(ossCacheConfig.expiration)

      if (curTime < expired) throw new Error('stop')
    }

    fetchCache =
      fetchCache ||
      axios.get(window.configApiUrl, {
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

/**
 * 构建阿里云图床请求参数
 * @param   {Object} process  图床配置
 * @return  {String}
 * */
export const buildProcess = (process?: TypeUploadProcess) => {
  if (isEmpty(process)) return

  const text = Object.keys(process)
    .filter(e => !isEmpty(process?.[e]))
    .map(
      e =>
        `${e},${Object.keys(process?.[e])
          .map(v => `${v}_${process?.[e]?.[v]}`)
          .join(',')}`
    )
    .join('/')

  if (text) return `image/${text}`
}

export const filterOssURL = (url: string, process?: TypeUploadProcess) => {
  if (url.startsWith('http')) return url

  let newUrl = `${window.OSSHost || import.meta.env.VITE_APP_OSS_HOST}/${url}`

  const processText = isImg(url) && buildProcess(process)
  if (processText) newUrl += `?x-oss-process=${processText}`

  return newUrl
}

/**
 * 鉴权阿里云文件地址
 * @param   {String}          url     文件路径
 * @param   {Object=}         options 自定义配置
 * @return  {Promise<String>}
 * */
export const formatOssUrl = async (url: string, options = {}) => {
  const { acl, process } = options as { acl?: boolean; process?: TypeUploadProcess }

  if (acl) {
    const ins = await initAliOss()
    return ins.signatureUrl(url, {
      expires: 3600,
      process: isImg(url) ? buildProcess(process) : undefined
    })
  } else {
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
    const useFile =
      !(file instanceof File) && file.type ? new File([file], file.name, { type: file.type }) : file

    const oss = await initAliOss()
    const compressFile =
      isImg(useFile.type) && !isImgGif(useFile.type) ? await compressImg(useFile) : useFile
    const fileName = createFileName(compressFile, service)

    return oss.put(fileName, compressFile, { headers })
  } catch (e: any) {
    ElMessage.error(e)
  }
}

export const multipleUpload = (list: string[]) => {
  return axios.post(window.configCopyUploadApiUrl, list, {
    headers: { Authorization: `Bearer ${getAuthToken()}` }
  })
}
