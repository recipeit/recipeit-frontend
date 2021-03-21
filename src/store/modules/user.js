import identityApi from '@/api/identityApi'
import { STORAGE_REFRESH_TOKEN, STORAGE_TOKEN } from '@/constants'
import router from '@/router'

export const MUTATIONS = {
  SET_USER_PROFILE: 'SET_USER_PROFILE'
}

export default {
  namespaced: true,
  state: {
    userProfile: undefined
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
    fetchUserProfile({ commit, dispatch }, { getInitUserData }) {
      identityApi
        .profile()
        .then(response => {
          const { userProfile } = response.data
          commit(MUTATIONS.SET_USER_PROFILE, userProfile)
          if (getInitUserData) {
            dispatch('getInitUserData')
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    register(_, { email, password, confirmPassword }) {
      identityApi
        .register({ email, password, confirmPassword })
        .then(response => {
          const { success } = response.data

          if (success) {
            router.push({
              name: 'register-success',
              params: {
                email
              }
            })
          } else {
            console.log('error')
          }
          // const { token, refreshToken } = response.data
          // localStorage.setItem(STORAGE_TOKEN, token)
          // localStorage.setItem(STORAGE_REFRESH_TOKEN, refreshToken)
          // router.push({ name: 'home' })
        })
        .catch(error => {
          console.error(error)
        })
    },
    login({ commit, dispatch }, { email, password }) {
      identityApi
        .login({ email, password })
        .then(response => {
          if (response.data.emailUnconfirmed) {
            router.push({
              name: 'register-success',
              params: {
                email
              }
            })
          } else {
            const { token, refreshToken, userProfile } = response.data
            localStorage.setItem(STORAGE_TOKEN, token)
            localStorage.setItem(STORAGE_REFRESH_TOKEN, refreshToken)
            commit(MUTATIONS.SET_USER_PROFILE, userProfile)
            dispatch('getInitUserData')
            router.push({ name: 'home' })
          }
        })
        .catch(error => {
          console.error(error)
        })
    },
    facebookAuth({ commit, dispatch }, accessToken) {
      identityApi
        .facebookAuth(accessToken)
        .then(response => {
          const { token, refreshToken, userProfile } = response.data
          localStorage.setItem(STORAGE_TOKEN, token)
          localStorage.setItem(STORAGE_REFRESH_TOKEN, refreshToken)
          commit(MUTATIONS.SET_USER_PROFILE, userProfile)
          dispatch('getInitUserData')
          router.push({ name: 'home' })
        })
        .catch(error => {
          console.error(error)
        })
    },
    googleAuth({ commit, dispatch }, idToken) {
      identityApi
        .googleAuth(idToken)
        .then(response => {
          const { token, refreshToken, userProfile } = response.data
          localStorage.setItem(STORAGE_TOKEN, token)
          localStorage.setItem(STORAGE_REFRESH_TOKEN, refreshToken)
          commit(MUTATIONS.SET_USER_PROFILE, userProfile)
          dispatch('getInitUserData')
          router.push({ name: 'home' })
        })
        .catch(error => {
          console.error(error)
        })
    },
    refresh({ commit }) {
      const currentToken = localStorage.getItem(STORAGE_TOKEN)
      const currentRefreshToken = localStorage.getItem(STORAGE_REFRESH_TOKEN)

      return new Promise((resolve, reject) => {
        if (!currentToken || !currentRefreshToken) {
          reject()
        } else {
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
        }
      })
    },
    logout({ commit, dispatch }) {
      localStorage.removeItem(STORAGE_TOKEN)
      localStorage.removeItem(STORAGE_REFRESH_TOKEN)

      commit(MUTATIONS.SET_USER_PROFILE, null)

      router.push({ name: 'login' })

      dispatch('shoppingList/resetUserData', {}, { root: true })
      dispatch('myKitchen/resetUserData', {}, { root: true })
      dispatch('recipes/resetUserData', {}, { root: true })
    },
    getInitUserData({ dispatch }) {
      dispatch('recipes/fetchFavouriteRecipesIds', {}, { root: true })
    }
  },
  getters: {
    isAuthenticated: state => state.userProfile !== null && state.userProfile !== undefined
  }
}
