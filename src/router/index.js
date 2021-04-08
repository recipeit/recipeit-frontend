import { createRouter, createWebHistory } from 'vue-router'
import modalPlugin from '@/plugins/global-sheet-modal'
import store from '@/store'

const onlyAnonymousGuard = (to, from, next) => {
  if (!store.getters['user/isAuthenticated']) {
    next()
  } else {
    next({ name: 'home' })
  }
}

// const ifAuthenticated = (to, from, next) => {
//   if (store.getters['user/isAuthenticated']) {
//     next()
//   } else {
//     next({ name: 'auth' })
//   }
// }

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

// this.$router.beforeEach((to, from, next) => {
//   // Do stuff

//   // Then
//   next() // move on to the next hook in the pipeline. If no hooks are left, the navigation is confirmed.
//   next(false) // abort the current navigation.
//   next('/') // redirect to a different location.
// })

router.beforeEach((to, from, next) => {
  if (modalPlugin.modal && modalPlugin.modal.anyModalOpened()) {
    modalPlugin.modal.hideLast()
  } else {
    next()
  }
  // if (to.name !== 'Login' && !store.getters['user/isAuthenticated']) next({ name: 'Login' })
  // else next()
})

export default router
