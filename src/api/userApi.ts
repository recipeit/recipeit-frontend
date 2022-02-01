import { AxiosResponse } from 'axios'

import apiClient from '@/api/apiClient'

import { DateYMDString } from '@/typings/dates'
import { BlogEntity, RecipeEntity } from '@/typings/entities'
import { RecipesPageQueryParams, RecipesFilteredPage, RecipesPage, RecipesFilteredPageQueryParams } from '@/typings/recipesPage'

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
  getFavouriteRecipes(queryParams?: RecipesPageQueryParams): Promise<AxiosResponse<RecipesPage>> {
    return apiClient.get(`/${route}/favourite-recipes`, {
      params: queryParams
    })
  },
  getFavouriteRecipesIds() {
    return apiClient.get(`/${route}/favourite-recipes/ids`)
  },
  addRecipeToFavourites(id: RecipeEntity['id']) {
    return apiClient.post(`/${route}/favourite-recipes/${id}`, null)
  },
  removeRecipeFromFavourites(id: RecipeEntity['id']) {
    return apiClient.delete(`/${route}/favourite-recipes/${id}`)
  },
  getPlannedRecipes(date: DateYMDString) {
    return apiClient.get(`/${route}/planned-recipes/${date}`)
  },
  addRecipeToPlanned(id: RecipeEntity['id'], data: AddRecipeToPlannedRequestBody) {
    return apiClient.post(`/${route}/planned-recipes/${id}`, data)
  },
  removeRecipeFromPlanned(id: RecipeEntity['id']) {
    return apiClient.delete(`/${route}/planned-recipes/${id}`)
  },
  getSuggestedRecipes() {
    return apiClient.get(`/${route}/suggested-recipes`)
  },
  changeRecipeVisibility(id: RecipeEntity['id'], visible: boolean) {
    return apiClient.post(`/${route}/recipe-visibility/${id}`, { visible })
  },
  changeBlogVisibility(id: BlogEntity['id'], visible: boolean) {
    return apiClient.post(`/${route}/blog-visibility/${id}`, { visible })
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
