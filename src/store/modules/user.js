import identityApi from '@/api/identityApi'
import userApi from '@/api/userApi'

import { THEMES, THEME_DEFAULT, THEME_STORAGE_KEY } from '@/configs/theme'

import toastPlugin from '@/plugins/toast'
import { ToastType } from '@/plugins/toast/toastType'

import router from '@/router'
import { APP_PATHS } from '@/router/paths'

export const USER_AUTH_STATE = {
  USER_APP_INITIAL: 'USER_APP_INITIAL',
  USER_LOGGED_IN: 'USER_LOGGED_IN',
  USER_FETCHING: 'USER_FETCHING',
  USER_LOGGED_OUT: 'USER_LOGGED_OUT'
}

export const MUTATIONS = {
  SET_THEME: 'SET_THEME',

  SET_USER_PROFILE: 'SET_USER_PROFILE',
  SET_USER_AUTH_STATE: 'SET_USER_AUTH_STATE',

  SET_HIDDEN_RECIPE_IDS: 'SET_HIDDEN_RECIPE_IDS',
  ADD_TO_HIDDEN_RECIPE_IDS: 'ADD_TO_HIDDEN_RECIPE_IDS',
  REMOVE_FROM_HIDDEN_RECIPE_IDS: 'REMOVE_FROM_HIDDEN_RECIPE_IDS',

  SET_HIDDEN_BLOG_IDS: 'SET_HIDDEN_BLOG_IDS',
  ADD_TO_HIDDEN_BLOG_IDS: 'ADD_TO_HIDDEN_BLOG_IDS',
  REMOVE_FROM_HIDDEN_BLOG_IDS: 'REMOVE_FROM_HIDDEN_BLOG_IDS'
}

