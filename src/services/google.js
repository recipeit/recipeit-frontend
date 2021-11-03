import { GOOGLE_API_URL, GOOGLE_AUTH_INIT_PARAMS, GOOGLE_AUTH_SIGN_IN_PARAMS } from '@/src/configs/google'

import loadScript from '@/src/functions/loadScript'

export default {
  async getGoogleApi() {
    if (!window.gapi) {
      await loadScript(GOOGLE_API_URL)
    }

    return window.gapi
  },

  async getAuth() {
    const googleApi = await this.getGoogleApi()

    return new Promise(resolve => {
      const existedInstance = googleApi.auth2?.getAuthInstance()
      if (existedInstance) {
        resolve(existedInstance)
      } else {
        googleApi.load('auth2', () => {
          googleApi.auth2.init(GOOGLE_AUTH_INIT_PARAMS)
          resolve(googleApi.auth2.getAuthInstance())
        })
      }
    })
  },

  async init() {
    await this.getGoogleApi()
  },

  async login() {
    const googleAuth = await this.getAuth()

    return new Promise((resolve, reject) => {
      googleAuth
        .signIn(GOOGLE_AUTH_SIGN_IN_PARAMS)
        .then(response => {
          const idToken = response.getAuthResponse()?.id_token
          resolve(idToken)
        })
        .catch(() => {
          reject(new Error('error during Google login'))
        })
    })
  }
}
