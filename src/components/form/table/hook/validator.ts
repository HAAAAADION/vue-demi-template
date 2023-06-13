import { ref, Ref } from 'vue-demi'
import { RuleItem, ValidateError } from 'async-validator'
import { safeGet, isEmpty } from '@/utils'
import { TypeTableGetRulesParams } from '@/types/table.d'

export default () => {
  const ruleConfig = ref([])

  /**
   * 构建列表规则
   * @param   {Array}   list  列表
   * @param   {String}  key   校验字段
   * @param   {Number}  index 当前下标
   * @return  {String}
   * */
  const buildRuleField = (list: any[], key: string, index: number): string | undefined => {
    const cur = list[index]
    const search = /([^\\.].+)\.|^((?!\.).)*$/g.exec(key)
    const path = search?.[1] || search?.[0]
    const isExist = safeGet(cur, path)
    return isExist || path === key ? `list[${index}].${key}` : undefined
  }

  /**
   * 获取列表校验规则
   * @desc   默认只校验必填, 业务可通过设置 rules 增加自定义校验规则(与正常的表单校验设置一致)
   * @param   {Object}  options
   * @param   {Array}   options.list    列表
   * @param   {Array=}  options.ruleKey 快速构建必填规则的字符串数组, ['name', 'age']
   * @param   {Array=}  options.rules   需要自定义的规则数组, 与 element-ui 的校验规则一致, 同名以 rules 为准
   * @return  {Object}
   * */
  const getListRules = (
    options = {} as TypeTableGetRulesParams
  ): Record<string, RuleItem | RuleItem[]> => {
    const { list = [], ruleKey = [], rules } = options

    const customRuleKeys = Object.keys(rules || {})
    const totalKeys = [...ruleKey, ...customRuleKeys]

    const config = list.reduce((res, item, index) => {
      totalKeys.forEach(k => {
        const key = buildRuleField(list, k, index)
        if (!key) return res

        // 业务自定义校验规则
        const customRules = rules?.[k]

        res[key] = customRules || [
          {
            required: true,
            message: `请输入 ${k}`,
            trigger: ['change', 'blur']
          }
        ]
      })
      return res
    }, {})

    // 缓存动态构建的规则
    ruleConfig.value = config
    return config
  }

  /**
   * 获取列表 key prop name
   * @param   {Array|String}  key   校验字段
   * @param   {Number}        index 当前数据下标
   * @return  {Array}
   * */
  const getFieldKeys = (key = [] as string | string[], index?: number) => {
    const keys = Array.isArray(key) ? key : [key]
    const regex = new RegExp(`list\\[${isEmpty(index) ? '.+' : index}\\]\\.(${keys.join('|')})`)
    return Object.keys(ruleConfig.value).filter(e => regex.test(e))
  }

  /**
   * 清除列表异常校验
   * @param {Ref}           ref   表单 ref
   * @param {Array|String=} key   校验字段
   * @param {Number=}       index 当前数据下标
   * */
  const clearListValidate = (ref: Ref, key?: string | string[], index?: number) => {
    if (!ref.value) return
    ref.value.clearValidate(getFieldKeys(key, index))
  }

  /**
   * 列表校验
   * @param {Ref}           ref   表单 ref
   * @param {Array|String=} key   校验字段
   * @param {Number=}       index 当前数据下标
   * */
  const validateField = (ref: Ref, key?: string | string[], index?: number) => {
    if (!ref?.value) return

    return new Promise((resolve, reject) => {
      if (isEmpty(key)) {
        ref.value.validate((valid: boolean, error: ValidateError[]) => {
          if (!valid) reject(error)
          else resolve(null)
        })
        return
      }

      ref.value.validateField(getFieldKeys(key, index), (err: ValidateError[]) => {
        if (err) reject(err)
        else resolve(null)
      })
    })
  }

  return {
    getListRules,
    validateField,
    clearListValidate
  }
}
