const setBlur = () => {
  const activeElement = document.activeElement as HTMLElement
  activeElement?.blur()
}

export default {
  beforeMount(el: HTMLElement) {
    el.addEventListener('click', setBlur)
  },
  beforeUnmount(el: HTMLElement) {
    el.removeEventListener('click', setBlur)
  }
}
