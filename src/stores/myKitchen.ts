import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

import myKitchenApi from '@/api/myKitchenApi'

import eventHub from '@/services/eventHub'

import { UserKitchenProductEntity } from '@/typings/entities'
import { EditedUserKitchenProduct, NewUserKitchenProduct } from '@/typings/kitchen'

type MyKitchenStoreState = {
  products: Array<UserKitchenProductEntity>
}

export const useMyKitchenStore = defineStore('myKitchen', () => {
  // state
  const state = reactive<MyKitchenStoreState>({
    products: null
  })

  // internal methods
  const addProductToState = (product: UserKitchenProductEntity) => {
    const existingProduct = state.products.find(({ id }) => id === product.id)

    if (existingProduct) {
      Object.entries(product).forEach(([key, value]) => {
        existingProduct[key] = value
      })
    } else {
      state.products.push(product)
    }
  }

  // actions
  const fetchProducts = async () => {
    if (state.products !== null) return
    const { data } = await myKitchenApi.getProductsFromMyKitchen()
    state.products = data
  }

  const addProduct = async ({ product, expirationDates }: { product: NewUserKitchenProduct; expirationDates?: Array<string> | null }) => {
    const { data } = await myKitchenApi.addProductToMyKitchen(product, expirationDates)
    addProductToState(data)
    eventHub.$emit('add-to-kitchen')
  }

  const editProductFromKitchen = async ({
    product,
    expirationDates
  }: {
    product: EditedUserKitchenProduct
    expirationDates: Array<string>
  }) => {
    const { data: addedProduct } = await myKitchenApi.updateProductFromMyKitchen(product.id, product, expirationDates)
    const existingProduct = state.products.find(p => p.id === addedProduct.id)
    if (existingProduct) {
      Object.entries(addedProduct).forEach(([key, value]) => {
        existingProduct[key] = value
      })
    }
  }

  const deleteProductFromKitchen = async (id: UserKitchenProductEntity['id']) => {
    await myKitchenApi.removeProductFromMyKitchenById(id)
    const productIndex = state.products.findIndex(p => p.id === id)
    if (productIndex >= 0) {
      state.products.splice(productIndex, 1)
    }
  }

  const includeProductToList = (product: UserKitchenProductEntity) => {
    addProductToState(product)
    eventHub.$emit('add-to-kitchen')
  }

  const includeProductsToList = (products: Array<UserKitchenProductEntity>) => {
    const newProductsIds = products.map(({ id }) => id)
    const currentProductsWithoutUpdated = state.products.filter(({ id }) => !newProductsIds.includes(id))

    state.products = [...currentProductsWithoutUpdated, ...products]

    eventHub.$emit('add-to-kitchen')
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
    editProductFromKitchen,
    deleteProductFromKitchen,
    includeProductToList,
    includeProductsToList,
    resetUserData
  }
})
