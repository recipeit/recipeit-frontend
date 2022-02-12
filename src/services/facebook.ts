import { FACEBOOK_SDK_URL, FACEBOOK_INIT_PARAMS, FACEBOOK_LOGIN_PARAMS } from '@/configs/facebook'

import loadScript from '@/functions/loadScript'

const getFB = async (): Promise<fb.FacebookStatic> => {
  if (!window.FB) {
    await loadScript(FACEBOOK_SDK_URL)
  }

  return window.FB
}

// exported

const init = async () => {
  window.fbAsyncInit = async () => {
    const FB = await getFB()

    FB.init(FACEBOOK_INIT_PARAMS)
  }

  await getFB()
}

const login = async () => {
  const FB = await getFB()

  return new Promise<string>((resolve, reject) => {
    FB.login(({ authResponse }) => {
      if (authResponse?.accessToken) {
        resolve(authResponse.accessToken)
      } else {
        reject(new Error('error during Facebook login'))
      }
    }, FACEBOOK_LOGIN_PARAMS)
  })
}

export default {
  init,
  login
}
