import apiClient from './apiClient'

export default {
  getRecipes(queryParams) {
    return apiClient.get(`/recipes`, {
      params: queryParams
    })
  },
  getRecipe(id) {
    return apiClient.get(`/recipes/${id}`)
  },
  getDetailedRecipe(id) {
    return apiClient.get(`/recipes/${id}/detailed`)
  },
  getRecipeDetails(id) {
    return apiClient.get(`/recipes/${id}/details`)
  },
  updateKitchenByRecipe(id) {
    return apiClient.post(`/recipes/${id}/update-kitchen`, null)
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
    return apiClient.post(`/recipes/favourites/${id}`, null)
  },
  removeRecipeFromFavourites(id) {
    return apiClient.delete(`/recipes/favourites/${id}`)
  },
  getPlannedRecipes(day) {
    return apiClient.get(`/recipes/planned/${day}`)
  },
  addRecipeToPlanned(id, data) {
    return apiClient.post(`/recipes/planned/${id}`, data)
  },
  removeRecipeFromPlanned(id) {
    return apiClient.delete(`/recipes/planned/${id}`)
  },
  getSuggestedRecipes() {
    return apiClient.get(`/recipes/suggestions`)
  }
}
