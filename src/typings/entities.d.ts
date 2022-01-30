import { ProductCategory } from '@/configs/productCategories'

export type BlogEntity = {
  id: string
  slug: string
  name: string
  isHidden: boolean
  url: string
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
