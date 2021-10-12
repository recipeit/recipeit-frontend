import { FACEBOOK_SDK_URL, FACEBOOK_INIT_PARAMS, FACEBOOK_LOGIN_PARAMS, FACEBOOK_RELOGIN_PARAMS } from '@/configs/facebook'

import loadScript from '@/functions/loadScript'

export default {
  async getFB() {
    if (!window.FB) {
      await loadScript(FACEBOOK_SDK_URL)
    }

    return window.FB
  },

  async init() {
    window.fbAsyncInit = async () => {
      const FB = await this.getFB()

      FB.init(FACEBOOK_INIT_PARAMS)
    }

    await this.getFB()
  },

  async login() {
    const FB = await this.getFB()

    return new Promise((resolve, reject) => {
      FB.login(({ authResponse }) => {
        if (authResponse?.accessToken) {
          resolve(authResponse.accessToken)
        } else {
          reject(new Error('error during Facebook login'))
        }
      }, FACEBOOK_LOGIN_PARAMS)
    })
  }
}
