export const Locations = {
  HEAD: 'HEAD',
  BODY: 'BODY'
}

export default function loadScript(src: string, location = Locations.HEAD): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) resolve()

    const el = document.createElement('script')
    el.type = 'text/javascript'
    el.async = true
    el.src = src

    const onLoadHandler = () => {
      removeListeners()
      resolve()
    }

    const onErrorHandler = () => {
      removeListeners()
      reject()
    }

    const onAbortHandler = () => {
      removeListeners()
      reject()
    }

    const removeListeners = () => {
      el.removeEventListener('load', onLoadHandler)
      el.removeEventListener('error', onErrorHandler)
      el.removeEventListener('abort', onAbortHandler)
    }

    const addListeners = () => {
      el.addEventListener('load', onLoadHandler)
      el.addEventListener('error', onErrorHandler)
      el.addEventListener('abort', onAbortHandler)
    }

    addListeners()

    if (location === Locations.HEAD) {
      document.head.appendChild(el)
    } else if (location === Locations.BODY) {
      document.head.appendChild(el)
    } else {
      reject()
    }
  })
}
