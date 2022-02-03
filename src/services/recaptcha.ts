import { RECAPTCHA_ACTIONS, RECAPTCHA_URL, RECAPTCHA_SITEKEY } from '@/configs/recaptcha'

import loadScript from '@/functions/loadScript'

type RecaptchaAction = typeof RECAPTCHA_ACTIONS[keyof typeof RECAPTCHA_ACTIONS]

const getGoogleRecaptcha = async (): Promise<ReCaptchaV2.ReCaptcha> => {
  if (!window.grecaptcha) {
    await loadScript(RECAPTCHA_URL)
  }

  return window.grecaptcha
}

// exported

const init = async () => {
  await getGoogleRecaptcha()
}

const execute = async (action: RecaptchaAction) => {
  const grecaptcha: ReCaptchaV2.ReCaptcha = await getGoogleRecaptcha()

  return new Promise<string>((resolve, reject) => {
    grecaptcha.ready(() => {
      grecaptcha.execute(RECAPTCHA_SITEKEY, { action }).then(token => {
        resolve(token)
      }, reject)
    })
  })
}

export default {
  init,
  execute
}
