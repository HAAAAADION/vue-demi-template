import { isVue2, isVue3 } from 'vue-demi'

const pluginPreprocessor = (replaceList = []) => ({
  name: 'preprocessor-loader',
  enforce: 'pre',
  transform(code, path) {
    if (!replaceList.length) return code

    replaceList.forEach(e => {
      if (e.type === 'VUE2' && !isVue2) return
      if (e.type === 'VUE3' && !isVue3) return

      const match = typeof e.from === 'string' ? new RegExp(e.from, 'g') : e.from

      code = code.replace(match, e.to)
    })

    return code
  }
})

export default pluginPreprocessor

// 条件编译回调
const conditionalCompilationFn = (match, type, content) => {
  const emptyKey = isVue2 ? 'VUE3' : 'VUE2'
  return type === emptyKey ? '' : content
}

// 过滤替换配置
export const preprocessor = pluginPreprocessor([
  {
    from: /[ \t]*<!--[ \t]*#(?:ifndef|ifdef|if)[ \t]+(.*?)[ \t]*(?:-->|!>)(?:[ \t]*\n+)(.*?)[ \t]*<!(?:--)?[ \t]*#endif[ \t]*(?:-->|!>)(?:[ \t]*\n)?/gms,
    to: conditionalCompilationFn
  },
  {
    from: /[ \t]*(?:\/\/|\/\\*)[ \t]*#(?:ifndef|ifdef|if)[ \t]+([^\n*]*)(?:\\*(?:\\*|\/))?(?:[ \t]*\n+)?(.*?)[ \t]*(?:\/\/|\/\\*)[ \t]*#endif[ \t]*(?:\\*(?:\\*|\/))?(?:[ \t]*\n)?/gms,
    to: conditionalCompilationFn
  },
  {
    from: 'update:modelValue',
    to: 'input',
    type: 'VUE2'
  },
  {
    from: 'modelValue',
    to: 'value',
    type: 'VUE2'
  },
  {
    from: 'model-value',
    to: 'value',
    type: 'VUE2'
  },
  {
    from: /expose\(.*?\)/gms,
    to: '',
    type: 'VUE2'
  }
])
