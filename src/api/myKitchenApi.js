import apiClient from '@/src/api/apiClient'

const route = 'my-kitchen'

export default {
  getProductsFromMyKitchen() {
    return apiClient.get(`/${route}/products`)
  },
  getProductExpirationDates(id) {
    return apiClient.get(`/${route}/products/${id}/expiration-dates`)
  },
  addProductToMyKitchen(product, expirationDates) {
    return apiClient.post(`/${route}/products`, { product, expirationDates })
  },
  getProductFromMyKitchenById(id) {
    return apiClient.get(`/${route}/products/${id}`)
  },
  updateProductFromMyKitchen(productId, product, expirationDates) {
    return apiClient.put(`/${route}/products/${productId}`, { product, expirationDates })
  },
  removeProductFromMyKitchenById(id) {
    return apiClient.delete(`/${route}/products/${id}`)
  }
}
