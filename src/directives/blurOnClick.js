function setBlur() {
  document.activeElement?.blur()
}

export default {
  beforeMount(el) {
    el.addEventListener('click', setBlur)
  },
  beforeUnmount(el) {
    el.removeEventListener('click', setBlur)
  }
}
