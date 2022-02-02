import apiClient from '@/api/apiClient'

import { DateYMDString } from '@/typings/dates'
import { BlogEntity, RecipeEntity } from '@/typings/entities'
import { RecipesPageQueryParams, RecipesFilteredPage, RecipesPage, RecipesFilteredPageQueryParams } from '@/typings/recipesPage'
import { PlannedRecipesResponse } from '@/typings/plannedRecipes'

const route = 'user'

export type AddRecipeToPlannedRequestBody = {
  day: DateYMDString
  timeOfDay: string
}

export default {
  getAvailableRecipesCount(queryParams?: RecipesFilteredPageQueryParams) {
    return apiClient.get<number>(`/${route}/available-recipes/count`, {
      params: queryParams
    })
  },
  getAvailableRecipes(queryParams?: RecipesFilteredPageQueryParams) {
    return apiClient.get<RecipesFilteredPage>(`/${route}/available-recipes`, {
      params: queryParams
    })
  },
  getAlmostAvailableRecipes(queryParams?: RecipesFilteredPageQueryParams) {
    return apiClient.get<RecipesFilteredPage>(`/${route}/almost-available-recipes`, {
      params: queryParams
    })
  },
  getFavouriteRecipes(queryParams?: RecipesPageQueryParams) {
    return apiClient.get<RecipesPage>(`/${route}/favourite-recipes`, {
      params: queryParams
    })
  },
  getFavouriteRecipesIds() {
    return apiClient.get<Array<RecipeEntity['id']>>(`/${route}/favourite-recipes/ids`)
  },
  addRecipeToFavourites(id: RecipeEntity['id']) {
    return apiClient.post<boolean>(`/${route}/favourite-recipes/${id}`, null)
  },
  removeRecipeFromFavourites(id: RecipeEntity['id']) {
    return apiClient.delete<boolean>(`/${route}/favourite-recipes/${id}`)
  },
  getPlannedRecipes(date: DateYMDString) {
    return apiClient.get<PlannedRecipesResponse>(`/${route}/planned-recipes/${date}`)
  },
  addRecipeToPlanned(id: RecipeEntity['id'], data: AddRecipeToPlannedRequestBody) {
    return apiClient.post<{ success: boolean; errors?: Array<string> }>(`/${route}/planned-recipes/${id}`, data)
  },
  removeRecipeFromPlanned(id: RecipeEntity['id']) {
    return apiClient.delete<boolean>(`/${route}/planned-recipes/${id}`)
  },
  changeRecipeVisibility(id: RecipeEntity['id'], visible: boolean) {
    return apiClient.post<{ success: boolean; errors?: Array<string> }>(`/${route}/recipe-visibility/${id}`, { visible })
  },
  changeBlogVisibility(id: BlogEntity['id'], visible: boolean) {
    return apiClient.post<{ success: boolean; errors?: Array<string> }>(`/${route}/blog-visibility/${id}`, { visible })
  },
  getHiddenRecipes() {
    return apiClient.get<{ recipes: Array<RecipeEntity> }>(`/${route}/hidden-recipes`)
  },
  getHiddenBlogs() {
    return apiClient.get<{ blogs: Array<BlogEntity> }>(`/${route}/hidden-blogs`)
  },
  getHiddenRecipeIds() {
    return apiClient.get<{ recipeIds: Array<string> }>(`/${route}/hidden-recipes/ids`)
  },
  getHiddenBlogIds() {
    return apiClient.get<{ blogIds: Array<string> }>(`/${route}/hidden-blogs/ids`)
  }
}
