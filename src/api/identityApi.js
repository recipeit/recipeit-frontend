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
  facebookAuth(userData) {
    return apiClient.post(`/${route}/social/facebook`, userData)
  },
  googleAuth(userData) {
    return apiClient.post(`/${route}/social/google`, userData)
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
  requestPasswordReset(data) {
    return apiClient.post(`/${route}/request-password-reset`, data)
  },
  resetPassword(data) {
    return apiClient.post(`/${route}/reset-password`, data)
  },
  changePassword(data) {
    return apiClient.post(`/${route}/change-password`, data)
  },
  sendConfirmationEmail(data) {
    return apiClient.post(`/${route}/send-confirmation-email`, data)
  },
  deleteAccount(data) {
    return apiClient.delete(`/${route}/delete-account`, data)
  }
}
