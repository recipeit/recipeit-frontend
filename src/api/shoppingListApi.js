import { apiClient } from './apiClient'

export default {
  getProductsFromShoppingList() {
    return apiClient.get(`/shopping-list/products`)
  },
  addProductsToShoppingList(products) {
    return apiClient.post(`/shopping-list/products`, products)
  },
  addProductToShoppingList(product) {
    return apiClient.post(`/shopping-list/product`, product)
  },
  purchaseProduct(productId) {
    return apiClient.post(`/shopping-list/purchase/${productId}`)
  },
  purchaseAllProducts() {
    return apiClient.post(`/shopping-list/purchase/all`)
  },
  getProductFromShoppingListById(id) {
    return apiClient.get(`/shopping-list/products/${id}`)
  },
  updateProductFromShoppingList(product) {
    return apiClient.put(`/shopping-list/product/${product.id}`, product)
  },
  removeProductFromShoppingListById(id) {
    return apiClient.delete(`/shopping-list/product/${id}`)
  }
}
