import CLIENT from './apiClient'

export default {
  getProductsFromShoppingList() {
    return CLIENT.apiClient.get(`/shopping-list/products`, {
      headers: CLIENT.authHeader()
    })
  },
  addProductsToShoppingList(products) {
    return CLIENT.apiClient.post(`/shopping-list/products`, products, {
      headers: CLIENT.authHeader()
    })
  },
  addProductToShoppingList(product) {
    return CLIENT.apiClient.post(`/shopping-list/product`, product, {
      headers: CLIENT.authHeader()
    })
  },
  purchaseProduct(productId) {
    return CLIENT.apiClient.post(`/shopping-list/purchase/${productId}`, null, {
      headers: CLIENT.authHeader()
    })
  },
  purchaseAllProducts() {
    return CLIENT.apiClient.post(`/shopping-list/purchase/all`, null, {
      headers: CLIENT.authHeader()
    })
  },
  getProductFromShoppingListById(id) {
    return CLIENT.apiClient.get(`/shopping-list/products/${id}`, {
      headers: CLIENT.authHeader()
    })
  },
  updateProductFromShoppingList(product) {
    return CLIENT.apiClient.put(`/shopping-list/product/${product.id}`, product, {
      headers: CLIENT.authHeader()
    })
  },
  removeProductFromShoppingListById(id) {
    return CLIENT.apiClient.delete(`/shopping-list/product/${id}`, {
      headers: CLIENT.authHeader()
    })
  }
}
