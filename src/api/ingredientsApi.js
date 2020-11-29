import { apiClient } from './apiClient'

export default {
  getAllBaseIngredients() {
    return apiClient.get(`/ingredients/base-ingredients`)
  }
}
