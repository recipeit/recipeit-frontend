export const RECAPTCHA_SITEKEY = '6LfsEcUaAAAAAA1ndpMZUEmMhloDd5RAsO8ZtADI'
export const RECAPTCHA_URL = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITEKEY}`
export const RECAPTCHA_ACTIONS = {
  REGISTER: 'register',
  LOGIN: 'login',
  REQUEST_PASSWORD_RESET: 'requestPasswordReset',
  SEND_CONFIRMATION_EMAIL: 'sendConfirmationEmail',
  RESET_PASSWORD: 'resetPassword',
  FORGOT_PASSWORD: 'forgotPassword',
  CHANGE_PASSWORD: 'changePassword',
  DELETE_ACCOUNT: 'deleteAccount'
} as const
