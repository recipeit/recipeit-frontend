<template>
  <Product class="shopping-list-product" :product="product" @click="openEditModal()">
    <div class="actions">
      <VTooltip>
        <a class="remove-button" @click.prevent.stop="deleteProduct()">
          <BaseIcon icon="trash" weight="semi-bold" />
        </a>

        <template #popper>Usuń produkt</template>
      </VTooltip>

      <VTooltip>
        <a class="purchase-button" @click.prevent.stop="$emit('purchase')">
          <BaseIcon icon="check" weight="semi-bold" />
        </a>

        <template #popper>Dodaj produkt do kuchni</template>
      </VTooltip>
    </div>
  </Product>
</template>

<script lang="ts">
import { defineComponent, markRaw, PropType } from 'vue'

import { useModal } from '@/plugins/global-sheet-modal'

import { useShoppingListStore } from '@/stores/shoppingList'

import { UserShoppingListProductEntity } from '@/typings/entities'

import Product from '@/components/Product.vue'
import EditShoppingListProductModal from '@/components/modals/EditShoppingListProductModal.vue'

export default defineComponent({
  components: {
    Product
  },

  props: {
    product: {
      type: Object as PropType<UserShoppingListProductEntity>,
      required: true
    }
  },

  emits: ['purchase'],

  setup(props) {
    const modal = useModal()
    const shoppingListStore = useShoppingListStore()

    const deleteProduct = () => {
      shoppingListStore.deleteProductFromShoppingList(props.product.id)
    }

    const openEditModal = async () => {
      modal.show(
        markRaw(EditShoppingListProductModal),
        {
          product: props.product
        },
        {}
      )
    }

    return {
      deleteProduct,
      openEditModal
    }
  }
})
</script>

<style lang="scss" scoped>
.shopping-list-product {
  .actions {
    display: flex;
    height: 100%;
    align-items: center;
    // padding-right: 15px;
  }

  .purchase-button {
    width: 32px;
    height: 32px;
    border-radius: 48px;
    background-color: var(--color-button-subtle-primary-background);
    color: var(--color-button-subtle-primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    margin-right: -5px;
    cursor: pointer;
    @include transition((background-color));

    &:hover {
      background-color: var(--color-button-subtle-primary-background-hover);
    }

    &:active {
      background-color: var(--color-button-subtle-primary-background-active);
    }
  }

  .remove-button {
    width: 32px;
    height: 32px;
    border-radius: 48px;
    background-color: var(--color-button-subtle-danger-background);
    color: var(--color-button-subtle-danger-color);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    margin-right: 8px;
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
