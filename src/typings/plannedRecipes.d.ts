import { RecipeEntity } from '@/typings/entities'
import { TimeOfDay } from '@/typings/timesOfDay'

export type PlannedRecipesResponseListItem = {
  id: string
  recipeId: RecipeEntity['id']
  name: string
}

export type DayPlan = { [key in TimeOfDay]: Array<PlannedRecipesResponseListItem> }

export type PlannedRecipesResponse = {
  day: string
  dayPlan: DayPlan
}
