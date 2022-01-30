import { GOOGLE_API_URL, GOOGLE_AUTH_INIT_PARAMS, GOOGLE_AUTH_SIGN_IN_PARAMS } from '@/configs/google'

import loadScript from '@/functions/loadScript'

export default {
  async getGoogleApi(): Promise<typeof gapi> {
    if (!window.gapi) {
      await loadScript(GOOGLE_API_URL)
    }

    return window.gapi
  },

  async getAuth(): Promise<gapi.auth2.GoogleAuth> {
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

  async init(): Promise<void> {
    await this.getGoogleApi()
  },

  async login(): Promise<string> {
    const googleAuth: gapi.auth2.GoogleAuth = await this.getAuth()

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
