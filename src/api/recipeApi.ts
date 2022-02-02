import apiClient from '@/api/apiClient'

import { RecipeEntity, UserShoppingListProductEntity } from '@/typings/entities'
import { RecipeCategoryWithGroup } from '@/typings/recipeCategories'
import { RecipeDetailsViewModel } from '@/typings/recipes'
import { RecipesFilteredPage, RecipesFilteredPageQueryParams } from '@/typings/recipesPage'

const route = 'recipes'

export default {
  getRecipes(queryParams?: RecipesFilteredPageQueryParams) {
    return apiClient.get<RecipesFilteredPage>(`/${route}`, {
      params: queryParams
    })
  },
  getRecipe(id: RecipeEntity['id']) {
    return apiClient.get<RecipeEntity>(`/${route}/${id}`)
  },
  getDetailedRecipe(id: RecipeEntity['id']) {
    return apiClient.get<{ recipe: RecipeEntity; details: RecipeDetailsViewModel }>(`/${route}/${id}/detailed`)
  },
  addMissingIngredientsToShoppingList(id: RecipeEntity['id']) {
    return apiClient.post<Array<UserShoppingListProductEntity>>(`/${route}/${id}/add-missing-ingredients-to-shopping-list`)
  },
  getPopularCategories() {
    return apiClient.get<Array<RecipeCategoryWithGroup>>(`/${route}/popular-categories`)
  }
}
