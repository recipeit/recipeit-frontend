import apiClient from '@/api/apiClient'

import { UserShoppingListProductEntity } from '@/typings/entities'

const route = 'shopping-list'

export default {
  getProductsFromShoppingList() {
    return apiClient.get<Array<UserShoppingListProductEntity>>(`/${route}/products`)
  },
  addProductsToShoppingList(products) {
    return apiClient.post<Array<UserShoppingListProductEntity>>(`/${route}/products`, products)
  },
  addProductToShoppingList(product) {
    return apiClient.post<UserShoppingListProductEntity>(`/${route}/product`, product)
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
    return apiClient.put<UserShoppingListProductEntity>(`/${route}/product/${product.id}`, product)
  },
  removeProductFromShoppingListById(id) {
    return apiClient.delete<boolean>(`/${route}/product/${id}`)
  }
}
