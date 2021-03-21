import apiClient from './apiClient'

const route = 'identity'

export default {
  register(userData) {
    return apiClient.post(`/${route}/register`, userData)
  },
  login(userData) {
    return apiClient.post(`/${route}/login`, userData)
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
  profile() {
    return apiClient.get(`/${route}/profile`)
  },
  confirmEmail(data) {
    return apiClient.post(`/${route}/confirm-email`, data)
  },
  resetPassword(email) {
    return apiClient.post(`/${route}/reset-password`, { email })
  },
  sendConfirmationEmail(email) {
    return apiClient.post(`/${route}/send-confirmation-email`, { email })
  }
}
