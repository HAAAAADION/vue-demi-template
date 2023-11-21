import lodashSet from 'lodash.set'

/**
 * 递归合并 object(smoothObjectAssign 的内部方法)
 * @param   {Object}  obj     需要混合的 object
 * @param   {Object}  target  混合的目标 object
 * @param   {Array=}  path    当前 object 路径
 * @return  {Object}
 * */
const _loopAssign = (obj, target = {}, path = []) => {
  Object.keys(obj).forEach(e => {
    if (Object.prototype.toString.call(obj[e]) === '[object Object]') {
      _loopAssign(obj[e], target, [...path, e])
    } else {
      lodashSet(target, [...path, e].filter(e => e).join('.'), obj[e])
    }
  })
}

/**
 * 平滑深度合并对象
 * @param   {Object}  args  任意数量的需要进行合并的 object
 * @return  {Object}
 * @example
 *  obj1: { a: { aa: 'aa' } }
 *  obj2: { a: { bb: 'bb' } }
 *  smoothObjectAssign(obj1, obj2) => { a: { aa: 'aa', bb: 'bb' } }
 * */
export const smoothObjectAssign = (...args) => {
  const target = {}

  args.forEach(e => {
    _loopAssign(e, target)
  })

  return target
}
