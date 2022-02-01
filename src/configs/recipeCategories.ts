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

import { RecipeCategory } from '@/typings/recipeCategories'

export const CATEGORY_IMAGES: { [key in RecipeCategory]?: string } = {
  Breakfast: breakfastImage,
  Dinner: dinnerImage,
  Supper: supperImage,

  Cake: cakeImage,
  Dessert: dessertImage,
  Snack: snackImage,
  Pasta: pastaImage,
  Salad: saladImage,
  Casserole: casseroleImage,

  CuisineItalian: cuisineItalianImage,
  CuisineThai: cuisineThaiImage
}
