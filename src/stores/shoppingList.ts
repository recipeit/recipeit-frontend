import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

import recipeApi from '@/api/recipeApi'
import shoppingListApi from '@/api/shoppingListApi'

import eventHub from '@/services/eventHub'

import { useMyKitchenStore } from '@/stores/myKitchen'

import { RecipeEntity, UserShoppingListProductEntity } from '@/typings/entities'
import { EditedUserShoppingListProduct, NewUserShoppingListProduct } from '@/typings/shoppingList'

type ShoppingListStoreState = {
  products: Array<UserShoppingListProductEntity>
}

export const useShoppingListStore = defineStore('shoppingList', () => {
  // state
  const state = reactive<ShoppingListStoreState>({
    products: null
  })

  // internal methods
  const addProductToState = (product: UserShoppingListProductEntity) => {
    if (!state.products) {
      state.products = [product]
    } else {
      const existingProduct = state.products.find(({ id }) => id === product.id)

      if (existingProduct) {
        Object.entries(product).forEach(([key, value]) => {
          existingProduct[key] = value
        })
      } else {
        state.products.push(product)
      }
    }
  }

  const removeProductFromState = (id: UserShoppingListProductEntity['id']) => {
    const productIndex = state.products.findIndex(p => p.id === id)

    if (productIndex >= 0) {
      state.products.splice(productIndex, 1)
    }
  }

  // actions
  const fetchProducts = async () => {
    if (state.products !== null) return
    const { data } = await shoppingListApi.getProductsFromShoppingList()
    state.products = data
  }

  const addProduct = async (product: NewUserShoppingListProduct) => {
    const { data } = await shoppingListApi.addProductToShoppingList(product)
    addProductToState(data)
    eventHub.$emit('add-to-shopping-list')
  }

  const addMissingIngredientsToShoppingList = async (recipeId: RecipeEntity['id']) => {
    const { data: products } = await recipeApi.addMissingIngredientsToShoppingList(recipeId)

    if (!products) {
      return
    }

    if (!state.products) {
      state.products = products
    } else {
      const newProductsIds = products.map(({ id }) => id)
      const currentProductsWithoutUpdated = state.products.filter(({ id }) => !newProductsIds.includes(id))
      state.products = [...currentProductsWithoutUpdated, ...products]
    }

    eventHub.$emit('add-to-shopping-list')
  }

  const editProductFromShoppingList = async (product: EditedUserShoppingListProduct) => {
    const { data: updatedProduct } = await shoppingListApi.updateProductFromShoppingList(product)

    const existingProduct = state.products.find(({ id }) => id === updatedProduct.id)

    if (existingProduct) {
      Object.entries(updatedProduct).forEach(([key, value]) => {
        existingProduct[key] = value
      })
    }
  }

  const deleteProductFromShoppingList = async (id: UserShoppingListProductEntity['id']) => {
    await shoppingListApi.removeProductFromShoppingListById(id)
    removeProductFromState(id)
  }

  const purchaseProduct = async (productId: UserShoppingListProductEntity['id']) => {
    const myKitchenStore = useMyKitchenStore()
    const { data } = await shoppingListApi.purchaseProduct(productId)
    removeProductFromState(productId)
    const { newKitchenProduct } = data
    myKitchenStore.includeProductToList(newKitchenProduct)
  }

  const purchaseAllProducts = async () => {
    const myKitchenStore = useMyKitchenStore()
    const { data } = await shoppingListApi.purchaseAllProducts()
    state.products = []
    const { newKitchenProducts: kitchenProducts } = data
    myKitchenStore.includeProductsToList(kitchenProducts)
  }

  const resetUserData = () => {
    state.products = null
  }

  return {
    // state
    ...toRefs(state),
    // actions
    fetchProducts,
    addProduct,
    addMissingIngredientsToShoppingList,
    editProductFromShoppingList,
    deleteProductFromShoppingList,
    purchaseProduct,
    purchaseAllProducts,
    resetUserData
  }
})
