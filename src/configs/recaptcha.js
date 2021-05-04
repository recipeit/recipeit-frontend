export const RECAPTCHA_SITEKEY = '6LfsEcUaAAAAAA1ndpMZUEmMhloDd5RAsO8ZtADI'
export const RECAPTCHA_URL = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITEKEY}`
export const RECAPTCHA_ACTIONS = {
  REGISTER: 'register',
  LOGIN: 'login',
  REQUEST_PASSWORD_RESET: 'request-password-reset',
  RESET_PASSWORD: 'reset-password',
  FORGOT_PASSWORD: 'forgot-password',
  CHANGE_PASSWORD: 'change-password',
  DELETE_ACCOUNT: 'delete-account'
}
