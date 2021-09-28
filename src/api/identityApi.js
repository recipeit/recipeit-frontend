import apiClient from './apiClient'

const route = 'identity'

export const IDENTITY_URLS = {
  REGISTER: `/${route}/register`,
  LOGIN: `/${route}/login`,
  LOGOUT: `/${route}/logout`,
  FACEBOOK_AUTH: `/${route}/social/facebook`,
  GOOGLE_AUTH: `/${route}/social/google`,
  REFRESH: `/${route}/refresh`,
  REFRESH_COOKIE: `/${route}/refresh-cookie`,
  PROFILE: `/${route}/profile`,
  CONFIRM_EMAIL: `/${route}/confirm-email`,
  REQUEST_PASSWORD_RESET: `/${route}/request-password-reset`,
  RESET_PASSWORD: `/${route}/reset-password`,
  CHANGE_PASSWORD: `/${route}/change-password`,
  SEND_CONFIRMATION_EMAIL: `/${route}/send-confirmation-email`,
  DELETE_ACCOUNT: `/${route}/delete-account`
}

export default {
  register(userData) {
    return apiClient.post(IDENTITY_URLS.REGISTER, userData)
  },
  login(userData) {
    return apiClient.post(IDENTITY_URLS.LOGIN, userData)
  },
  logout() {
    return apiClient.post(IDENTITY_URLS.LOGOUT)
  },
  facebookAuth(userData) {
    return apiClient.post(IDENTITY_URLS.FACEBOOK_AUTH, userData)
  },
  googleAuth(userData) {
    return apiClient.post(IDENTITY_URLS.GOOGLE_AUTH, userData)
  },
  refresh(tokenData) {
    return apiClient.post(IDENTITY_URLS.REFRESH, tokenData)
  },
  refreshCookie() {
    return apiClient.post(IDENTITY_URLS.REFRESH_COOKIE)
  },
  profile() {
    return apiClient.get(IDENTITY_URLS.PROFILE)
  },
  confirmEmail(data) {
    return apiClient.post(IDENTITY_URLS.CONFIRM_EMAIL, data)
  },
  requestPasswordReset(data) {
    return apiClient.post(IDENTITY_URLS.REQUEST_PASSWORD_RESET, data)
  },
  resetPassword(data) {
    return apiClient.post(IDENTITY_URLS.RESET_PASSWORD, data)
  },
  changePassword(data) {
    return apiClient.post(IDENTITY_URLS.CHANGE_PASSWORD, data)
  },
  sendConfirmationEmail(data) {
    return apiClient.post(IDENTITY_URLS.SEND_CONFIRMATION_EMAIL, data)
  },
  deleteAccount(data) {
    return apiClient.delete(IDENTITY_URLS.DELETE_ACCOUNT, data)
  }
}
