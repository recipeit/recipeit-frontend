import apiClient from '@/api/apiClient'

import { UserKitchenProductEntity } from '@/typings/entities'
import { EditedUserKitchenProduct, NewUserKitchenProduct } from '@/typings/kitchen'

const route = 'my-kitchen'

export default {
  getProductsFromMyKitchen() {
    return apiClient.get<Array<UserKitchenProductEntity>>(`/${route}/products`)
  },
  getProductExpirationDates(id: string) {
    return apiClient.get<Array<string>>(`/${route}/products/${id}/expiration-dates`)
  },
  addProductToMyKitchen(product: NewUserKitchenProduct, expirationDates: Array<string>) {
    return apiClient.post<UserKitchenProductEntity>(`/${route}/products`, { product, expirationDates })
  },
  getProductFromMyKitchenById(id: UserKitchenProductEntity['id']) {
    return apiClient.get<UserKitchenProductEntity>(`/${route}/products/${id}`)
  },
  updateProductFromMyKitchen(id: UserKitchenProductEntity['id'], product: EditedUserKitchenProduct, expirationDates: Array<string>) {
    return apiClient.put<UserKitchenProductEntity>(`/${route}/products/${id}`, { product, expirationDates })
  },
  removeProductFromMyKitchenById(id: UserKitchenProductEntity['id']) {
    return apiClient.delete(`/${route}/products/${id}`)
  }
}
