import { defineStore } from 'pinia'

import myKitchenApi from '@/api/myKitchenApi'

import eventHub from '@/services/eventHub'

const addProducts = (store, products) => {
  const newProductsIds = products.map(({ id }) => id)
  const currentProductsWithoutUpdated = store.products.filter(({ id }) => !newProductsIds.includes(id))
  store.products = [...currentProductsWithoutUpdated, ...newProductsIds]
}

const addProduct = (store, product) => {
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
  state: () => {
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

    async addProduct({ product, expirationDates }: { product: any; expirationDates?: Array<string> | null }) {
      const { data } = await myKitchenApi.addProductToMyKitchen(product, expirationDates)
      addProduct(this, data)
      eventHub.$emit('add-to-kitchen')
    },

    async editProductFromKitchen({ id, product, expirationDates }) {
      const { data: addedProduct } = await myKitchenApi.updateProductFromMyKitchen(id, product, expirationDates)
      const existingProduct = this.products.find(p => p.id === addedProduct.id)
      if (existingProduct) {
        Object.entries(addedProduct).forEach(([key, value]) => {
          existingProduct[key] = value
        })
      }
    },

    async deleteProductFromKitchen(id) {
      await myKitchenApi.removeProductFromMyKitchenById(id)
      const productIndex = this.products.findIndex(p => p.id === id)
      if (productIndex >= 0) {
        this.products.splice(productIndex, 1)
      }
    },

    includeProductToList(product) {
      addProduct(this, product)
      eventHub.$emit('add-to-kitchen')
    },

    includeProductsToList(products) {
      addProducts(this, products)
      eventHub.$emit('add-to-kitchen')
    },

    resetUserData() {
      this.products = null
    }
  }
})
