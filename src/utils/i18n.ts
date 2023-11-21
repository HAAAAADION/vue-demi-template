export let i18n = (val: string, def?: string) => def

export const setI18n = fn => {
  if (typeof fn !== 'function') return
  i18n = fn
}
