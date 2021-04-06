import apiClient from './apiClient'

const route = 'identity'

export default {
  register(userData) {
    return apiClient.post(`/${route}/register`, userData)
  },
  login(userData) {
    return apiClient.post(`/${route}/login`, userData)
  },
  logout() {
    return apiClient.post(`/${route}/logout`)
  },
  facebookAuth(accessToken) {
    return apiClient.post(`/${route}/social/facebook`, { accessToken })
  },
  googleAuth(idToken) {
    return apiClient.post(`/${route}/social/google`, { idToken })
  },
  refresh(tokenData) {
    return apiClient.post(`/${route}/refresh`, tokenData)
  },
  refreshCookie() {
    return apiClient.post(`/${route}/refresh-cookie`)
  },
  profile() {
    return apiClient.get(`/${route}/profile`)
  },
  confirmEmail(data) {
    return apiClient.post(`/${route}/confirm-email`, data)
  },
  requestPasswordReset(email) {
    return apiClient.post(`/${route}/request-password-reset`, { email })
  },
  resetPassword(data) {
    return apiClient.post(`/${route}/reset-password`, data)
  },
  sendConfirmationEmail(email) {
    return apiClient.post(`/${route}/send-confirmation-email`, { email })
  }
}
