import { RECAPTCHA_ACTIONS, RECAPTCHA_URL, RECAPTCHA_SITEKEY } from '@/configs/recaptcha'

import loadScript from '@/functions/loadScript'

type RecaptchaAction = typeof RECAPTCHA_ACTIONS[keyof typeof RECAPTCHA_ACTIONS]

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

  async execute(action: RecaptchaAction): Promise<string> {
    const grecaptcha: ReCaptchaV2.ReCaptcha = await this.getGoogleRecaptcha()

    return new Promise((resolve, reject) => {
      grecaptcha.ready(() => {
        grecaptcha.execute(RECAPTCHA_SITEKEY, { action }).then(token => {
          resolve(token)
        }, reject)
      })
    })
  }
}
