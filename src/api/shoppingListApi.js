import { apiClient } from './apiClient'

export default {
  getProductsFromShoppingList() {
    return apiClient.get(`/shopping-list/products`)
  },
  addProductsToShoppingList(products) {
    return apiClient.post(`/shopping-list/products`, products)
  },
  getProductFromShoppingListById(id) {
    return apiClient.get(`/shopping-list/products/${id}`)
  },
  updateProductFromShoppingList(product) {
    return apiClient.post(`/shopping-list/products/${product.id}`, product)
  },
  removeProductFromShoppingListById(id) {
    return apiClient.delete(`/shopping-list/products/${id}`)
  }
}
