import _ from 'lodash'

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
    groupedBaseProducts: state =>
      _(state.baseProducts)
        .sortBy(({ baseProductName }) => baseProductName)
        .groupBy(({ category }) => category)
        .toPairs()
        .sortBy(([group]) => PRODUCT_CATEGORY_ORDER[group])
        .value()
        .map(([groupKey, groupValues]) => ({
          groupKey,
          groupValues
        }))
  }
}
