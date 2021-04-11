import { createRouter, createWebHistory } from 'vue-router'
import modalPlugin from '@/plugins/global-sheet-modal'
import store from '@/store'
import { USER_AUTH_STATE } from '@/store/modules/user'
import identityApi from '@/api/identityApi'
import progressbarPlugin from '@/plugins/progressbar'

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
    next({ name: 'landing-page' })
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
    name: 'landing-page',
    component: () => import(/* webpackChunkName: "landing" */ '@/views/LandingPage.vue')
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import(/* webpackChunkName: "terms" */ '@/views/Terms.vue')
  },
  {
    path: '/app',
    name: 'app',
    beforeEnter: onlyAuthenticated,
    component: () => import(/* webpackChunkName: "app" */ '@/views/App.vue'),
    children: [
      {
        path: '',
        alias: 'home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/app/Home.vue')
      },
      {
        path: 'recipe/:recipeId',
        name: 'recipe',
        props: true,
        component: () => import(/* webpackChunkName: "recipe" */ '@/views/app/Recipe.vue')
      },
      {
        path: 'recipes',
        name: 'recipes',
        component: () => import(/* webpackChunkName: "recipes" */ '@/views/app/Recipes.vue')
      },
      {
        path: 'cook-it',
        name: 'cook-it',
        component: () => import(/* webpackChunkName: "cook-it" */ '@/views/app/CookIt.vue')
      },
      {
        path: 'cook-it/available',
        name: 'available',
        component: () => import(/* webpackChunkName: "cook-it" */ '@/views/app/cook-it/AvailableRecipes.vue')
      },
      {
        path: 'cook-it/almost-available',
        name: 'almost-available',
        component: () => import(/* webpackChunkName: "cook-it" */ '@/views/app/cook-it/AlmostAvailableRecipes.vue')
      },
      {
        path: 'my-kitchen',
        name: 'my-kitchen',
        component: () => import(/* webpackChunkName: "my-kitchen" */ '@/views/app/MyKitchen.vue')
      },
      {
        path: 'shopping-list',
        name: 'shopping-list',
        component: () => import(/* webpackChunkName: "shopping-list" */ '@/views/app/ShoppingList.vue')
      },
      {
        path: 'account',
        name: 'account',
        component: () => import(/* webpackChunkName: "account" */ '@/views/app/Account.vue')
      },
      {
        path: 'hidden-blogs',
        name: 'hidden-blogs',
        component: () => import(/* webpackChunkName: "account" */ '@/views/app/account/HiddenBlogs.vue')
      },
      {
        path: 'hidden-recipes',
        name: 'hidden-recipes',
        component: () => import(/* webpackChunkName: "account" */ '@/views/app/account/HiddenRecipes.vue')
      },
      {
        path: 'help',
        name: 'help',
        component: () => import(/* webpackChunkName: "help" */ '@/views/app/Help.vue')
      }
    ]
  },
  {
    path: '/auth',
    name: 'auth',
    beforeEnter: onlyAnonymousGuard,
    component: () => import(/* webpackChunkName: "auth" */ '@/views/Auth.vue'),
    children: [
      {
        path: '',
        alias: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/Login.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/Register.vue')
      },
      {
        path: 'register-success',
        name: 'register-success',
        props: true,
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/RegisterSuccess.vue')
      },
      {
        path: 'request-password-reset',
        name: 'request-password-reset',
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/RequestPasswordReset.vue')
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import(/* webpackChunkName: "auth" */ '@/views/auth/ResetPassword.vue')
      },
      {
        path: 'confirm-email',
        name: 'confirm-email',
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
