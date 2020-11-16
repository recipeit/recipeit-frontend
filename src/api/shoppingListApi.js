import { apiClient } from './apiClient'

export default {
  getProductsFromShoppingList() {
    return apiClient.get(`/shopping-list/products`)
  },
  addProductsToShoppingList(products) {
    return apiClient.post(`/shopping-list/products`, {
      params: { products }
    })
  },
  getProductFromShoppingListById(id) {
    return apiClient.get(`/shopping-list/products/${id}`)
  },
  updateProductFromShoppingList(product) {
    return apiClient.post(`/shopping-list/products/${product.id}`, {
      params: { product }
    })
  },
  removeProductFromShoppingListById(id) {
    return apiClient.delete(`/shopping-list/products/${id}`)
  }
}
