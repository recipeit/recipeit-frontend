import { defineStore } from 'pinia'
import { computed, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'

import identityApi from '@/api/identityApi'
import userApi from '@/api/userApi'

import { THEME_DEFAULT, THEME_STORAGE_KEY } from '@/configs/theme'

import { Themes } from '@/constants/themes'

import { useToast } from '@/plugins/toast'

import { APP_PATHS } from '@/router/paths'

import { useIngredientsStore } from '@/stores/ingredients'
import { useMyKitchenStore } from '@/stores/myKitchen'
import { useRecipesStore } from '@/stores/recipes'
import { useShoppingListStore } from '@/stores/shoppingList'

import { UserProfile } from '@/typings/userProfile'
import { BlogEntity, RecipeEntity } from '@/typings/entities'
import { Theme } from '@/typings/theme'
import { UserAuthState } from '@/typings/userAuthState'

type UserStoreState = {
  theme: Theme
  userProfile: UserProfile
  userAuthState: UserAuthState
  userAuthenticatedLazy: boolean
  hiddenRecipeIds: Array<RecipeEntity['id']>
  hiddenBlogIds: Array<BlogEntity['id']>
}

export const useUserStore = defineStore('user', () => {
  const router = useRouter()

  // state
  const state = reactive<UserStoreState>({
    theme: null,
    userProfile: null,
    userAuthState: 'USER_APP_INITIAL',
    userAuthenticatedLazy: false,
    hiddenRecipeIds: null,
    hiddenBlogIds: null
  })

  // internal methods
  const setUserAuthState = (userAuthState: UserAuthState) => {
    state.userAuthState = userAuthState
    if (userAuthState === 'USER_LOGGED_IN') {
      state.userAuthenticatedLazy = true
    } else if (userAuthState === 'USER_LOGGED_OUT') {
      state.userAuthenticatedLazy = false
    }
  }

  const getInitUserData = () => {
    const recipesStore = useRecipesStore()
    const ingredientsStore = useIngredientsStore()
    const myKitchenStore = useMyKitchenStore()

    recipesStore.fetchFavouriteRecipesIds()

    fetchHiddenRecipeIds()
    fetchHiddenBlogIds()

    ingredientsStore.fetchBaseProducts()
    ingredientsStore.fetchUnitsGroupedByMeasurement()

    myKitchenStore.fetchProducts()
  }

  const fetchHiddenRecipeIds = () => {
    userApi.getHiddenRecipeIds().then(({ data }) => {
      state.hiddenRecipeIds = data.recipeIds
    })
  }

  const fetchHiddenBlogIds = () => {
    userApi.getHiddenBlogIds().then(({ data }) => {
      state.hiddenBlogIds = data.blogIds
    })
  }

  // actions

  const initTheme = () => {
    let currentTheme = localStorage.getItem(THEME_STORAGE_KEY)

    if (!currentTheme || !Themes.find(validTheme => validTheme === currentTheme)) {
      currentTheme = THEME_DEFAULT
    }

    state.theme = currentTheme as Theme
  }

  const setTheme = (theme: Theme) => {
    state.theme = theme
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }

  const fetchUserProfile = async ({ fetchInitUserData }: { fetchInitUserData?: boolean } = {}) => {
    try {
      const {
        data: { userProfile }
      } = await identityApi.profile()

      state.userProfile = userProfile
      setUserAuthState('USER_LOGGED_IN')

      if (fetchInitUserData) {
        getInitUserData()
      }
    } catch (e) {
      setUserAuthState('USER_LOGGED_OUT')
      throw new Error(e)
    }
  }

  const register = ({ email, password, recaptchaToken }) => {
    return new Promise<void>((resolve, reject) => {
      identityApi
        .register({ email, password, recaptchaToken })
        .then(({ data: { userProfile } }) => {
          state.userProfile = userProfile
          setUserAuthState('USER_LOGGED_IN')
          getInitUserData()
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
  }

  const login = ({ email, password, recaptchaToken }) => {
    useRecipesStore().resetUserData() //TODO why only recipes

    return new Promise<void>((resolve, reject) => {
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
            state.userProfile = userProfile
            setUserAuthState('USER_LOGGED_IN')
            getInitUserData()
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
  }

  const facebookAuth = ({ accessToken }) => {
    useRecipesStore().resetUserData() //TODO why only recipes

    return new Promise<void>((resolve, reject) => {
      identityApi
        .facebookAuth({ accessToken })
        .then(({ data: { userProfile } }) => {
          state.userProfile = userProfile
          setUserAuthState('USER_LOGGED_IN')
          getInitUserData()
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
  }

  const googleAuth = ({ idToken }): Promise<void> => {
    useRecipesStore().resetUserData() //TODO why only recipes

    return new Promise((resolve, reject) => {
      identityApi
        .googleAuth({ idToken })
        .then(({ data: { userProfile } }) => {
          state.userProfile = userProfile
          setUserAuthState('USER_LOGGED_IN')
          getInitUserData()
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
  }

  const refreshCookie = (): Promise<{ isFetching?: boolean }> => {
    return new Promise((resolve, reject) => {
      if (state.userAuthState === 'USER_FETCHING') {
        resolve({ isFetching: true })
        return
      }

      const onRefreshCookieError = () => {
        setUserAuthState('USER_LOGGED_OUT')

        if (APP_PATHS.some(path => location.pathname.startsWith(path))) {
          sessionStorage.setItem('LOGIN_REDIRECT', location.pathname)
        }

        logout()
        reject()
      }

      const onRefreshCookieSuccess = ({ userProfile }) => {
        if (userProfile) {
          state.userProfile = userProfile
        }
        setUserAuthState('USER_LOGGED_IN')
        resolve({})
      }

      setUserAuthState('USER_FETCHING')

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
  }

  const logout = async (withoutRedirect = false) => {
    await identityApi.logout()

    state.userProfile = null
    setUserAuthState('USER_LOGGED_OUT')

    if (APP_PATHS.some(path => location.pathname.startsWith(path))) {
      if (!withoutRedirect) {
        sessionStorage.setItem('LOGIN_REDIRECT', location.pathname)
      }
      await router.push({ name: 'login' })
    }

    useShoppingListStore().resetUserData()
    useMyKitchenStore().resetUserData()
    useRecipesStore().resetUserData()
    resetUserData()
  }

  const changeRecipeVisibility = ({ recipeId, visible }): Promise<void> => {
    return new Promise((resolve, reject) => {
      userApi
        .changeRecipeVisibility(recipeId, visible)
        .then(({ data }) => {
          if (data.success) {
            if (visible) {
              const recipeIndex = state.hiddenRecipeIds.indexOf(recipeId)
              if (recipeIndex >= 0) {
                state.hiddenRecipeIds.splice(recipeIndex, 1)
              }
            } else {
              state.hiddenRecipeIds.push(recipeId)
            }
            resolve()
            useToast().show(visible ? 'Przepis został odkryty' : 'Przepis nie będzie już widoczny', 'success')
          } else {
            reject()
            useToast().show('Wystapił błąd. Spróbuj ponownie', 'error')
          }
        })
        .catch(() => {
          reject()
          useToast().show('Wystapił błąd. Spróbuj ponownie', 'error')
        })
    })
  }

  const changeBlogVisibility = ({ blogId, visible }): Promise<void> => {
    return new Promise((resolve, reject) => {
      userApi
        .changeBlogVisibility(blogId, visible)
        .then(({ data }) => {
          if (data.success) {
            if (visible) {
              const blogIndex = state.hiddenBlogIds.indexOf(blogId)
              if (blogIndex >= 0) {
                state.hiddenBlogIds.splice(blogIndex, 1)
              }
            } else {
              state.hiddenBlogIds.push(blogId)
            }
            resolve()
            useToast().show(visible ? 'Przepisy z tego blogu zostały odkryte' : 'Przepisy z tego blogu nie będą już widoczne', 'success')
          } else {
            reject()
            useToast().show('Wystapił błąd. Spróbuj ponownie', 'error')
          }
        })
        .catch(() => {
          reject()
          useToast().show('Wystapił błąd. Spróbuj ponownie', 'error')
        })
    })
  }

  const resetUserData = () => {
    state.hiddenBlogIds = null
    state.hiddenRecipeIds = null
  }

  // getter methods
  const isRecipeHidden = (id: RecipeEntity['id']) => {
    return state.hiddenRecipeIds?.includes(id)
  }

  const isBlogHidden = (id: BlogEntity['id']) => {
    return state.hiddenBlogIds?.includes(id)
  }

  // getters
  const isAuthenticated = computed(() => {
    return state.userProfile !== null && state.userAuthState === 'USER_LOGGED_IN'
  })

  return {
    // state
    ...toRefs(state),
    // actions
    initTheme,
    setTheme,
    fetchUserProfile,
    register,
    login,
    facebookAuth,
    googleAuth,
    refreshCookie,
    logout,
    changeRecipeVisibility,
    changeBlogVisibility,
    resetUserData,
    // getter methods
    isRecipeHidden,
    isBlogHidden,
    // getters
    isAuthenticated
  }
})
