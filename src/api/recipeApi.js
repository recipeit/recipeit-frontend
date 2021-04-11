import apiClient from './apiClient'

const route = 'recipes'

export default {
  getRecipes(queryParams) {
    return apiClient.get(`/${route}`, {
      params: queryParams
    })
  },
  getRecipe(id) {
    return apiClient.get(`/${route}/${id}`)
  },
  getDetailedRecipe(id) {
    return apiClient.get(`/${route}/${id}/detailed`)
  },
  getRecipeDetails(id) {
    return apiClient.get(`/${route}/${id}/details`)
  }
  // updateKitchenByRecipe(id) {
  //   return apiClient.post(`/${route}/${id}/update-kitchen`, null)
  // },
  // getAvailableRecipes(queryParams) {
  //   return apiClient.get(`/${route}/available`, {
  //     params: queryParams
  //   })
  // },
  // getAlmostAvailableRecipes(queryParams) {
  //   return apiClient.get(`/${route}/almost-available`, {
  //     params: queryParams
  //   })
  // },
  // getFavouriteRecipes() {
  //   return apiClient.get(`/${route}/favourites`)
  // },
  // getFavouriteRecipesIds() {
  //   return apiClient.get(`/${route}/favourites/ids`)
  // },
  // addRecipeToFavourites(id) {
  //   return apiClient.post(`/${route}/favourites/${id}`, null)
  // },
  // removeRecipeFromFavourites(id) {
  //   return apiClient.delete(`/${route}/favourites/${id}`)
  // },
  // getPlannedRecipes(day) {
  //   return apiClient.get(`/${route}/planned/${day}`)
  // },
  // addRecipeToPlanned(id, data) {
  //   return apiClient.post(`/${route}/planned/${id}`, data)
  // },
  // removeRecipeFromPlanned(id) {
  //   return apiClient.delete(`/${route}/planned/${id}`)
  // },
  // getSuggestedRecipes() {
  //   return apiClient.get(`/${route}/suggestions`)
  // },
  // changeRecipeVisibility(recipeId, visible) {
  //   return apiClient.post(`/${route}/${recipeId}/visibility`, { visible })
  // },
  // changeBlogVisibility(blogId, visible) {
  //   return apiClient.post(`/${route}/blogs/${blogId}/visibility`, { visible })
  // },
  // getHiddenRecipeIds() {
  //   return apiClient.get(`/${route}/hidden-recipes`)
  // }
}
