<template>
  <Product :product="product" @click="openEditModal()">
    <div class="actions" @click.stop>
      <VTooltip>
        <BaseButton
          class="purchase-button"
          subtle
          :color="isInShoppingList ? 'primary' : 'accent'"
          :disabled="addToShoppingListLoading"
          @click.prevent.stop="addToShoppingList()"
        >
          <BaseIcon class="purchase-button-icon" icon="basket" />
          <BaseIcon
            class="purchase-button-icon purchase-button-icon--small purchase-button-icon--less-space"
            :icon="isInShoppingList ? 'check' : 'plus'"
            weight="semi-bold"
          />
        </BaseButton>

        <template #popper>
          {{ purchaseButtonTooltip }}
        </template>
      </VTooltip>

      <VTooltip>
        <a class="remove-button" @click.prevent.stop="deleteProduct()">
          <BaseIcon icon="trash" weight="semi-bold" />
        </a>

        <template #popper>
          Usuń produkt
        </template>
      </VTooltip>
    </div>
  </Product>
</template>

<script>
import { computed, markRaw } from 'vue'

import myKitchenApi from '@/api/myKitchenApi'

import { ToastType } from '@/plugins/toast/toastType'

import { useMyKitchenStore } from '@/stores/myKitchen'
import { useShoppingListStore } from '@/stores/shoppingList'

import Product from '@/components/Product.vue'
import EditKitchenProductModal from '@/components/modals/EditKitchenProductModal.vue'

export default {
  components: {
    Product
  },
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  setup() {
    const myKitchenStore = useMyKitchenStore()
    const shoppingListStore = useShoppingListStore()

    const shoppingListProducts = computed(() => shoppingListStore.products)

    return {
      myKitchenStore,
      shoppingListStore,
      shoppingListProducts
    }
  },
  data: () => ({
    addToShoppingListLoading: false
  }),
  computed: {
    isInShoppingList() {
      return !!this.shoppingListProducts?.find(p => p.baseProductId === this.product.baseProductId)
    },
    purchaseButtonTooltip() {
      return this.isInShoppingList ? 'Posiadasz ten produkt na liście zakupów' : 'Dodaj do listy zakupów'
    }
  },
  methods: {
    async openEditModal() {
      let expirationDates
      try {
        const { data } = await myKitchenApi.getProductExpirationDates(this.product.id)
        if (data) {
          expirationDates = data
        }
      } catch (e) {
        this.$toast.show('Wystąpił błąd podczas pobierania danych', ToastType.ERROR)
      }

      this.$modal.show(
        markRaw(EditKitchenProductModal),
        {
          product: this.product,
          expirationDates: expirationDates
        },
        {}
      )
    },
    deleteProduct() {
      this.myKitchenStore.deleteProductFromKitchen(this.product.id)
    },
    addToShoppingList() {
      if (this.addToShoppingListLoading) return

      if (!this.isInShoppingList) {
        this.addToShoppingListLoading = true
        const { baseProductId, amount, unit } = this.product

        this.shoppingListStore
          .addProduct({
            baseProductId,
            amount,
            unit
          })
          .catch(() => {
            this.$toast.show('Nie udało się dodać produktu do listy zakupów', ToastType.ERROR)
          })
          .finally(() => {
            this.addToShoppingListLoading = false
          })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  height: 100%;
  align-items: center;

  // .state {
  //   display: flex;
  //   align-items: center;
  //   min-height: 32px;
  //   height: 32px;
  //   min-width: 32px;
  //   border-radius: 50px;
  //   padding: 4px 8px;
  //   cursor: pointer;
  //   transition: all 0.3s ease;
  //   margin-right: -4px;
  //   justify-content: center;

  //   &--available {
  //     padding: 4px;
  //     color: var(--color-button-subtle-primary-color);

  //     @include cursor-only {
  //       &:hover,
  //       &:focus {
  //         background-color: var(--color-button-subtle-primary-background-hover);
  //       }
  //     }
  //   }

  //   &-icon {
  //     font-size: 24px;

  //     &--less-space {
  //       margin-left: 2px;
  //     }

  //     &--small {
  //       font-size: 16px;
  //     }
  //   }
  // }

  .purchase-button {
    min-width: 32px;
    height: 32px;
    border-radius: 48px;
    background-color: var(--color-button-subtle-primary-background);
    color: var(--color-button-subtle-primary-color);
    display: flex;
    align-items: center;
    margin-right: 8px;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;

    padding: 4px 8px;
    @include transition((all));

    &-icon {
      font-size: 24px;

      &--less-space {
        margin-left: 2px;
      }

      &--small {
        font-size: 16px;
      }
    }

    // &:hover {
    //   background-color: var(--color-button-subtle-primary-background-hover);
    // }

    // &:active {
    //   background-color: var(--color-button-subtle-primary-background-active);
    // }
  }

  .remove-button {
    width: 32px;
    height: 32px;
    border-radius: 48px;
    margin-right: -5px;
    background-color: var(--color-button-subtle-danger-background);
    color: var(--color-button-subtle-danger-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
    @include transition((background-color));

    &:hover {
      background-color: var(--color-button-subtle-danger-background-hover);
    }

    &:active {
      background-color: var(--color-button-subtle-danger-background-active);
    }
  }
}
</style>
