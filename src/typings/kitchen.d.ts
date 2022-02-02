import { UserKitchenProductEntity } from '@/typings/entities'

export type NewUserKitchenProduct = {
  baseProductId: UserKitchenProductEntity['baseProductId']
  amount?: UserKitchenProductEntity['amount']
  unit?: UserKitchenProductEntity['unit']
}

export type EditedUserKitchenProduct = NewUserKitchenProduct & {
  id: UserKitchenProductEntity['id']
}
