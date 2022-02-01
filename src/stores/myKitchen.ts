import { defineStore } from 'pinia'

import myKitchenApi from '@/api/myKitchenApi'

import eventHub from '@/services/eventHub'

import { UserKitchenProductEntity } from '@/typings/entities'
import { EditedUserKitchenProduct, NewUserKitchenProduct } from '@/typings/kitchen'

type MyKitchenStoreState = {
  products: Array<UserKitchenProductEntity>
}

const addProducts = (store, products: Array<UserKitchenProductEntity>) => {
  const newProductsIds = products.map(({ id }) => id)
  const currentProductsWithoutUpdated = store.products.filter(({ id }) => !newProductsIds.includes(id))
  store.products = [...currentProductsWithoutUpdated, ...newProductsIds]
}

const addProduct = (store, product: UserKitchenProductEntity) => {
  const existingProduct = store.products.find(({ id }) => id === product.id)

  if (existingProduct) {
    Object.entries(product).forEach(([key, value]) => {
      existingProduct[key] = value
    })
  } else {
    store.products.push(product)
  }
}

export const useMyKitchenStore = defineStore('myKitchen', {
  state: (): MyKitchenStoreState => {
    return {
      products: null
    }
  },

  actions: {
    async fetchProducts() {
      if (this.products !== null) return
      const { data } = await myKitchenApi.getProductsFromMyKitchen()
      this.products = data
    },

    async addProduct({ product, expirationDates }: { product: NewUserKitchenProduct; expirationDates?: Array<string> | null }) {
      const { data } = await myKitchenApi.addProductToMyKitchen(product, expirationDates)
      addProduct(this, data)
      eventHub.$emit('add-to-kitchen')
    },

    async editProductFromKitchen({ product, expirationDates }: { product: EditedUserKitchenProduct; expirationDates: Array<string> }) {
      const { data: addedProduct } = await myKitchenApi.updateProductFromMyKitchen(product.id, product, expirationDates)
      const existingProduct = this.products.find(p => p.id === addedProduct.id)
      if (existingProduct) {
        Object.entries(addedProduct).forEach(([key, value]) => {
          existingProduct[key] = value
        })
      }
    },

    async deleteProductFromKitchen(id: UserKitchenProductEntity['id']) {
      await myKitchenApi.removeProductFromMyKitchenById(id)
      const productIndex = this.products.findIndex(p => p.id === id)
      if (productIndex >= 0) {
        this.products.splice(productIndex, 1)
      }
    },

    includeProductToList(product: UserKitchenProductEntity) {
      addProduct(this, product)
      eventHub.$emit('add-to-kitchen')
    },

    includeProductsToList(products: Array<UserKitchenProductEntity>) {
      addProducts(this, products)
      eventHub.$emit('add-to-kitchen')
    },

    resetUserData() {
      this.products = null
    }
  }
})
