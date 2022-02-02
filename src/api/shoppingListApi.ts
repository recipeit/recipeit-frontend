import apiClient from '@/api/apiClient'

import { UserKitchenProductEntity, UserShoppingListProductEntity } from '@/typings/entities'
import { EditedUserShoppingListProduct, NewUserShoppingListProduct } from '@/typings/shoppingList'

const route = 'shopping-list'

export default {
  getProductsFromShoppingList() {
    return apiClient.get<Array<UserShoppingListProductEntity>>(`/${route}/products`)
  },
  addProductsToShoppingList(products: Array<NewUserShoppingListProduct>) {
    return apiClient.post<Array<UserShoppingListProductEntity>>(`/${route}/products`, products)
  },
  addProductToShoppingList(product: NewUserShoppingListProduct) {
    return apiClient.post<UserShoppingListProductEntity>(`/${route}/product`, product)
  },
  purchaseProduct(id: UserShoppingListProductEntity['id']) {
    return apiClient.post<{ success: boolean; newKitchenProduct: UserKitchenProductEntity }>(`/${route}/purchase/${id}`, null)
  },
  purchaseAllProducts() {
    return apiClient.post<{ success: boolean; newKitchenProducts: Array<UserKitchenProductEntity> }>(`/${route}/purchase/all`, null)
  },
  getProductFromShoppingListById(id: UserShoppingListProductEntity['id']) {
    return apiClient.get<UserShoppingListProductEntity>(`/${route}/products/${id}`)
  },
  updateProductFromShoppingList(product: EditedUserShoppingListProduct) {
    return apiClient.put<UserShoppingListProductEntity>(`/${route}/product/${product.id}`, product)
  },
  removeProductFromShoppingListById(id: UserShoppingListProductEntity['id']) {
    return apiClient.delete<boolean>(`/${route}/product/${id}`)
  }
}
