import { defineStore } from 'pinia'

import recipeApi from '@/api/recipeApi'
import shoppingListApi from '@/api/shoppingListApi'

import eventHub from '@/services/eventHub'

import { useMyKitchenStore } from '@/stores/myKitchen'

const addProduct = (store, product) => {
  if (!store.products) {
    store.products = [product]
  } else {
    const existingProduct = store.products.find(({ id }) => id === product.id)

    if (existingProduct) {
      Object.entries(product).forEach(([key, value]) => {
        existingProduct[key] = value
      })
    } else {
      store.products.push(product)
    }
  }
}

const removeProduct = (store, id) => {
  const productIndex = store.products.findIndex(p => p.id === id)

  if (productIndex >= 0) {
    store.products.splice(productIndex, 1)
  }
}

export const useShoppingListStore = defineStore('shoppingList', {
  state: () => {
    return {
      products: null
    }
  },

  actions: {
    async fetchProducts() {
      if (this.products !== null) return
      const { data } = await shoppingListApi.getProductsFromShoppingList()
      this.products = data
    },

    async addProduct(product) {
      const { data } = await shoppingListApi.addProductToShoppingList(product)
      addProduct(this, data)
      eventHub.$emit('add-to-shopping-list')
    },

    async addMissingIngredientsToShoppingList(recipeId) {
      const { data: products } = await recipeApi.addMissingIngredientsToShoppingList(recipeId)

      if (!products) {
        return
      }

      if (!this.products) {
        this.products = products
      } else {
        const newProductsIds = products.map(({ id }) => id)
        const currentProductsWithoutUpdated = this.products.filter(({ id }) => !newProductsIds.includes(id))
        this.products = [...currentProductsWithoutUpdated, ...products]
      }

      eventHub.$emit('add-to-shopping-list')
    },

    async editProductFromShoppingList(product) {
      const { data: updatedProduct } = await shoppingListApi.updateProductFromShoppingList(product)

      const existingProduct = this.products.find(({ id }) => id === updatedProduct.id)

      if (existingProduct) {
        Object.entries(updatedProduct).forEach(([key, value]) => {
          existingProduct[key] = value
        })
      }
    },

    async deleteProductFromShoppingList(id) {
      await shoppingListApi.removeProductFromShoppingListById(id)
      removeProduct(this, id)
    },

    async purchaseProduct(productId) {
      const myKitchenStore = useMyKitchenStore()
      const { data } = await shoppingListApi.purchaseProduct(productId)
      removeProduct(this, productId)
      const { newKitchenProduct } = data
      myKitchenStore.includeProductToList(newKitchenProduct)
    },

    async purchaseAllProducts() {
      const myKitchenStore = useMyKitchenStore()
      const { data } = await shoppingListApi.purchaseAllProducts()
      this.products = []
      const { newKitchenProducts: kitchenProducts } = data
      myKitchenStore.includeProductsToList(kitchenProducts)
    },

    resetUserData() {
      this.products = null
    }
  }
})
