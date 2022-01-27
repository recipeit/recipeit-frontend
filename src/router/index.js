import { nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import modalPlugin from '@/plugins/global-sheet-modal'
import progressbarPlugin from '@/plugins/progressbar'

import * as NAMES from '@/router/names'
import * as PATHS from '@/router/paths'

import eventHub from '@/services/eventHub'

import { USER_AUTH_STATE, useUserStore } from '@/stores/user'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const forceIsAuthenticated = async () => {
  const userStore = useUserStore()
  let userAuthState = userStore.currentUserAuthState

  while (userAuthState === USER_AUTH_STATE.USER_APP_INITIAL) {
    await sleep(50)
    userAuthState = userStore.currentUserAuthState
  }

  if (userAuthState === USER_AUTH_STATE.USER_LOGGED_IN) {
    return true
  }

  if (userAuthState === USER_AUTH_STATE.USER_LOGGED_OUT) {
    return false
  }

  try {
    await userStore.fetchUserProfile()
    return true
  } catch {
    return false
  }
}

const onlyAnonymousGuard = async (to, from, next) => {
  const isAuthenticated = await forceIsAuthenticated()

  if (isAuthenticated) {
    next({ name: NAMES.APP_HOME })
  } else {
    next()
  }
}

const onlyAuthenticated = async (to, from, next) => {
  const isAuthenticated = await forceIsAuthenticated()

  if (isAuthenticated) {
    next()
  } else {
    next({ name: NAMES.AUTH_LOGIN })
  }
}

const routes = [
  {
    path: '/',
    name: NAMES.LANDING_PAGE,
    beforeEnter: onlyAnonymousGuard,
    component: () => import(/* webpackChunkName: "landing" */ '@/views/LandingPage.vue')
  },
  {
    path: PATHS.TERMS,
    name: NAMES.TERMS,
    alias: '/terms',
    props: true,
    meta: { hideCookiesModal: true },
    component: () => import(/* webpackChunkName: "terms" */ '@/views/Terms.vue')
  },
  {
    path: PATHS.PRIVACY_POLICY,
    name: NAMES.PRIVACY_POLICY,
    alias: '/privacy-policy',
    props: true,
    meta: { hideCookiesModal: true },
    component: () => import(/* webpackChunkName: "terms" */ '@/views/PrivacyPolicy.vue')
  },
  {
    path: PATHS.ADD_BLOG,
    name: NAMES.ADD_BLOG,
    props: true,
    meta: { hideCookiesModal: true },
    component: () => import(/* webpackChunkName: "add-blog" */ '@/views/AddBlog.vue')
  },
  {
    path: PATHS.CONTACT,
    name: NAMES.CONTACT,
    meta: { hideCookiesModal: true },
    component: () => import(/* webpackChunkName: "contact" */ '@/views/Contact.vue')
  },
  {
    path: PATHS.APP,
    name: NAMES.APP,
    beforeEnter: onlyAuthenticated,
    component: () => import(/* webpackChunkName: "app" */ '@/views/App.vue'),
    children: [
      {
        alias: '',
        path: PATHS.APP_HOME,
        name: NAMES.APP_HOME,
        component: () => import(/* webpackChunkName: "home" */ '@/views/app/Home.vue')
      },
      {
        path: PATHS.APP_RECIPE,
        name: NAMES.APP_RECIPE,
        props: true,
        component: () => import(/* webpackChunkName: "recipe" */ '@/views/app/Recipe.vue')
      },
      {
        path: PATHS.APP_RECIPES,
        name: NAMES.APP_RECIPES,
        meta: { preventScroll: true },
        component: () => import(/* webpackChunkName: "recipes" */ '@/views/app/Recipes.vue')
      },
      {
        path: PATHS.APP_FAVOURITES,
        name: NAMES.APP_FAVOURITES,
        meta: { preventScroll: true },
        component: () => import(/* webpackChunkName: "favourites" */ '@/views/app/Favourites.vue')
      },
      {
        path: PATHS.APP_COOK_IT,
        name: NAMES.APP_COOK_IT,
        meta: { preventScroll: true },
        component: () => import(/* webpackChunkName: "cook-it" */ '@/views/app/CookIt.vue')
      },
      {
        path: PATHS.APP_ALMOST_AVAILABLE,
        name: NAMES.APP_ALMOST_AVAILABLE,
        meta: { preventScroll: true },
        component: () => import(/* webpackChunkName: "cook-it" */ '@/views/app/cook-it/AlmostAvailableRecipes.vue')
      },
      {
        path: PATHS.APP_MY_KITCHEN,
        name: NAMES.APP_MY_KITCHEN,
        component: () => import(/* webpackChunkName: "my-kitchen" */ '@/views/app/MyKitchen.vue')
      },
      {
        path: PATHS.APP_SHOPPING_LIST,
        name: NAMES.APP_SHOPPING_LIST,
        component: () => import(/* webpackChunkName: "shopping-list" */ '@/views/app/ShoppingList.vue')
      },
      {
        path: PATHS.APP_ACCOUNT,
        name: NAMES.APP_ACCOUNT,
        component: () => import(/* webpackChunkName: "account" */ '@/views/app/Account.vue')
      },
      {
        path: PATHS.APP_BLOG,
        name: NAMES.APP_BLOG,
        props: true,
        meta: { preventScroll: true },
        component: () => import(/* webpackChunkName: "account" */ '@/views/app/BlogRecipes.vue')
      },
      {
        path: PATHS.APP_HIDDEN_BLOGS,
        name: NAMES.APP_HIDDEN_BLOGS,
        component: () => import(/* webpackChunkName: "account" */ '@/views/app/account/HiddenBlogs.vue')
      },
      {
        path: PATHS.APP_HIDDEN_RECIPES,
        name: NAMES.APP_HIDDEN_RECIPES,
        component: () => import(/* webpackChunkName: "account" */ '@/views/app/account/HiddenRecipes.vue')
      },
      {
        path: PATHS.APP_HELP,
        name: NAMES.APP_HELP,
        component: () => import(/* webpackChunkName: "help" */ '@/views/app/Help.vue')
      }
    ]
  },
  {
    path: PATHS.AUTH,
    name: NAMES.AUTH,
    component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth.vue'),
    children: [
      {
        alias: '',
        path: PATHS.AUTH_LOGIN,
        name: NAMES.AUTH_LOGIN,
        props: true,
        beforeEnter: onlyAnonymousGuard,
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/Login.vue')
      },
      {
        path: PATHS.AUTH_REGISTER,
        name: NAMES.AUTH_REGISTER,
        beforeEnter: onlyAnonymousGuard,
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/Register.vue')
      },
      {
        path: PATHS.AUTH_REGISTER_SUCCESS,
        name: NAMES.AUTH_REGISTER_SUCCESS,
        props: true,
        beforeEnter: onlyAnonymousGuard,
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/RegisterSuccess.vue')
      },
      {
        path: PATHS.AUTH_REQUEST_PASSWORD_RESET,
        name: NAMES.AUTH_REQUEST_PASSWORD_RESET,
        props: true,
        beforeEnter: onlyAnonymousGuard,
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/RequestPasswordReset.vue')
      },
      {
        path: PATHS.AUTH_RESET_PASSWORD,
        name: NAMES.AUTH_RESET_PASSWORD,
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/ResetPassword.vue')
      },
      {
        path: PATHS.AUTH_CONFIRM_EMAIL,
        name: NAMES.AUTH_CONFIRM_EMAIL,
        beforeEnter: onlyAnonymousGuard,
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/ConfirmEmail.vue')
      }
    ]
  },
  {
    path: PATHS.NOT_FOUND,
    name: NAMES.NOT_FOUND,
    component: () => import(/* webpackChunkName: "not-found" */ '@/views/NotFound.vue')
  }
]

// if ('scrollRestoration' in window.history) {
//   window.history.scrollRestoration = 'manual'
// }

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (to, from, savedPosition) =>
    new Promise(resolve => {
      const fromAppToApp = [to.name, from.name].every(name => NAMES.APP_ROUTE_NAMES.includes(name))
      const position = to.matched.some(m => m.meta.preventScroll) ? savedPosition : { top: 0 }

      if (fromAppToApp) {
        eventHub.$once('triggerScroll', async () => {
          await nextTick()
          resolve(position)
        })
      } else {
        resolve(position)
      }
    })
})

router.beforeEach((to, from, next) => {
  if (modalPlugin.modal && modalPlugin.modal.anyModalOpened()) {
    modalPlugin.modal.hideLast()
    if (typeof to === 'object' && to.params.closeModalAndGo) {
      next()
    }
  } else {
    progressbarPlugin.progressbar.start()
    next()
  }
})

router.afterEach(() => {
  progressbarPlugin.progressbar.finish()
})

export default router
