import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/recipes',
    name: 'recipes',
    component: () => import(/* webpackChunkName: "recipes" */ '../views/Recipes.vue')
  },
  {
    path: '/cook-it',
    name: 'cook-it',
    component: () => import(/* webpackChunkName: "cook-it" */ '../views/CookIt.vue')
  },
  {
    path: '/my-kitchen',
    name: 'my-kitchen',
    component: () => import(/* webpackChunkName: "my-kitchen" */ '../views/MyKitchen.vue')
  },
  {
    path: '/shopping-list',
    name: 'shopping-list',
    component: () => import(/* webpackChunkName: "shopping-list" */ '../views/ShoppingList.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
