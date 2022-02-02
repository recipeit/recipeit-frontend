import apiClient from '@/api/apiClient'

import { BlogEntity } from '@/typings/entities'
import { RecipesPage, RecipesPageQueryParams } from '@/typings/recipesPage'

const route = 'blogs'

export default {
  getBlogDetails(id: BlogEntity['id']) {
    return apiClient.get<BlogEntity>(`/${route}/${id}`)
  },
  getBlogRecipes(id: BlogEntity['id'], queryParams: RecipesPageQueryParams) {
    return apiClient.get<RecipesPage>(`/${route}/${id}/recipes`, {
      params: queryParams
    })
  }
}
