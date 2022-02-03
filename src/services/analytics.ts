import { ANALYTICS_ID, ANALYTICS_URL } from '@/configs/analytics'

import loadScript from '@/functions/loadScript'

declare global {
  interface Window {
    dataLayer?: Array<object>
  }
}

const getDataLayer = () => {
  return (window.dataLayer = window.dataLayer || [])
}

const gtag = (...params) => {
  const dataLayer = getDataLayer()
  dataLayer.push(params)
}

const init = async () => {
  await loadScript(ANALYTICS_URL)
  window.dataLayer = window.dataLayer || []
  gtag('js', new Date())
  gtag('config', ANALYTICS_ID)

  gtag({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
  // await loadScript(GTM_URL)
}

export default {
  getDataLayer,
  gtag,
  init
}
