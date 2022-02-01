import { defineStore } from 'pinia'

import identityApi from '@/api/identityApi'
import userApi from '@/api/userApi'

import { THEMES, THEME_DEFAULT, THEME_STORAGE_KEY } from '@/configs/theme'

import toastPlugin from '@/plugins/toast'
import { ToastType } from '@/plugins/toast/toastType'

import router from '@/router'
import { APP_PATHS } from '@/router/paths'

import { useIngredientsStore } from '@/stores/ingredients'
import { useMyKitchenStore } from '@/stores/myKitchen'
import { useRecipesStore } from '@/stores/recipes'
import { useShoppingListStore } from '@/stores/shoppingList'

export const USER_AUTH_STATE = {
  USER_APP_INITIAL: 'USER_APP_INITIAL',
  USER_LOGGED_IN: 'USER_LOGGED_IN',
  USER_FETCHING: 'USER_FETCHING',
  USER_LOGGED_OUT: 'USER_LOGGED_OUT'
}

const setUserAuthState = (store, userAuthState) => {
  store.userAuthState = userAuthState
  if (userAuthState === USER_AUTH_STATE.USER_LOGGED_IN) {
    store.userAuthenticatedLazy = true
  } else if (userAuthState === USER_AUTH_STATE.USER_LOGGED_OUT) {
    store.userAuthenticatedLazy = false
  }
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      theme: null,
      userProfile: undefined,
      userAuthState: USER_AUTH_STATE.USER_APP_INITIAL,
      userAuthenticatedLazy: false,
      hiddenRecipeIds: null,
      hiddenBlogIds: null
    }
  },

  actions: {
    initTheme() {
      let currentTheme = localStorage.getItem(THEME_STORAGE_KEY)
      if (!currentTheme || !THEMES.includes(currentTheme)) {
        currentTheme = THEME_DEFAULT
      }
      this.theme = currentTheme
    },

    setTheme(theme) {
      if (THEMES.includes(theme)) {
        this.theme = theme
        localStorage.setItem(THEME_STORAGE_KEY, theme)
      }
    },

    async fetchUserProfile({ getInitUserData }: { getInitUserData?: boolean } = {}) {
      try {
        const {
          data: { userProfile }
        } = await identityApi.profile()

        this.userProfile = userProfile
        setUserAuthState(this, USER_AUTH_STATE.USER_LOGGED_IN)

        if (getInitUserData) {
          this.getInitUserData()
        }
      } catch (e) {
        setUserAuthState(this, USER_AUTH_STATE.USER_LOGGED_OUT)
        throw new Error(e)
      }
    },

    register({ email, password, confirmPassword, recaptchaToken }): Promise<void> {
      return new Promise((resolve, reject) => {
        identityApi
          .register({ email, password, confirmPassword, recaptchaToken })
          .then(({ data: { userProfile, emailUnconfirmed } }) => {
            if (emailUnconfirmed) {
              router.push({
                name: 'register-success',
                params: {
                  email
                }
              })
            } else {
              this.userProfile = userProfile
              setUserAuthState(this, USER_AUTH_STATE.USER_LOGGED_IN)
              this.getInitUserData()
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

    login({ email, password, recaptchaToken }): Promise<void> {
      const recipesStore = useRecipesStore()
      recipesStore.resetUserData() //TODO why only recipes

      return new Promise((resolve, reject) => {
        identityApi
          .login({ email, password, recaptchaToken })
          .then(({ data }) => {
            if (data.emailUnconfirmed) {
              router.push({
                name: 'register-success',
                params: {
                  email
                }
              })
            } else {
              const { userProfile } = data
              this.userProfile = userProfile
              setUserAuthState(this, USER_AUTH_STATE.USER_LOGGED_IN)
              this.getInitUserData()
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

    facebookAuth({ accessToken }): Promise<void> {
      const recipesStore = useRecipesStore()
      recipesStore.resetUserData() //TODO why only recipes

      return new Promise((resolve, reject) => {
        identityApi
          .facebookAuth({ accessToken })
          .then(({ data: { userProfile } }) => {
            this.userProfile = userProfile
            setUserAuthState(this, USER_AUTH_STATE.USER_LOGGED_IN)
            this.getInitUserData()
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

    googleAuth({ idToken }): Promise<void> {
      const recipesStore = useRecipesStore()
      recipesStore.resetUserData() //TODO why only recipes

      return new Promise((resolve, reject) => {
        identityApi
          .googleAuth({ idToken })
          .then(({ data: { userProfile } }) => {
            this.userProfile = userProfile
            setUserAuthState(this, USER_AUTH_STATE.USER_LOGGED_IN)
            this.getInitUserData()
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

    refreshCookie(): Promise<{ isFetching?: boolean }> {
      return new Promise((resolve, reject) => {
        if (this.userAuthState === USER_AUTH_STATE.USER_FETCHING) {
          resolve({ isFetching: true })
          return
        }

        setUserAuthState(this, USER_AUTH_STATE.USER_FETCHING)

        const onRefreshCookieError = () => {
          setUserAuthState(this, USER_AUTH_STATE.USER_LOGGED_OUT)

          if (APP_PATHS.some(path => location.pathname.startsWith(path))) {
            sessionStorage.setItem('LOGIN_REDIRECT', location.pathname)
          }

          this.logout()
          reject()
        }

        const onRefreshCookieSuccess = ({ userProfile }) => {
          if (userProfile) {
            this.userProfile = userProfile
          }
          setUserAuthState(this, USER_AUTH_STATE.USER_LOGGED_IN)
          resolve({})
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

    async logout(withoutRedirect = false) {
      await identityApi.logout()

      this.userProfile = null
      setUserAuthState(this, USER_AUTH_STATE.USER_LOGGED_OUT)

      if (APP_PATHS.some(path => location.pathname.startsWith(path))) {
        if (!withoutRedirect) {
          sessionStorage.setItem('LOGIN_REDIRECT', location.pathname)
        }
        await router.push({ name: 'login' })
      }

      useShoppingListStore().resetUserData()
      useMyKitchenStore().resetUserData()
      useRecipesStore().resetUserData()
      this.resetUserData()
    },

    getInitUserData() {
      const recipesStore = useRecipesStore()
      const ingredientsStore = useIngredientsStore()
      const myKitchenStore = useMyKitchenStore()

      recipesStore.fetchFavouriteRecipesIds()

      this.fetchHiddenRecipeIds()
      this.fetchHiddenBlogIds()

      ingredientsStore.fetchBaseProducts()
      ingredientsStore.fetchUnitsGroupedByMeasurement()

      myKitchenStore.fetchProducts()
    },

    fetchHiddenRecipeIds() {
      userApi.getHiddenRecipeIds().then(({ data }) => {
        this.hiddenRecipeIds = data.recipeIds
      })
    },

    fetchHiddenBlogIds() {
      userApi.getHiddenBlogIds().then(({ data }) => {
        this.hiddenBlogIds = data.blogIds
      })
    },

    changeRecipeVisibility({ recipeId, visible }): Promise<void> {
      return new Promise((resolve, reject) => {
        userApi
          .changeRecipeVisibility(recipeId, visible)
          .then(({ data }) => {
            if (data.success) {
              if (visible) {
                const recipeIndex = this.hiddenRecipeIds.indexOf(recipeId)
                if (recipeIndex >= 0) {
                  this.hiddenRecipeIds.splice(recipeIndex, 1)
                }
              } else {
                this.hiddenRecipeIds.push(recipeId)
              }
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

    changeBlogVisibility({ blogId, visible }): Promise<void> {
      return new Promise((resolve, reject) => {
        userApi
          .changeBlogVisibility(blogId, visible)
          .then(({ data }) => {
            if (data.success) {
              if (visible) {
                const blogIndex = this.hiddenBlogIds.indexOf(blogId)
                if (blogIndex >= 0) {
                  this.hiddenBlogIds.splice(blogIndex, 1)
                }
              } else {
                this.hiddenBlogIds.push(blogId)
              }
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

    resetUserData() {
      this.hiddenBlogIds = null
      this.hiddenRecipeIds = null
    }
  },

  getters: {
    isAuthenticated: state => state.userProfile !== null && state.userAuthState === USER_AUTH_STATE.USER_LOGGED_IN,
    currentUserAuthState: state => state.userAuthState,
    isRecipeHidden: state => id => state.hiddenRecipeIds?.includes(id),
    isBlogHidden: state => id => state.hiddenBlogIds?.includes(id)
  }
})
