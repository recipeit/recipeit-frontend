import { apiClient } from './apiClient'

export default {
  getRecipes() {
    return apiClient.get(`/recipes`)
  },
  getRecipe(id) {
    return apiClient.get(`/recipes/${id}`)
  },
  getRecipeDetails(id) {
    return apiClient.get(`/recipes/${id}/details`)
  },
  updateKitchenByRecipe(id) {
    return apiClient.post(`/recipes/${id}/update-kitchen`)
  },
  getAvailableRecipes(queryParams) {
    return apiClient.get(`/recipes/available`, {
      params: queryParams
    })
  },
  getAlmostAvailableRecipes(queryParams) {
    return apiClient.get(`/recipes/almost-available`, {
      params: queryParams
    })
  },
  getFavouriteRecipes() {
    return apiClient.get(`/recipes/favourites`)
  },
  getFavouriteRecipesIds() {
    return apiClient.get(`/recipes/favourites/ids`)
  },
  addRecipeToFavourites(id) {
    return apiClient.post(`/recipes/favourites/${id}`)
  },
  removeRecipeFromFavourites(id) {
    return apiClient.delete(`/recipes/favourites/${id}`)
  },
  getPlannedRecipes() {
    return apiClient.get(`/recipes/planned`)
  },
  addRecipeToPlanned(id) {
    return apiClient.post(`/recipes/planned/${id}`)
  },
  removeRecipeFromPlanned(id) {
    return apiClient.delete(`/recipes/planned/${id}`)
  },
  getSuggestedRecipes() {
    return apiClient.get(`/recipes/suggestions`)
  }
}
