import { createRouter, createWebHistory } from 'vue-router'
import modalPlugin from '@/plugins/global-sheet-modal'
import store from '@/store'
import { USER_AUTH_STATE } from '@/store/modules/user'
import identityApi from '@/api/identityApi'
import progressbarPlugin from '@/plugins/progressbar'
import {
  ADD_BLOG,
  APP,
  APP_ACCOUNT,
  APP_ALMOST_AVAILABLE,
  APP_BLOG,
  APP_COOK_IT,
  APP_FAVOURITES,
  APP_HELP,
  APP_HIDDEN_BLOGS,
  APP_HIDDEN_RECIPES,
  APP_HOME,
  APP_MY_KITCHEN,
  APP_RECIPE,
  APP_RECIPES,
  APP_SHOPPING_LIST,
  AUTH,
  AUTH_CONFIRM_EMAIL,
  AUTH_LOGIN,
  AUTH_REGISTER,
  AUTH_REGISTER_SUCCESS,
  AUTH_REQUEST_PASSWORD_RESET,
  AUTH_RESET_PASSWORD,
  LANDING_PAGE,
  PRIVACY_POLICY,
  TERMS
} from './names'

const forceIsAuthenticated = async () => {
  const userAuthState = store.getters['user/currentUserAuthState']

  if (userAuthState === USER_AUTH_STATE.USER_LOGGED_IN) {
    return true
  }

  if (userAuthState === USER_AUTH_STATE.USER_LOGGED_OUT) {
    return false
  }

  try {
    await identityApi.profile()
    return true
  } catch {
    return false
  }
}

const onlyAnonymousGuard = async (to, from, next) => {
  const isAuthenticated = await forceIsAuthenticated()

  if (isAuthenticated) {
    next({ name: 'home' })
  } else {
    next()
  }
}

const onlyAuthenticated = async (to, from, next) => {
  const isAuthenticated = await forceIsAuthenticated()

  if (isAuthenticated) {
    next()
  } else {
    next({ name: 'login' })
  }
}

const routes = [
  {
    path: '/',
    name: LANDING_PAGE,
    beforeEnter: onlyAnonymousGuard,
    component: () => import(/* webpackChunkName: "landing" */ '@/views/LandingPage.vue')
  },
  {
    path: '/terms',
    name: TERMS,
    props: true,
    meta: { hideCookiesModal: true },
    component: () => import(/* webpackChunkName: "terms" */ '@/views/Terms.vue')
  },
  {
    path: '/privacy-policy',
    name: PRIVACY_POLICY,
    props: true,
    meta: { hideCookiesModal: true },
    component: () => import(/* webpackChunkName: "terms" */ '@/views/PrivacyPolicy.vue')
  },
  {
    path: '/add-blog',
    name: ADD_BLOG,
    props: true,
    meta: { hideCookiesModal: true },
    component: () => import(/* webpackChunkName: "add-blog" */ '@/views/AddBlog.vue')
  },
  {
    path: '/app',
    name: APP,
    beforeEnter: onlyAuthenticated,
    component: () => import(/* webpackChunkName: "app" */ '@/views/App.vue'),
    children: [
      {
        path: '',
        alias: 'home',
        name: APP_HOME,
        component: () => import(/* webpackChunkName: "home" */ '@/views/app/Home.vue')
      },
      {
        path: 'recipe/:recipeId',
        name: APP_RECIPE,
        props: true,
        component: () => import(/* webpackChunkName: "recipe" */ '@/views/app/Recipe.vue')
      },
      {
        path: 'recipes',
        name: APP_RECIPES,
        component: () => import(/* webpackChunkName: "recipes" */ '@/views/app/Recipes.vue')
      },
      {
        path: 'favourites',
        name: APP_FAVOURITES,
        component: () => import(/* webpackChunkName: "favourites" */ '@/views/app/Favourites.vue')
      },
      {
        path: 'cook-it',
        name: APP_COOK_IT,
        component: () => import(/* webpackChunkName: "cook-it" */ '@/views/app/CookIt.vue')
      },
      {
        path: 'cook-it/almost-available',
        name: APP_ALMOST_AVAILABLE,
        component: () => import(/* webpackChunkName: "cook-it" */ '@/views/app/cook-it/AlmostAvailableRecipes.vue')
      },
      {
        path: 'my-kitchen',
        name: APP_MY_KITCHEN,
        component: () => import(/* webpackChunkName: "my-kitchen" */ '@/views/app/MyKitchen.vue')
      },
      {
        path: 'shopping-list',
        name: APP_SHOPPING_LIST,
        component: () => import(/* webpackChunkName: "shopping-list" */ '@/views/app/ShoppingList.vue')
      },
      {
        path: 'account',
        name: APP_ACCOUNT,
        component: () => import(/* webpackChunkName: "account" */ '@/views/app/Account.vue')
      },
      {
        path: 'blog/:blogId',
        name: APP_BLOG,
        props: true,
        component: () => import(/* webpackChunkName: "account" */ '@/views/app/BlogRecipes.vue')
      },
      {
        path: 'hidden-blogs',
        name: APP_HIDDEN_BLOGS,
        component: () => import(/* webpackChunkName: "account" */ '@/views/app/account/HiddenBlogs.vue')
      },
      {
        path: 'hidden-recipes',
        name: APP_HIDDEN_RECIPES,
        component: () => import(/* webpackChunkName: "account" */ '@/views/app/account/HiddenRecipes.vue')
      },
      {
        path: 'help',
        name: APP_HELP,
        component: () => import(/* webpackChunkName: "help" */ '@/views/app/Help.vue')
      }
    ]
  },
  {
    path: '/auth',
    name: AUTH,
    beforeEnter: onlyAnonymousGuard,
    component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth.vue'),
    children: [
      {
        path: '',
        alias: 'login',
        name: AUTH_LOGIN,
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/Login.vue')
      },
      {
        path: 'register',
        name: AUTH_REGISTER,
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/Register.vue')
      },
      {
        path: 'register-success',
        name: AUTH_REGISTER_SUCCESS,
        props: true,
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/RegisterSuccess.vue')
      },
      {
        path: 'request-password-reset',
        name: AUTH_REQUEST_PASSWORD_RESET,
        props: true,
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/RequestPasswordReset.vue')
      },
      {
        path: 'reset-password',
        name: AUTH_RESET_PASSWORD,
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/ResetPassword.vue')
      },
      {
        path: 'confirm-email',
        name: AUTH_CONFIRM_EMAIL,
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/ConfirmEmail.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
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
