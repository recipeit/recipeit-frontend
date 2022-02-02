export type RecipeCategoryGroup = 'Daytime' | 'Type' | 'Occasion' | 'Cuisine'

export type RecipeCategoryDayTime = 'Breakfast' | 'Dinner' | 'Supper'

export type RecipeCategoryType =
  | 'Snack'
  | 'Dessert'
  | 'Cake'
  | 'Cookies'
  | 'Sauce'
  | 'Pizza'
  | 'Pasta'
  | 'FastFood'
  | 'Appetizer'
  | 'Baking'
  | 'Casserole'
  | 'Soup'
  | 'Salad'
  | 'Drink'
  | 'Alcohol'
  | 'Paste'
  | 'Preserves'

export type RecipeCategoryOccasion =
  | 'Christmas'
  | 'Easter'
  | 'Halloween'
  | 'Grill'
  | 'Party'
  | 'NewYearsEve'
  | 'FatThursday'
  | 'ValentinesDay'
  | 'Picnic'

export type RecipeCategoryCuisine =
  | 'CuisineAsian'
  | 'CuisineAfrican'
  | 'CuisineMiddleEast'
  | 'CuisineAmerican'
  | 'CuisineBalkan'
  | 'CuisineChinese'
  | 'CuisineFrench'
  | 'CuisineGreek'
  | 'CuisineGeorgian'
  | 'CuisineSpanish'
  | 'CuisineIndian'
  | 'CuisinePolish'
  | 'CuisineThai'
  | 'CuisineMexican'
  | 'CuisineItalian'
  | 'CuisineKorean'
  | 'CuisineGerman'
  | 'CuisineOriental'
  | 'CuisineTurkish'
  | 'CuisineMediterranean'
  | 'CuisineRussian'
  | 'CuisineHungarian'
  | 'CuisineFusion'
  | 'CuisineUkrainian'
  | 'CuisineCzech'
  | 'CuisineJapanese'
  | 'CuisineIranian'
  | 'CuisineArabian'

export type RecipeCategory = RecipeCategoryDayTime | RecipeCategoryType | RecipeCategoryOccasion | RecipeCategoryCuisine

export type RecipeCategoryWithGroup = {
  key: number
  value: RecipeCategory
  categoryGroup: RecipeCategoryGroup
}
