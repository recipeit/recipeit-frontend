import { RecipeEntity } from '@/typings/entities'
import { RecipesPage } from '@/typings/recipesPage'

export class RecipesPageState {
  fetching = false
  fetchingPages: { [key: number]: boolean } = {}
  items: Array<RecipeEntity> = null
  pagedItems: { [key: number]: Array<RecipeEntity> } = {}
  pagesTo: number | null = null
  totalPages: number | null = null
  totalCount: number | null = null
  hasNext: boolean | null = null

  setFromApi({ fetching, items, currentPage, totalPages, totalCount, hasNext }: RecipesPage & { fetching: boolean }) {
    this.fetching = fetching

    this.items = [...items]
    this.pagedItems = {
      [currentPage]: items
    }
    this.pagesTo = currentPage
    this.totalPages = totalPages
    this.totalCount = totalCount
    this.hasNext = hasNext
  }

  addFromApi({ items, currentPage, totalPages, totalCount, hasNext }: RecipesPage) {
    this.fetching = false

    if (this.items !== null) {
      this.items.push(...items)
    } else {
      this.items = [...items]
    }
    this.pagedItems[currentPage] = items
    this.pagesTo = currentPage
    this.totalPages = totalPages
    this.totalCount = totalCount
    this.hasNext = hasNext
  }
}
