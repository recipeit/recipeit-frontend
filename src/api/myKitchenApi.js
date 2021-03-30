import apiClient from './apiClient'

export default {
  getProductsFromMyKitchen() {
    return apiClient.get(`/my-kitchen/products`)
  },
  getProductExpirationDates(id) {
    return apiClient.get(`/my-kitchen/products/${id}/expiration-dates`)
  },
  // addProductsToMyKitchen(products) {
  //   return apiClient.post(`/my-kitchen/products`, products)
  // },
  addProductToMyKitchen(product, expirationDates) {
    return apiClient.post(`/my-kitchen/products`, { product, expirationDates })
  },
  getProductFromMyKitchenById(id) {
    return apiClient.get(`/my-kitchen/products/${id}`)
  },
  updateProductFromMyKitchen(productId, product, expirationDates) {
    return apiClient.put(`/my-kitchen/products/${productId}`, { product, expirationDates })
  },
  removeProductFromMyKitchenById(id) {
    return apiClient.delete(`/my-kitchen/products/${id}`)
  }
}
