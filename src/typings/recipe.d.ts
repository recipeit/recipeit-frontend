import { IngredientUserState } from '@/configs/recipeIngredient'

import { RecipeEntity, RecipeIngredientEntity } from './entities'

export type RecipeCategoryWithGroup = {
  key: number
  value: string
  categoryGroup: string
}

export type RecipeDetailsViewModel = {
  recipeId: string
  servings: number | null
  introductionParagraphs: Array<string>
  directionsParagraphs: Array<string>
  summaryParagraphs: Array<string>
  footerParagraphs: Array<string>
  ingredientGroups: { [key: string]: Array<RecipeIngredientEntity> }
  categoriesWithGroups: Array<RecipeCategoryWithGroup>
}

export type DetailedRecipe = RecipeEntity & {
  details: RecipeDetailsViewModel
}

export type RecipeIngredientWithUserState = RecipeIngredientEntity & {
  state: IngredientUserState
}

export type RecipeIngredientGroups = {
  [key: string]: Array<RecipeIngredientEntity>
}
