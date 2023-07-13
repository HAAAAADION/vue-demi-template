import { ref } from 'vue-demi'
import Sortable from 'sortablejs'

export default () => {
  const cnSelected = ref<string | undefined>(undefined)

  const clearMultipleSelected = (list: HTMLElement[]) => {
    if (!cnSelected.value) return

    list.forEach(Sortable.utils.deselect)
    cnSelected.value = undefined
  }

  const initMultipleId = (el: HTMLElement) => {
    const childrens = [...el.children]
    childrens.forEach(e => {
      const idText = [...e.classList].find(e => e.startsWith('dragid_'))
      const id = idText?.split('_')?.[1]
      if (!id) return
      e.setAttribute('data-id', id)
      // e.classList.remove(idText)
    })
  }

  const getMultipleOptions = (el: HTMLElement) => {
    // 点击批量选择只支持表格
    return el.tagName === 'TBODY'
      ? {
          onDeselect: (evt: Sortable.SortableEvent) => {
            const { items } = evt
            clearMultipleSelected(items)
          },
          onSelect: (evt: Sortable.SortableEvent) => {
            if (el.tagName === 'TBODY') {
              const { item } = evt
              const cnText = [...item.classList].find(e => e.startsWith('drag_'))

              if (cnSelected.value === cnText) return

              const elClearList = el.querySelectorAll<HTMLElement>(`.${cnSelected.value}`)
              clearMultipleSelected([...elClearList])

              cnSelected.value = cnText

              const elSorts = el.querySelectorAll<HTMLElement>(`.${cnText}`)

              ;[...elSorts].forEach((e: HTMLElement) => {
                if (e === item) return
                Sortable.utils.select(e)
              })
            }
          }
        }
      : {}
  }

  return {
    clearMultipleSelected,
    initMultipleId,
    getMultipleOptions
  }
}
