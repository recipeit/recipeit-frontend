import { RecipeEntity, RecipeIngredientEntity } from '@/typings/entities'
import { RecipeCategoryWithGroup } from '@/typings/recipeCategories'
import { IngredientUserState } from '@/typings/recipeIngredient'

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
