import { apiClient } from './apiClient'

export default {
  getAllBaseProducts() {
    return apiClient.get(`/ingredients/base-ingredients`)
  }
}