export default {
  namespaced: true,
  state: {
    theme: null,
    userProfile: undefined,
    userAuthState: USER_AUTH_STATE.USER_APP_INITIAL,
    userAuthenticatedLazy: false,
    hiddenRecipeIds: null,
    hiddenBlogIds: null
    // userTokenRefreshing: false
  },
  mutations: {
    [MUTATIONS.SET_THEME](state, theme) {
      state.theme = theme
    },

    [MUTATIONS.SET_USER_PROFILE](state, profile) {
      state.userProfile = profile
    },
    [MUTATIONS.SET_USER_AUTH_STATE](state, userAuthState) {
      state.userAuthState = userAuthState
      if (userAuthState === USER_AUTH_STATE.USER_LOGGED_IN) {
        state.userAuthenticatedLazy = true
      } else if (userAuthState === USER_AUTH_STATE.USER_LOGGED_OUT) {
        state.userAuthenticatedLazy = false
      }
    },

    [MUTATIONS.SET_HIDDEN_RECIPE_IDS](state, hiddenRecipeIds) {
      state.hiddenRecipeIds = hiddenRecipeIds
    },
    [MUTATIONS.ADD_TO_HIDDEN_RECIPE_IDS](state, newHiddenRecipeId) {
      state.hiddenRecipeIds.push(newHiddenRecipeId)
    },
    [MUTATIONS.REMOVE_FROM_HIDDEN_RECIPE_IDS](state, removedHiddenRecipeId) {
      var recipeIndex = state.hiddenRecipeIds.indexOf(removedHiddenRecipeId)
      if (recipeIndex >= 0) {
        state.hiddenRecipeIds.splice(recipeIndex, 1)
      }
    },

    [MUTATIONS.SET_HIDDEN_BLOG_IDS](state, hiddenBlogIds) {
      state.hiddenBlogIds = hiddenBlogIds
    },
    [MUTATIONS.ADD_TO_HIDDEN_BLOG_IDS](state, newHiddenBlogId) {
      state.hiddenBlogIds.push(newHiddenBlogId)
    },
    [MUTATIONS.REMOVE_FROM_HIDDEN_BLOG_IDS](state, removedHiddenBlogId) {
      var blogIndex = state.hiddenBlogIds.indexOf(removedHiddenBlogId)
      if (blogIndex >= 0) {
        state.hiddenBlogIds.splice(blogIndex, 1)
      }
    }
  },
  actions: {
    initTheme({ commit }) {
      let currentTheme = localStorage.getItem(THEME_STORAGE_KEY)
      if (!currentTheme || !THEMES.includes(currentTheme)) {
        currentTheme = THEME_DEFAULT
      }
      commit(MUTATIONS.SET_THEME, currentTheme)
    },
    setTheme({ commit }, theme) {
      if (THEMES.includes(theme)) {
        commit(MUTATIONS.SET_THEME, theme)
        localStorage.setItem(THEME_STORAGE_KEY, theme)
      }
    },
    async fetchUserProfile({ commit, dispatch }, { getInitUserData } = {}) {
      try {
        const {
          data: { userProfile }
        } = await identityApi.profile()

        commit(MUTATIONS.SET_USER_PROFILE, userProfile)
        commit(MUTATIONS.SET_USER_AUTH_STATE, USER_AUTH_STATE.USER_LOGGED_IN)

        if (getInitUserData) {
          dispatch('getInitUserData')
        }
      } catch (e) {
        commit(MUTATIONS.SET_USER_AUTH_STATE, USER_AUTH_STATE.USER_LOGGED_OUT)
        throw new Error(e)
      }
    },
    register({ commit, dispatch }, { email, password, confirmPassword, recaptchaToken }) {
      return new Promise((resolve, reject) => {
        identityApi
          .register({ email, password, confirmPassword, recaptchaToken })
          .then(async response => {
            const { success, errors, userProfile } = response.data

            if (success) {
              commit(MUTATIONS.SET_USER_PROFILE, userProfile)
              commit(MUTATIONS.SET_USER_AUTH_STATE, USER_AUTH_STATE.USER_LOGGED_IN)
              dispatch('getInitUserData')
              const redirectUrl = sessionStorage.getItem('LOGIN_REDIRECT')
              if (redirectUrl) {
                router.push(redirectUrl)
                sessionStorage.removeItem('LOGIN_REDIRECT')
              } else {
                router.push({ name: 'home' })
              }

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
    login({ commit, dispatch }, { email, password, recaptchaToken }) {
      dispatch('recipes/resetUserData', {}, { root: true })

      return new Promise((resolve, reject) => {
        identityApi
          .login({ email, password, recaptchaToken })
          .then(response => {
            if (response.data.emailUnconfirmed) {
              router.push({
                name: 'register-success',
                params: {
                  email
                }
              })
            } else {
              const { userProfile } = response.data
              commit(MUTATIONS.SET_USER_PROFILE, userProfile)
              commit(MUTATIONS.SET_USER_AUTH_STATE, USER_AUTH_STATE.USER_LOGGED_IN)
              dispatch('getInitUserData')
              const redirectUrl = sessionStorage.getItem('LOGIN_REDIRECT')
              if (redirectUrl) {
                router.push(redirectUrl)
                sessionStorage.removeItem('LOGIN_REDIRECT')
              } else {
                router.push({ name: 'home' })
              }
            }
            resolve()
          })
          .catch(error => {
            reject(error.response?.data?.errors)
          })
      })
    },
    facebookAuth({ commit, dispatch }, { accessToken }) {
      dispatch('recipes/resetUserData', {}, { root: true })

      return new Promise((resolve, reject) => {
        identityApi
          .facebookAuth({ accessToken })
          .then(response => {
            const { userProfile } = response.data
            commit(MUTATIONS.SET_USER_PROFILE, userProfile)
            commit(MUTATIONS.SET_USER_AUTH_STATE, USER_AUTH_STATE.USER_LOGGED_IN)
            dispatch('getInitUserData')
            const redirectUrl = sessionStorage.getItem('LOGIN_REDIRECT')
            if (redirectUrl) {
              router.push(redirectUrl)
              sessionStorage.removeItem('LOGIN_REDIRECT')
            } else {
              router.push({ name: 'home' })
            }
            resolve()
          })
          .catch(error => {
            reject(error.response?.data?.errors)
          })
      })
    },
    googleAuth({ commit, dispatch }, { idToken }) {
      dispatch('recipes/resetUserData', {}, { root: true })

      return new Promise((resolve, reject) => {
        identityApi
          .googleAuth({ idToken })
          .then(response => {
            const { userProfile } = response.data
            commit(MUTATIONS.SET_USER_PROFILE, userProfile)
            commit(MUTATIONS.SET_USER_AUTH_STATE, USER_AUTH_STATE.USER_LOGGED_IN)
            dispatch('getInitUserData')
            const redirectUrl = sessionStorage.getItem('LOGIN_REDIRECT')
            if (redirectUrl) {
              router.push(redirectUrl)
              sessionStorage.removeItem('LOGIN_REDIRECT')
            } else {
              router.push({ name: 'home' })
            }
            resolve()
          })
          .catch(error => {
            reject(error.response?.data?.errors)
          })
      })
    },
    refreshCookie({ commit, dispatch, state }) {
      return new Promise((resolve, reject) => {
        if (state.userAuthState === USER_AUTH_STATE.USER_FETCHING) {
          resolve({ isFetching: true })
          return
        }

        commit(MUTATIONS.SET_USER_AUTH_STATE, USER_AUTH_STATE.USER_FETCHING)

        const onRefreshCookieError = () => {
          commit(MUTATIONS.SET_USER_AUTH_STATE, USER_AUTH_STATE.USER_LOGGED_OUT)

          if (APP_PATHS.some(path => location.pathname.startsWith(path))) {
            sessionStorage.setItem('LOGIN_REDIRECT', location.pathname)
          }

          dispatch('logout')
          reject()
        }

        const onRefreshCookieSuccess = ({ userProfile }) => {
          if (userProfile) {
            commit(MUTATIONS.SET_USER_PROFILE, userProfile)
          }
          commit(MUTATIONS.SET_USER_AUTH_STATE, USER_AUTH_STATE.USER_LOGGED_IN)
          resolve()
        }

        identityApi
          .refreshCookie()
          .then(({ status, data }) => {
            if (status === 200) {
              onRefreshCookieSuccess(data)
            } else {
              onRefreshCookieError()
            }
          })
          .catch(() => {
            onRefreshCookieError()
          })
      })
    },
    async logout({ commit, dispatch }, withoutRedirect) {
      await identityApi.logout()

      commit(MUTATIONS.SET_USER_PROFILE, null)
      commit(MUTATIONS.SET_USER_AUTH_STATE, USER_AUTH_STATE.USER_LOGGED_OUT)

      if (APP_PATHS.some(path => location.pathname.startsWith(path))) {
        if (!withoutRedirect) {
          sessionStorage.setItem('LOGIN_REDIRECT', location.pathname)
        }
        await router.push({ name: 'login' })
      }

      dispatch('shoppingList/resetUserData', {}, { root: true })
      dispatch('myKitchen/resetUserData', {}, { root: true })
      dispatch('recipes/resetUserData', {}, { root: true })
      dispatch('user/resetUserData', {}, { root: true })
    },
    getInitUserData({ dispatch }) {
      dispatch('recipes/fetchFavouriteRecipesIds', {}, { root: true })
      dispatch('user/fetchHiddenRecipeIds', {}, { root: true })
      dispatch('user/fetchHiddenBlogIds', {}, { root: true })
      dispatch('ingredients/fetchBaseProducts', {}, { root: true }) // TODO once
      dispatch('ingredients/fetchUnitsGroupedByMeasurement', {}, { root: true }) // TODO once
      dispatch('myKitchen/fetchProducts', {}, { root: true }) // TODO only base ids
    },
    fetchHiddenRecipeIds({ commit }) {
      userApi.getHiddenRecipeIds().then(({ data }) => {
        commit(MUTATIONS.SET_HIDDEN_RECIPE_IDS, data.recipeIds)
      })
    },
    fetchHiddenBlogIds({ commit }) {
      userApi.getHiddenBlogIds().then(({ data }) => {
        commit(MUTATIONS.SET_HIDDEN_BLOG_IDS, data.blogIds)
      })
    },
    changeRecipeVisibility({ commit }, { recipeId, visible }) {
      return new Promise((resolve, reject) => {
        userApi
          .changeRecipeVisibility(recipeId, visible)
          .then(({ data }) => {
            if (data.success) {
              commit(visible ? MUTATIONS.REMOVE_FROM_HIDDEN_RECIPE_IDS : MUTATIONS.ADD_TO_HIDDEN_RECIPE_IDS, recipeId)
              resolve()
              toastPlugin.toast.show(visible ? 'Przepis został odkryty' : 'Przepis nie będzie już widoczny', ToastType.SUCCESS)
            } else {
              reject()
              toastPlugin.toast.show('Wystapił błąd. Spróbuj ponownie', ToastType.ERROR)
              // this.$toast.show('Nie udało się ukryć przepisu. Spróbuj ponownie', ToastType.ERROR)
            }
          })
          .catch(() => {
            reject()
            toastPlugin.toast.show('Wystapił błąd. Spróbuj ponownie', ToastType.ERROR)
          })
      })
    },
    changeBlogVisibility({ commit }, { blogId, visible }) {
      return new Promise((resolve, reject) => {
        userApi
          .changeBlogVisibility(blogId, visible)
          .then(({ data }) => {
            if (data.success) {
              commit(visible ? MUTATIONS.REMOVE_FROM_HIDDEN_BLOG_IDS : MUTATIONS.ADD_TO_HIDDEN_BLOG_IDS, blogId)
              resolve()
              toastPlugin.toast.show(
                visible ? 'Przepisy z tego blogu zostały odkryte' : 'Przepisy z tego blogu nie będą już widoczne',
                ToastType.SUCCESS
              )
            } else {
              reject()
              toastPlugin.toast.show('Wystapił błąd. Spróbuj ponownie', ToastType.ERROR)
              // this.$toast.show('Nie udało się ukryć przepisu. Spróbuj ponownie', ToastType.ERROR)
            }
          })
          .catch(() => {
            reject()
            toastPlugin.toast.show('Wystapił błąd. Spróbuj ponownie', ToastType.ERROR)
          })
      })
    },
    resetUserData({ commit }) {
      commit(MUTATIONS.SET_HIDDEN_BLOG_IDS, null)
      commit(MUTATIONS.SET_HIDDEN_RECIPE_IDS, null)
    }
  },
  getters: {
    isAuthenticated: state => state.userProfile !== null && state.userAuthState === USER_AUTH_STATE.USER_LOGGED_IN,
    currentUserAuthState: state => state.userAuthState,
    isRecipeHidden: state => id => state.hiddenRecipeIds?.includes(id),
    isBlogHidden: state => id => state.hiddenBlogIds?.includes(id)
  }
}
