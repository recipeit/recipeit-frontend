import CLIENT from './apiClient'

export default {
  getProductsFromMyKitchen() {
    return CLIENT.apiClient.get(`/my-kitchen/products`, {
      headers: CLIENT.authHeader()
    })
  },
  addProductsToMyKitchen(products) {
    return CLIENT.apiClient.post(`/my-kitchen/products`, products, {
      headers: CLIENT.authHeader()
    })
  },
  getProductFromMyKitchenById(id) {
    return CLIENT.apiClient.get(`/my-kitchen/products/${id}`, {
      headers: CLIENT.authHeader()
    })
  },
  updateProductFromMyKitchen(productId, product) {
    return CLIENT.apiClient.put(`/my-kitchen/products/${productId}`, product, {
      headers: CLIENT.authHeader()
    })
  },
  removeProductFromMyKitchenById(id) {
    return CLIENT.apiClient.delete(`/my-kitchen/products/${id}`, {
      headers: CLIENT.authHeader()
    })
  }
}
