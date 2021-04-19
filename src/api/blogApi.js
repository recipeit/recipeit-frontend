import apiClient from './apiClient'

const route = 'blogs'

export default {
  getBlogDetails(blogId) {
    return apiClient.get(`/${route}/${blogId}`)
  },
  getBlogRecipes(blogId, queryParams) {
    return apiClient.get(`/${route}/${blogId}/recipes`, {
      params: queryParams
    })
  }
}
