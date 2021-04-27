import ingredientsApi from '@/api/ingredientsApi'

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
    fetchBaseProducts({ commit, state }) {
      if (state.baseProducts) return

      ingredientsApi.getAllBaseProducts().then(({ data }) => {
        commit(MUTATIONS.SET_BASE_INGREDIENTS, data)
      })
    },
    fetchUnitsGroupedByMeasurement({ commit, state }) {
      if (state.units) return

      ingredientsApi.getAllUnitKeysGroupedByMeasurement().then(({ data }) => {
        commit(MUTATIONS.SET_UNITS, data)
      })
    }
  }
}
