import apiClient from '@/api/apiClient'

const route = 'shopping-list'

export default {
  getProductsFromShoppingList() {
    return apiClient.get(`/${route}/products`)
  },
  addProductsToShoppingList(products) {
    return apiClient.post(`/${route}/products`, products)
  },
  addProductToShoppingList(product) {
    return apiClient.post(`/${route}/product`, product)
  },
  purchaseProduct(productId) {
    return apiClient.post(`/${route}/purchase/${productId}`, null)
  },
  purchaseAllProducts() {
    return apiClient.post(`/${route}/purchase/all`, null)
  },
  getProductFromShoppingListById(id) {
    return apiClient.get(`/${route}/products/${id}`)
  },
  updateProductFromShoppingList(product) {
    return apiClient.put(`/${route}/product/${product.id}`, product)
  },
  removeProductFromShoppingListById(id) {
    return apiClient.delete(`/${route}/product/${id}`)
  }
}
