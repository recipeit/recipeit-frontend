import { AxiosResponse } from 'axios'

import apiClient from '@/api/apiClient'

import { DateYMDString } from '@/typings/date'
import { BlogEntity, RecipeEntity } from '@/typings/entities'
import { RecipesPageQueryParams } from '@/typings/recipesPage'

const route = 'user'

type Recipe = {
  slug: string
  name: string
}

type RecipesFilteredPage = {
  items: Array<Recipe>
}

type RecipesPage = {
  items: Array<Recipe>
}

type PagedListRequestQuery = {
  pageNumber?: number
}

export type AddRecipeToPlannedRequestBody = {
  day: DateYMDString
  timeOfDay: string
}

export default {
  getAvailableRecipesCount(queryParams?: RecipesPageQueryParams) {
    return apiClient.get(`/${route}/available-recipes/count`, {
      params: queryParams
    })
  },
  getAvailableRecipes(queryParams?: RecipesPageQueryParams) {
    return apiClient.get(`/${route}/available-recipes`, {
      params: queryParams
    })
  },
  getAlmostAvailableRecipes(queryParams?: RecipesPageQueryParams): Promise<AxiosResponse<RecipesFilteredPage>> {
    return apiClient.get(`/${route}/almost-available-recipes`, {
      params: queryParams
    })
  },
  getFavouriteRecipes(queryParams?: PagedListRequestQuery): Promise<AxiosResponse<RecipesPage>> {
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
    return apiClient.get(`/${route}/hidden-recipes`)
  },
  getHiddenBlogs() {
    return apiClient.get(`/${route}/hidden-blogs`)
  },
  getHiddenRecipeIds() {
    return apiClient.get(`/${route}/hidden-recipes/ids`)
  },
  getHiddenBlogIds() {
    return apiClient.get(`/${route}/hidden-blogs/ids`)
  }
}
