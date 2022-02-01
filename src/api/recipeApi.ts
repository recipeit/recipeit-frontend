import apiClient from '@/api/apiClient'

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
  addMissingIngredientsToShoppingList(id) {
    return apiClient.post(`/${route}/${id}/add-missing-ingredients-to-shopping-list`)
  },
  getPopularCategories() {
    return apiClient.get(`/${route}/popular-categories`)
  }
}
