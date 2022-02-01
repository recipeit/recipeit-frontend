import { UserShoppingListProductEntity } from '@/typings/entities'

export type NewUserShoppingListProduct = {
  baseProductId: UserShoppingListProductEntity['baseProductId']
  amount?: UserShoppingListProductEntity['amount']
  unit?: UserShoppingListProductEntity['unit']
}

export type EditedUserShoppingListProduct = NewUserShoppingListProduct & {
  id: UserShoppingListProductEntity['id']
}
