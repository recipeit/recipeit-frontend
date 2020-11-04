import axios from 'axios'

const apiClient = axios.create({
  // baseURL: 'http://localhost:3000',
  // baseURL: 'https://localhost:44388',
  baseURL: 'https://recipeit-backend20201105000045.azurewebsites.net',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getRecipes() {
    return apiClient.get(`/recipes`)
  },
  getAvailableRecipes() {
    return apiClient.get(`/recipes/available`)
  },
  getAlmostAvailableRecipes() {
    return apiClient.get(`/recipes/almost-available`)
  },
  getRecipe(id) {
    return apiClient.get(`/recipes/${id}`)
  },
  getRecipeDetails(id) {
    return apiClient.get(`/recipes/${id}/details`)
  }
}
