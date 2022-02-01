import { defineStore } from 'pinia'

import recipeApi from '@/api/recipeApi'
import shoppingListApi from '@/api/shoppingListApi'

import eventHub from '@/services/eventHub'

import { useMyKitchenStore } from '@/stores/myKitchen'

import { RecipeEntity, UserShoppingListProductEntity } from '@/typings/entities'
import { EditedUserShoppingListProduct, NewUserShoppingListProduct } from '@/typings/shoppingList'

type ShoppingListStoreState = {
  products: Array<UserShoppingListProductEntity>
}

const addProduct = (store, product: UserShoppingListProductEntity) => {
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

const removeProduct = (store, id: UserShoppingListProductEntity['id']) => {
  const productIndex = store.products.findIndex(p => p.id === id)

  if (productIndex >= 0) {
    store.products.splice(productIndex, 1)
  }
}

export const useShoppingListStore = defineStore('shoppingList', {
  state: (): ShoppingListStoreState => {
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

    async addProduct(product: NewUserShoppingListProduct) {
      const { data } = await shoppingListApi.addProductToShoppingList(product)
      addProduct(this, data)
      eventHub.$emit('add-to-shopping-list')
    },

    async addMissingIngredientsToShoppingList(recipeId: RecipeEntity['id']) {
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

    async editProductFromShoppingList(product: EditedUserShoppingListProduct) {
      const { data: updatedProduct } = await shoppingListApi.updateProductFromShoppingList(product)

      const existingProduct = this.products.find(({ id }) => id === updatedProduct.id)

      if (existingProduct) {
        Object.entries(updatedProduct).forEach(([key, value]) => {
          existingProduct[key] = value
        })
      }
    },

    async deleteProductFromShoppingList(id: UserShoppingListProductEntity['id']) {
      await shoppingListApi.removeProductFromShoppingListById(id)
      removeProduct(this, id)
    },

    async purchaseProduct(productId: UserShoppingListProductEntity['id']) {
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
