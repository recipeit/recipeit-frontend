export const RECIPE_FILTER_GROUPS = {
  OTHER: 'Other',
  DAYTIME: 'Daytime',
  TYPE: 'Type',
  OCCASION: 'Occasion',
  CUISINE: 'Cuisine',
  DIET: 'Diet',
  ALLERGENS: 'Allergens',
  BASE_PRODUCTS: 'BaseProducts'
} as const

export const RECIPE_SORTING_METHODS = {
  NEWEST: 'Newest',
  NAME_ASCENDING: 'NameAscending',
  NAME_DESCENDING: 'NameDescending',
  TIME_PREPARING_ASCENDING: 'TimePreparingAscending',
  TIME_PREPARING_DESCENDING: 'TimePreparingDescending',
  INGREDIENT_COUNT_ASCENDING: 'IngredientsCountAscending',
  INGREDIENT_COUNT_DESCENDING: 'IngredientsCountDescending',
  MISSING_INGREDIENT_ASCENDING: 'MissingIngredientsAscending',
  MISSING_INGREDIENT_DESCENDING: 'MissingIngredientsDescending'
} as const
