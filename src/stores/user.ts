import { defineStore } from 'pinia'

import identityApi from '@/api/identityApi'
import userApi from '@/api/userApi'

import { THEME_DEFAULT, THEME_STORAGE_KEY } from '@/configs/theme'

import { Themes } from '@/constants/themes'

import toastPlugin from '@/plugins/toast'
import { ToastType } from '@/plugins/toast/toastType'

import router from '@/router'
import { APP_PATHS } from '@/router/paths'

import { useIngredientsStore } from '@/stores/ingredients'
import { useMyKitchenStore } from '@/stores/myKitchen'
import { useRecipesStore } from '@/stores/recipes'
import { useShoppingListStore } from '@/stores/shoppingList'

import { UserProfile } from '@/typings/userProfile'
import { BlogEntity, RecipeEntity } from '@/typings/entities'
import { Theme } from '@/typings/theme'
import { UserAuthState } from '@/typings/userAuthState'

const setUserAuthState = (store, userAuthState) => {
  store.userAuthState = userAuthState
  if (userAuthState === 'USER_LOGGED_IN') {
    store.userAuthenticatedLazy = true
  } else if (userAuthState === 'USER_LOGGED_OUT') {
    store.userAuthenticatedLazy = false
  }
}

type UserStoreState = {
  theme: Theme
  userProfile: UserProfile
  userAuthState: UserAuthState
  userAuthenticatedLazy: boolean
  hiddenRecipeIds: Array<RecipeEntity['id']>
  hiddenBlogIds: Array<BlogEntity['id']>
}

export const useUserStore = defineStore('user', {
  state: (): UserStoreState => {
    return {
      theme: null,
      userProfile: null,
      userAuthState: 'USER_APP_INITIAL',
      userAuthenticatedLazy: false,
      hiddenRecipeIds: null,
      hiddenBlogIds: null
    }
  },

  actions: {
    initTheme() {
      let currentTheme = localStorage.getItem(THEME_STORAGE_KEY)

      if (!currentTheme || !Themes.find(validTheme => validTheme === currentTheme)) {
        currentTheme = THEME_DEFAULT
      }

      this.theme = currentTheme as Theme
    },

    setTheme(theme: Theme) {
      this.theme = theme
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    },

    async fetchUserProfile({ getInitUserData }: { getInitUserData?: boolean } = {}) {
      try {
        const {
          data: { userProfile }
        } = await identityApi.profile()

        this.userProfile = userProfile
        setUserAuthState(this, 'USER_LOGGED_IN')

        if (getInitUserData) {
          this.getInitUserData()
        }
      } catch (e) {
        setUserAuthState(this, 'USER_LOGGED_OUT')
        throw new Error(e)
      }
    },

    register({ email, password, recaptchaToken }): Promise<void> {
      return new Promise((resolve, reject) => {
        identityApi
          .register({ email, password, recaptchaToken })
          .then(({ data: { userProfile } }) => {
            this.userProfile = userProfile
            setUserAuthState(this, 'USER_LOGGED_IN')
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
              setUserAuthState(this, 'USER_LOGGED_IN')
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
            setUserAuthState(this, 'USER_LOGGED_IN')
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
            setUserAuthState(this, 'USER_LOGGED_IN')
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
        if (this.userAuthState === 'USER_FETCHING') {
          resolve({ isFetching: true })
          return
        }

        const onRefreshCookieError = () => {
          setUserAuthState(this, 'USER_LOGGED_OUT')

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
          setUserAuthState(this, 'USER_LOGGED_IN')
          resolve({})
        }

        setUserAuthState(this, 'USER_FETCHING')

        identityApi
          .refreshCookie()
          .then(({ status, data: { userProfile } }) => {
            if (status === 200 && userProfile !== null) {
              onRefreshCookieSuccess({ userProfile })
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
      setUserAuthState(this, 'USER_LOGGED_OUT')

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
    isAuthenticated: state => state.userProfile !== null && state.userAuthState === 'USER_LOGGED_IN',
    isRecipeHidden: state => (id: RecipeEntity['id']) => state.hiddenRecipeIds?.includes(id),
    isBlogHidden: state => (id: BlogEntity['id']) => state.hiddenBlogIds?.includes(id)
  }
})
