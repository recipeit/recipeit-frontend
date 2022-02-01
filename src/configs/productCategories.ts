import { ProductCategory } from '@/typings/productCategories'

export const PRODUCT_CATEGORY_ORDER: { [key in ProductCategory]: number } = {
  Vegetables: 1,
  Fruits: 2,
  Dairy: 3,
  Meats: 4,
  Fishes: 5,
  Seafoods: 6,
  DairyAlternatives: 7,
  DairyAndMeatAlternatives: 8,
  BakingAndGrains: 9,
  Legumes: 10,
  Nuts: 11,
  Spices: 12,
  Oils: 13,
  Sauces: 14,
  Beverages: 15,
  Alcohol: 16,
  DessertsAndSnacks: 17,
  FoodAdditives: 18,
  Sweeteners: 19,
  Others: 20
}
