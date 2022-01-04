import recipeCategories from '@/constants/recipeCategories'

export const CATEGORY_IMAGES = {
  [recipeCategories.BREAKFAST]: import('@/assets/img/categories/breakfast.webp'),
  [recipeCategories.DINNER]: import('@/assets/img/categories/dinner.webp'),
  [recipeCategories.SUPPER]: import('@/assets/img/categories/supper.webp'),

  [recipeCategories.CAKE]: import('@/assets/img/categories/cake.webp'),
  [recipeCategories.DESSERT]: import('@/assets/img/categories/dessert.webp'),
  [recipeCategories.SNACK]: import('@/assets/img/categories/snack.webp'),
  [recipeCategories.PASTA]: import('@/assets/img/categories/pasta.webp'),
  [recipeCategories.SALAD]: import('@/assets/img/categories/salad.webp'),
  [recipeCategories.CASSEROLE]: import('@/assets/img/categories/casserole.webp'),

  [recipeCategories.CUISINE_ITALIAN]: import('@/assets/img/categories/cuisine-italian.webp'),
  [recipeCategories.CUISINE_THAI]: import('@/assets/img/categories/cuisine-thai.webp')
}
