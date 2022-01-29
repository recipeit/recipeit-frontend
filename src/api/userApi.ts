import apiClient from '@/api/apiClient'
import { AxiosResponse } from 'axios'

const route = 'user'

interface Recipe {
  slug: string
  name: string
}

interface RecipesFilteredPage {
  items: Array<Recipe>
}

interface RecipesPage {
  items: Array<Recipe>
}

interface RecipesPageQueryParams {
  pageNumber?: number
  search: string
  // RecipesOrderMethod? OrderMethod { get; set; }
  // Dictionary<RecipeFilter, string> Filters { get; set; }
}

interface PagedListRequestQuery {
  pageNumber?: number
}

export default {
  getAvailableRecipesCount(queryParams) {
    return apiClient.get(`/${route}/available-recipes/count`, {
      params: queryParams
    })
  },
  getAvailableRecipes(queryParams) {
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
  addRecipeToFavourites(id) {
    return apiClient.post(`/${route}/favourite-recipes/${id}`, null)
  },
  removeRecipeFromFavourites(id) {
    return apiClient.delete(`/${route}/favourite-recipes/${id}`)
  },
  getPlannedRecipes(day) {
    return apiClient.get(`/${route}/planned-recipes/${day}`)
  },
  addRecipeToPlanned(id, data) {
    return apiClient.post(`/${route}/planned-recipes/${id}`, data)
  },
  removeRecipeFromPlanned(id) {
    return apiClient.delete(`/${route}/planned-recipes/${id}`)
  },
  getSuggestedRecipes() {
    return apiClient.get(`/${route}/suggested-recipes`)
  },
  changeRecipeVisibility(recipeId, visible) {
    return apiClient.post(`/${route}/recipe-visibility/${recipeId}`, { visible })
  },
  changeBlogVisibility(blogId, visible) {
    return apiClient.post(`/${route}/blog-visibility/${blogId}`, { visible })
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
