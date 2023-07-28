import { ElMessage } from '@/components/element'

/**
 * 根据后缀或类型判断链接是否图片
 * @param   {String}  url
 * @return  {Boolean}
 * */
export const isImg = (url: any) => /[\/\.](jpg|jpeg|png|gif|bmp|webp|svg)$/.test(url.toLowerCase())

/**
 * 根据后缀名判断链接是否 gif
 * @param   {String}  url
 * @return  {Boolean}
 * */
export const isImgGif = (url: any) => /[\/\.]gif$/.test(url.toLowerCase())

/**
 * 根据后缀名判断链接是视频
 * @param   {String}  url
 * @return  {Boolean}
 * */
export const isVideo = (url: any) => /\.(mp4|webm|ogg)$/.test(url.toLowerCase())

/**
 * 判断是否函数
 * @param   {*}       data  检查内容
 * @return  {Boolean}
 * */
export const isFunction = (data: any) =>
  Object.prototype.toString.call(data) === '[object Function]'

/**
 * 判断内容是否为空(数字 0 !== 空)
 * @param   {*}       data  检查内容
 * @return  {Boolean}       是否为空
 * */
export const isEmpty = (data: any) => {
  if ([undefined, null].includes(data)) return true

  const type = Object.prototype.toString.call(data)
  switch (type) {
    case '[object String]':
      return !data
    case '[object Array]':
      return data.length <= 0
    case '[object Object]':
      return Object.keys(data).length <= 0
    case '[object Number]':
    default:
      return false
  }
}

/**
 * 对象安全查询
 * @param {Object}        object      查询对象
 * @param {String|Array}  path        路径
 * @param {*=}            defaultVal  默认文案
 **/
export const safeGet = (
  object: object,
  path?: string | Array<string | number>,
  defaultVal?: any
) => {
  if (!path) return object

  let newPath = []
  if (Array.isArray(path)) {
    newPath = path
  } else {
    newPath = path.replace(/\[/g, '.').replace(/\]/g, '').split('.')
  }
  return newPath.reduce((o: any = {}, k) => o[k], object) || defaultVal
}

export const messageLoading = async (text: string, fn: any) => {
  const msg = ElMessage.success({
    message: text,
    duration: 0
  })

  let res
  try {
    const method = fn instanceof Promise ? fn : fn()
    res = await method
  } catch (err) {
    res = err
  }

  msg.close()
  return res
}
