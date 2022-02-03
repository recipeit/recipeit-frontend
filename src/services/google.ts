import { GOOGLE_API_URL, GOOGLE_AUTH_INIT_PARAMS, GOOGLE_AUTH_SIGN_IN_PARAMS } from '@/configs/google'

import loadScript from '@/functions/loadScript'

const getGoogleApi = async (): Promise<typeof gapi> => {
  if (!window.gapi) {
    await loadScript(GOOGLE_API_URL)
  }

  return window.gapi
}

const getAuth = async () => {
  const googleApi = await getGoogleApi()

  return new Promise<gapi.auth2.GoogleAuth>(resolve => {
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
}

const init = async () => {
  await getGoogleApi()
}

const login = async () => {
  const googleAuth = await getAuth()

  return new Promise<string>((resolve, reject) => {
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

export default {
  getGoogleApi,
  getAuth,
  init,
  login
}
