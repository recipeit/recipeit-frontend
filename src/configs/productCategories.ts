import { ProductCategory } from '@/enums/productCategories'

export const PRODUCT_CATEGORY_ORDER: { [key in ProductCategory]: number } = {
  [ProductCategory.Vegetables]: 1,
  [ProductCategory.Fruits]: 2,
  [ProductCategory.Dairy]: 3,
  [ProductCategory.Meats]: 4,
  [ProductCategory.Fishes]: 5,
  [ProductCategory.Seafoods]: 6,
  [ProductCategory.DairyAlternatives]: 7,
  [ProductCategory.DairyAndMeatAlternatives]: 8,
  [ProductCategory.BakingAndGrains]: 9,
  [ProductCategory.Legumes]: 10,
  [ProductCategory.Nuts]: 11,
  [ProductCategory.Spices]: 12,
  [ProductCategory.Oils]: 13,
  [ProductCategory.Sauces]: 14,
  [ProductCategory.Beverages]: 15,
  [ProductCategory.Alcohol]: 16,
  [ProductCategory.DessertsAndSnacks]: 17,
  [ProductCategory.FoodAdditives]: 18,
  [ProductCategory.Sweeteners]: 19,
  [ProductCategory.Others]: 20
}
