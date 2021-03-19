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
  refresh(tokenData) {
    return apiClient.post(`/${route}/refresh`, tokenData)
  },
  profile() {
    return apiClient.get(`/${route}/profile`)
  }
}
