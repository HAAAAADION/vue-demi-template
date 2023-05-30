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
