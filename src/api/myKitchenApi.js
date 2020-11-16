import { apiClient } from './apiClient'

export default {
  getProductsFromMyKitchen() {
    return apiClient.get(`/my-kitchen/products`)
  },
  addProductsToMyKitchen(products) {
    return apiClient.post(`/my-kitchen/products`, {
      params: { products }
    })
  },
  getProductFromMyKitchenById(id) {
    return apiClient.get(`/my-kitchen/products/${id}`)
  },
  updateProductFromMyKitchen(product) {
    return apiClient.post(`/my-kitchen/products/${product.id}`, {
      params: { product }
    })
  },
  removeProductFromMyKitchenById(id) {
    return apiClient.delete(`/my-kitchen/products/${id}`)
  }
}
