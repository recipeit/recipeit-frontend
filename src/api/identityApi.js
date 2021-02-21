import CLIENT from './apiClient'

const route = 'identity'

export default {
  register(userData) {
    return CLIENT.apiClient.post(`/${route}/register`, userData)
  },
  login(userData) {
    return CLIENT.apiClient.post(`/${route}/login`, userData)
  },
  refresh(tokenData) {
    return CLIENT.apiClient.post(`/${route}/refresh`, tokenData)
  }
}
