import recipeCategories from '@/constants/recipeCategories'

import breakfastImage from '@/assets/img/categories/breakfast.webp'
import dinnerImage from '@/assets/img/categories/dinner.webp'
import supperImage from '@/assets/img/categories/supper.webp'

import cakeImage from '@/assets/img/categories/cake.webp'
import dessertImage from '@/assets/img/categories/dessert.webp'
import snackImage from '@/assets/img/categories/snack.webp'
import pastaImage from '@/assets/img/categories/pasta.webp'
import saladImage from '@/assets/img/categories/salad.webp'
import casseroleImage from '@/assets/img/categories/casserole.webp'

import cuisineItalianImage from '@/assets/img/categories/cuisine-italian.webp'
import cuisineThaiImage from '@/assets/img/categories/cuisine-thai.webp'

export const CATEGORY_IMAGES = {
  [recipeCategories.BREAKFAST]: breakfastImage,
  [recipeCategories.DINNER]: dinnerImage,
  [recipeCategories.SUPPER]: supperImage,

  [recipeCategories.CAKE]: cakeImage,
  [recipeCategories.DESSERT]: dessertImage,
  [recipeCategories.SNACK]: snackImage,
  [recipeCategories.PASTA]: pastaImage,
  [recipeCategories.SALAD]: saladImage,
  [recipeCategories.CASSEROLE]: casseroleImage,

  [recipeCategories.CUISINE_ITALIAN]: cuisineItalianImage,
  [recipeCategories.CUISINE_THAI]: cuisineThaiImage
}
