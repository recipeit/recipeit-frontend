import identityApi from '@/api/identityApi'
import { STORAGE_REFRESH_TOKEN, STORAGE_TOKEN } from '@/constants'

export const MUTATIONS = {
  SET_USER_PROFILE: 'SET_USER_PROFILE'
}

export default {
  namespaced: true,
  state: {
    userProfile: null
  },
  mutations: {
    [MUTATIONS.SET_USER_PROFILE](state, profile) {
      state.userProfile = profile
    }
  },
  actions: {
    setUserProfile({ commit }, profile) {
      commit(MUTATIONS.SET_USER_PROFILE, profile)
    },
    fetchUserProfile({ commit }) {
      identityApi
        .profile()
        .then(response => {
          const { userProfile } = response.data
          commit(MUTATIONS.SET_USER_PROFILE, userProfile)
        })
        .catch(error => {
          console.error(error)
        })
    },
    register(_, { email, password, confirmPassword }) {
      identityApi
        .register({ email, password, confirmPassword })
        .then(response => {
          const { token, refreshToken } = response.data
          localStorage.setItem(STORAGE_TOKEN, token)
          localStorage.setItem(STORAGE_REFRESH_TOKEN, refreshToken)
        })
        .catch(error => {
          console.error(error)
        })
    },
    login({ commit }, { email, password }) {
      identityApi
        .login({ email, password })
        .then(response => {
          const { token, refreshToken, userProfile } = response.data
          localStorage.setItem(STORAGE_TOKEN, token)
          localStorage.setItem(STORAGE_REFRESH_TOKEN, refreshToken)
          commit(MUTATIONS.SET_USER_PROFILE, userProfile)
        })
        .catch(error => {
          console.error(error)
        })
    },
    refresh({ commit }) {
      const currentToken = localStorage.getItem(STORAGE_TOKEN)
      const currentRefreshToken = localStorage.getItem(STORAGE_REFRESH_TOKEN)

      return new Promise((resolve, reject) => {
        identityApi
          .refresh({ token: currentToken, refreshToken: currentRefreshToken })
          .then(response => {
            const {
              data: { token, refreshToken, userProfile }
            } = response
            localStorage.setItem(STORAGE_TOKEN, token)
            localStorage.setItem(STORAGE_REFRESH_TOKEN, refreshToken)
            commit(MUTATIONS.SET_USER_PROFILE, userProfile)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    logout({ commit, dispatch }) {
      localStorage.removeItem(STORAGE_TOKEN)
      localStorage.removeItem(STORAGE_REFRESH_TOKEN)
      commit(MUTATIONS.SET_USER_PROFILE, null)
      dispatch('shoppingList/resetUserData', {}, { root: true })
      dispatch('myKitchen/resetUserData', {}, { root: true })
      dispatch('recipes/resetUserData', {}, { root: true })
    }
  },
  getters: {
    isAuthenticated: state => state.userProfile !== null
  }
}
