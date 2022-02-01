import { ProductCategory } from '@/enums/productCategories'

export type BlogEntity = {
  id: string
  slug: string
  name: string
  isHidden: boolean
  url: string
}

export type AuthorEntity = {
  id: string
  name: string
  blogId: string
  blog: BlogEntity
}

export type BaseProductEntity = {
  id: number
  name: string
  variants: string
  category: ProductCategory
  onlyWithNesting: boolean
  childrenIds: Array<number>
  parentsIds: Array<number>
}

export type ExpirationDateEntity = {
  id: string
  productId: string
  date: string
}

export type UserProductEntity = {
  id: string
  userId: string
  name: string
  amount: number | null
  unit: string
  baseProductId: number
  baseProductName: string
  category: string
}

export type UserKitchenProductEntity = UserProductEntity & {
  expirationDates: Array<ExpirationDateEntity>
}

export type UserShoppingListProductEntity = UserProductEntity

export type RecipeEntity = {
  id: string
  slug: string
  authorId: string
  author: AuthorEntity
  isHidden: boolean
  name: string
  url: string
  rating: number
  imagesCount: number
  cookingMinutes: number
  categoryKeys: Array<string>
  // not used
  mainImageUrl: string
  mainImagePosition: string
}

export type RecipeIngredientEntity = {
  id: number
  name: string
  recipeId: string
  unit: string
  amount: number
  amountMax: number | null
  groupName: string
  optional: boolean
  variantGroupId: number
  baseProductId: string
  baseProductIdsArray: Array<number>
  mainBaseProductId: number
  // baseProduct:null
}
