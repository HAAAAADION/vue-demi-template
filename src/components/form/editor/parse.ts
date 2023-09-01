import styles from './index.module.scss'

export const parseImg = () => {
  const wrap = document.querySelector(`.${styles.editor} iframe`)
  const container = document.querySelector(`.${styles.container}`)
  const editor = wrap.contentDocument || wrap.contentWindow.document
  const imgs = editor.querySelectorAll('img') || []

  if (!imgs.length) return

  imgs.forEach(e => {
    if (parseInt(e.getAttribute('width')) > container.clientWidth) {
      e.removeAttribute('height')
    }
  })
}
