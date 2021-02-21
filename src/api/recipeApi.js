import CLIENT from './apiClient'

export default {
  getRecipes(queryParams) {
    return CLIENT.apiClient.get(`/recipes`, {
      params: queryParams,
      headers: CLIENT.authHeader()
    })
  },
  getRecipe(id) {
    return CLIENT.apiClient.get(`/recipes/${id}`)
  },
  getDetailedRecipe(id) {
    return CLIENT.apiClient.get(`/recipes/${id}/detailed`)
  },
  getRecipeDetails(id) {
    return CLIENT.apiClient.get(`/recipes/${id}/details`)
  },
  updateKitchenByRecipe(id) {
    return CLIENT.apiClient.post(`/recipes/${id}/update-kitchen`, null, {
      headers: CLIENT.authHeader()
    })
  },
  getAvailableRecipes(queryParams) {
    return CLIENT.apiClient.get(`/recipes/available`, {
      params: queryParams,
      headers: CLIENT.authHeader()
    })
  },
  getAlmostAvailableRecipes(queryParams) {
    return CLIENT.apiClient.get(`/recipes/almost-available`, {
      params: queryParams,
      headers: CLIENT.authHeader()
    })
  },
  getFavouriteRecipes() {
    return CLIENT.apiClient.get(`/recipes/favourites`, {
      headers: CLIENT.authHeader()
    })
  },
  getFavouriteRecipesIds() {
    return CLIENT.apiClient.get(`/recipes/favourites/ids`, {
      headers: CLIENT.authHeader()
    })
  },
  addRecipeToFavourites(id) {
    return CLIENT.apiClient.post(`/recipes/favourites/${id}`, null, {
      headers: CLIENT.authHeader()
    })
  },
  removeRecipeFromFavourites(id) {
    return CLIENT.apiClient.delete(`/recipes/favourites/${id}`, {
      headers: CLIENT.authHeader()
    })
  },
  getPlannedRecipes() {
    return CLIENT.apiClient.get(`/recipes/planned`, {
      headers: CLIENT.authHeader()
    })
  },
  addRecipeToPlanned(id) {
    return CLIENT.apiClient.post(`/recipes/planned/${id}`, null, {
      headers: CLIENT.authHeader()
    })
  },
  removeRecipeFromPlanned(id) {
    return CLIENT.apiClient.delete(`/recipes/planned/${id}`, {
      headers: CLIENT.authHeader()
    })
  },
  getSuggestedRecipes() {
    return CLIENT.apiClient.get(`/recipes/suggestions`, {
      headers: CLIENT.authHeader()
    })
  }
}
