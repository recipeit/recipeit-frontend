import { LocaleMessageDictionary, PluralizationRule, VueMessageType } from 'vue-i18n'

import { ErrorCode } from '@/typings/errorCodes'
import { RecipeCategory } from '@/typings/recipeCategories'
import { RecipeFilterGroup, RecipeSortingMethod } from '@/typings/recipeFilters'
import { TimeOfDay } from '@/typings/timesOfDay'

export type Messages = LocaleMessageDictionary<VueMessageType> & {
  recipesSortingMethods: { [key in RecipeSortingMethod]: string }
  recipeFilterGroups: { [key in RecipeFilterGroup]: string }
  errorCode: { [key in ErrorCode]: string }
  recipeCategory: { [key in RecipeCategory]: string }
  timeOfDay: { [key in TimeOfDay]: string }
}

export interface i18nLang {
  messages: Messages
  pluralizationRules?: PluralizationRule
}
