export default {
  mounted(el, { value }) {
    if (value === undefined || value !== false) {
      setTimeout(() => {
        el.focus()
      })
    }
  }
}
