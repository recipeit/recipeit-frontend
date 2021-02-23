import apiClient from './apiClient'

export default {
  getProductsFromMyKitchen() {
    return apiClient.get(`/my-kitchen/products`)
  },
  addProductsToMyKitchen(products) {
    return apiClient.post(`/my-kitchen/products`, products)
  },
  getProductFromMyKitchenById(id) {
    return apiClient.get(`/my-kitchen/products/${id}`)
  },
  updateProductFromMyKitchen(productId, product) {
    return apiClient.put(`/my-kitchen/products/${productId}`, product)
  },
  removeProductFromMyKitchenById(id) {
    return apiClient.delete(`/my-kitchen/products/${id}`)
  }
}
