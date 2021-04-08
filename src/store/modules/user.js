import identityApi from '@/api/identityApi'
import userApi from '@/api/userApi'
import { ToastType } from '@/plugins/toast/toastType'
import toastPlugin from '@/plugins/toast'
import router from '@/router'

export const USER_AUTH_STATE = {
  USER_LOGGED_IN: 'USER_LOGGED_IN',
  USER_FETCHING: 'USER_FETCHING',
  USER_LOGGED_OUT: 'USER_LOGGED_OUT'
}

export const MUTATIONS = {
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
    userProfile: undefined,
    userAuthState: USER_AUTH_STATE.USER_LOGGED_OUT,
    hiddenRecipeIds: null,
    hiddenBlogIds: null
    // userTokenRefreshing: false
  },
  mutations: {
    [MUTATIONS.SET_USER_PROFILE](state, profile) {
      state.userProfile = profile
    },
    [MUTATIONS.SET_USER_AUTH_STATE](state, userAuthState) {
      state.userAuthState = userAuthState
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
    fetchUserProfile({ commit, dispatch }, { getInitUserData }) {
      return new Promise((resolve, reject) => {
        identityApi
          .profile()
          .then(response => {
            const { userProfile } = response.data
            commit(MUTATIONS.SET_USER_PROFILE, userProfile)
            commit(MUTATIONS.SET_USER_AUTH_STATE, USER_AUTH_STATE.USER_LOGGED_IN)
            if (getInitUserData) {
              dispatch('getInitUserData')
            }
            resolve()
          })
          .catch(error => {
            reject(error)
          })
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
    facebookAuth({ commit, dispatch }, accessToken) {
      dispatch('recipes/resetUserData', {}, { root: true })

      return new Promise((resolve, reject) => {
        identityApi
          .facebookAuth(accessToken)
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
    googleAuth({ commit, dispatch }, idToken) {
      dispatch('recipes/resetUserData', {}, { root: true })

      return new Promise((resolve, reject) => {
        identityApi
          .googleAuth(idToken)
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
          if (router.currentRoute.value.fullPath.startsWith('/app')) {
            sessionStorage.setItem('LOGIN_REDIRECT', router.currentRoute.value.fullPath)
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
    async logout({ commit, dispatch }) {
      await identityApi.logout()

      commit(MUTATIONS.SET_USER_PROFILE, null)

      if (router.currentRoute.value.fullPath.startsWith('/app')) {
        sessionStorage.setItem('LOGIN_REDIRECT', router.currentRoute.value.fullPath)
        router.push({ name: 'login' })
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
    },
    fetchHiddenRecipeIds({ commit }) {
      userApi.getHiddenRecipes().then(({ data }) => {
        commit(MUTATIONS.SET_HIDDEN_RECIPE_IDS, data.recipeIds)
      })
    },
    fetchHiddenBlogIds({ commit }) {
      userApi.getHiddenBlogs().then(({ data }) => {
        commit(MUTATIONS.SET_HIDDEN_BLOG_IDS, data.blogIds)
      })
    },
    changeRecipeVisibility({ commit }, { recipeId, visible }) {
      userApi
        .changeRecipeVisibility(recipeId, visible)
        .then(({ data }) => {
          if (data.success) {
            commit(visible ? MUTATIONS.REMOVE_FROM_HIDDEN_RECIPE_IDS : MUTATIONS.ADD_TO_HIDDEN_RECIPE_IDS, recipeId)
            toastPlugin.toast.show(visible ? 'Przepis został odkryty' : 'Przepis nie będzie już widoczny', ToastType.SUCCESS)
          } else {
            toastPlugin.toast.show('Wystapił błąd. Spróbuj ponownie', ToastType.ERROR)
            // this.$toast.show('Nie udało się ukryć przepisu. Spróbuj ponownie', ToastType.ERROR)
          }
        })
        .catch(() => {
          toastPlugin.toast.show('Wystapił błąd. Spróbuj ponownie', ToastType.ERROR)
        })
    },
    changeBlogVisibility({ commit }, { blogId, visible }) {
      userApi
        .changeBlogVisibility(blogId, visible)
        .then(({ data }) => {
          if (data.success) {
            commit(visible ? MUTATIONS.REMOVE_FROM_HIDDEN_BLOG_IDS : MUTATIONS.ADD_TO_HIDDEN_BLOG_IDS, blogId)
            toastPlugin.toast.show(
              visible ? 'Przepisy z tego blogu zostały odkryte' : 'Przepisy z tego blogu nie będą już widoczne',
              ToastType.SUCCESS
            )
          } else {
            toastPlugin.toast.show('Wystapił błąd. Spróbuj ponownie', ToastType.ERROR)
            // this.$toast.show('Nie udało się ukryć przepisu. Spróbuj ponownie', ToastType.ERROR)
          }
        })
        .catch(() => {
          toastPlugin.toast.show('Wystapił błąd. Spróbuj ponownie', ToastType.ERROR)
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
