export const FACEBOOK_SDK_URL = 'https://connect.facebook.net/en_US/sdk.js'
export const FACEBOOK_SDK_VERSION = 'v10.0'
export const FACEBOOK_APP_ID = '189490352689451'
export const FACEBOOK_LOGIN_SCOPE = 'email,public_profile'
export const FACEBOOK_INIT_PARAMS = {
  version: FACEBOOK_SDK_VERSION,
  appId: FACEBOOK_APP_ID,
  cookie: false,
  xfbml: false
}
export const FACEBOOK_LOGIN_PARAMS = {
  scope: FACEBOOK_LOGIN_SCOPE,
  return_scopes: true
}
export const FACEBOOK_RELOGIN_PARAMS = {
  scope: 'email',
  auth_type: 'rerequest'
}
