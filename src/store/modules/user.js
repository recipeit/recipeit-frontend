import identityApi from '@/api/identityApi'
import { STORAGE_REFRESH_TOKEN, STORAGE_TOKEN } from '@/constants'
import router from '@/router'

export const MUTATIONS = {
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  SET_USER_TOKEN_REFRESHING: 'SET_USER_TOKEN_REFRESHING'
}

export default {
  namespaced: true,
  state: {
    userProfile: undefined,
    userTokenRefreshing: false
  },
  mutations: {
    [MUTATIONS.SET_USER_PROFILE](state, profile) {
      state.userProfile = profile
    },
    [MUTATIONS.SET_USER_TOKEN_REFRESHING](state, refreshing) {
      state.userTokenRefreshing = refreshing
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
      return new Promise((resolve, reject) => {
        identityApi
          .register({ email, password, confirmPassword })
          .then(response => {
            const { success, errors } = response.data

            if (success) {
              router.push({
                name: 'register-success',
                params: {
                  email
                }
              })
              resolve()
            } else {
              reject(errors)
            }
          })
          .catch(error => {
            reject(error.response?.data?.errors)
          })
      })
    },
    login({ commit, dispatch }, { email, password }) {
      dispatch('recipes/resetUserData', {}, { root: true })

      return new Promise((resolve, reject) => {
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
            resolve()
          })
          .catch(error => {
            reject(error.response?.data?.errors)
          })
      })
    },
    facebookAuth({ commit, dispatch }, accessToken) {
      dispatch('recipes/resetUserData', {}, { root: true })

      return new Promise((resolve, reject) => {
        identityApi
          .facebookAuth(accessToken)
          .then(response => {
            const { userProfile } = response.data
            commit(MUTATIONS.SET_USER_PROFILE, userProfile)
            dispatch('getInitUserData')
            router.push({ name: 'home' })
            resolve()
          })
          .catch(error => {
            reject(error.response?.data?.errors)
          })
      })
    },
    googleAuth({ commit, dispatch }, idToken) {
      dispatch('recipes/resetUserData', {}, { root: true })

      return new Promise((resolve, reject) => {
        identityApi
          .googleAuth(idToken)
          .then(response => {
            const { userProfile } = response.data
            commit(MUTATIONS.SET_USER_PROFILE, userProfile)
            dispatch('getInitUserData')
            router.push({ name: 'home' })
            resolve()
          })
          .catch(error => {
            reject(error.response?.data?.errors)
          })
      })
    },
    setTokenRefreshing({ commit }, refreshing) {
      commit(MUTATIONS.SET_USER_TOKEN_REFRESHING, refreshing)
    },
    async logout({ commit, dispatch }) {
      await identityApi.logout()

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
    isAuthenticated: state => state.userProfile !== null && state.userProfile !== undefined,
    isUserTokenRefreshing: state => state.userTokenRefreshing
  }
}
