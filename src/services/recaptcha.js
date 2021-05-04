import { RECAPTCHA_URL, RECAPTCHA_SITEKEY } from '@/configs/recaptcha'
import loadScript from '@/functions/loadScript'

export default {
  async getGoogleRecaptcha() {
    if (!window.grecaptcha) {
      await loadScript(RECAPTCHA_URL)
    }
    return window.grecaptcha
  },
  async init() {
    await this.getGoogleRecaptcha()
  },
  async execute(action) {
    const grecaptcha = await this.getGoogleRecaptcha()
    return new Promise((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha
          .execute(RECAPTCHA_SITEKEY, { action })
          .then(token => {
            resolve(token)
          })
          .catch(e => reject(e))
      })
    })
  }
}
