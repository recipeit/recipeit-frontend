import groupby from 'lodash.groupby'
import sortby from 'lodash.sortby'
import { defineStore } from 'pinia'

import ingredientsApi from '@/api/ingredientsApi'

import { PRODUCT_CATEGORY_ORDER } from '@/configs/productCategories'

export const useIngredientsStore = defineStore('ingredients', {
  state: () => {
    return {
      baseProducts: null,
      units: null
    }
  },

  actions: {
    async fetchBaseProducts() {
      if (this.baseProducts) return

      const { data: baseIngredients } = await ingredientsApi.getAllBaseProducts()

      this.baseProducts = baseIngredients
    },

    async fetchUnitsGroupedByMeasurement() {
      if (this.units) return

      const { data: unitGroups } = await ingredientsApi.getAllUnitKeysGroupedByMeasurement()

      this.units = unitGroups
    }
  },

  getters: {
    groupedBaseProducts(state) {
      const sorted = sortby(state.baseProducts, 'baseProductName')
      const grouped = groupby(sorted, 'category')
      const sortedGroups = sortby(Object.entries(grouped), ([group]) => PRODUCT_CATEGORY_ORDER[group])

      return sortedGroups.map(([groupKey, groupValues]) => ({
        groupKey,
        groupValues
      }))
    }
  }
})
