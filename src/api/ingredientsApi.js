import CLIENT from './apiClient'

export default {
  getAllBaseProducts() {
    return CLIENT.apiClient.get(`/ingredients/base-ingredients`)
  }
}
