import { RecipeEntity } from '@/typings/entities'
import { TimeOfDay } from '@/typings/timesOfDay'

export type PlannedRecipesResponseListItem = {
  id: string
  recipeId: RecipeEntity['id']
  name: string
}

export type PlannedRecipesResponse = {
  day: string
  dayPlan: { [key in TimeOfDay]: Array<PlannedRecipesResponseListItem> }
}
