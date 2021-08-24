export const setFocus = el => {
  setTimeout(() => {
    el.focus()
  })
}

export default {
  mounted(el, { value }) {
    if (value === undefined || value !== false) {
      setFocus(el)
    }
  }
}
