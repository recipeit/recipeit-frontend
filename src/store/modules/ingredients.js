import groupby from 'lodash.groupby'
import sortby from 'lodash.sortby'

import ingredientsApi from '@/api/ingredientsApi'

import { PRODUCT_CATEGORY_ORDER } from '@/configs/productCategories'

export const MUTATIONS = {
  SET_BASE_INGREDIENTS: 'SET_BASE_INGREDIENTS',
  SET_UNITS: 'SET_UNITS'
}

export default {
  namespaced: true,
  state: {
    baseProducts: null,
    units: null
  },
  mutations: {
    [MUTATIONS.SET_BASE_INGREDIENTS](state, baseProducts) {
      state.baseProducts = baseProducts
    },
    [MUTATIONS.SET_UNITS](state, units) {
      state.units = units
    }
  },
  actions: {
    async fetchBaseProducts({ commit, state }) {
      if (state.baseProducts) return

      const { data: baseIngredients } = await ingredientsApi.getAllBaseProducts()

      commit(MUTATIONS.SET_BASE_INGREDIENTS, baseIngredients)
    },
    async fetchUnitsGroupedByMeasurement({ commit, state }) {
      if (state.units) return

      const { data: unitGroups } = await ingredientsApi.getAllUnitKeysGroupedByMeasurement()

      commit(MUTATIONS.SET_UNITS, unitGroups)
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
}
