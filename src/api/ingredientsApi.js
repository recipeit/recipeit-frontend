import apiClient from './apiClient'

const route = 'ingredients'

export default {
  getAllBaseProducts() {
    return apiClient.get(`/${route}/base-ingredients`)
  }
}
