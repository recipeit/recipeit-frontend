export const setFocus = (el: HTMLElement) => {
  setTimeout(() => {
    el.focus()
  })
}

export default {
  mounted(el: HTMLElement, { value }) {
    if (value === undefined || value !== false) {
      setFocus(el)
    }
  }
}
