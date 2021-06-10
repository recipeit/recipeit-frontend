import { ANALYTICS_ID, ANALYTICS_URL } from '@/configs/analytics'
import loadScript from '@/functions/loadScript'

export default {
  getDataLayer() {
    return (window.dataLayer = window.dataLayer || [])
  },
  gtag() {
    const dataLayer = this.getDataLayer()
    dataLayer.push(arguments)
  },
  async init() {
    await loadScript(ANALYTICS_URL)
    window.dataLayer = window.dataLayer || []
    this.gtag('js', new Date())
    this.gtag('config', ANALYTICS_ID)

    this.gtag({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
    // await loadScript(GTM_URL)
  }
}
