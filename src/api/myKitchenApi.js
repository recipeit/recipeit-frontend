import { apiClient } from './apiClient'

export default {
  getProductsFromMyKitchen() {
    return apiClient.get(`/my-kitchen/products`)
  },
  addProductsToMyKitchen(products) {
    console.log(products)
    return apiClient.post(`/my-kitchen/products`, products)
  },
  getProductFromMyKitchenById(id) {
    return apiClient.get(`/my-kitchen/products/${id}`)
  },
  updateProductFromMyKitchen(product) {
    return apiClient.put(`/my-kitchen/products/${product.id}`, product)
  },
  removeProductFromMyKitchenById(id) {
    return apiClient.delete(`/my-kitchen/products/${id}`)
  }
}
