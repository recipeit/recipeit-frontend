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

<script lang="ts">
import { computed, defineComponent, markRaw, ref } from 'vue'

import myKitchenApi from '@/api/myKitchenApi'

import { useModal } from '@/plugins/global-sheet-modal'
import { useToast } from '@/plugins/toast'
import { ToastType } from '@/plugins/toast/toastType'

import { useMyKitchenStore } from '@/stores/myKitchen'
import { useShoppingListStore } from '@/stores/shoppingList'

import Product from '@/components/Product.vue'
import EditKitchenProductModal from '@/components/modals/EditKitchenProductModal.vue'

export default defineComponent({
  components: {
    Product
  },

  props: {
    product: {
      type: Object,
      required: true
    }
  },

  setup(props) {
    // usings
    const modal = useModal()
    const toast = useToast()
    const myKitchenStore = useMyKitchenStore()
    const shoppingListStore = useShoppingListStore()

    // data
    const addToShoppingListLoading = ref(false)

    // computed
    const isInShoppingList = computed(() => {
      return !!shoppingListStore.products?.find(p => p.baseProductId === props.product.baseProductId)
    })

    const purchaseButtonTooltip = computed(() => {
      return isInShoppingList.value ? 'Posiadasz ten produkt na liście zakupów' : 'Dodaj do listy zakupów'
    })

    // methods
    const openEditModal = async () => {
      let expirationDates
      try {
        const { data } = await myKitchenApi.getProductExpirationDates(props.product.id)
        if (data) {
          expirationDates = data
        }
      } catch (e) {
        toast.show('Wystąpił błąd podczas pobierania danych', ToastType.ERROR)
      }

      modal.show(
        markRaw(EditKitchenProductModal),
        {
          product: props.product,
          expirationDates: expirationDates
        },
        {}
      )
    }

    const deleteProduct = () => {
      myKitchenStore.deleteProductFromKitchen(props.product.id)
    }

    const addToShoppingList = () => {
      if (addToShoppingListLoading.value) return

      if (!isInShoppingList.value) {
        addToShoppingListLoading.value = true
        const { baseProductId, amount, unit } = props.product

        shoppingListStore
          .addProduct({
            baseProductId,
            amount,
            unit
          })
          .catch(() => {
            toast.show('Nie udało się dodać produktu do listy zakupów', ToastType.ERROR)
          })
          .finally(() => {
            addToShoppingListLoading.value = false
          })
      }
    }

    return {
      // data
      addToShoppingListLoading,
      // computed
      isInShoppingList,
      purchaseButtonTooltip,
      //methods
      openEditModal,
      deleteProduct,
      addToShoppingList
    }
  }
})
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
