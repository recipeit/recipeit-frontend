<template>
  <SheetModalContent class="select-base-product-from-array-modal">
    <BaseModalHeader @close="$emit('close')">
      <BaseModalTitle>Co chcesz kupić?</BaseModalTitle>
    </BaseModalHeader>
    <BaseModalBody>
      <ul class="products-list">
        <li v-for="product in products" :key="product.id" class="product">
          <span class="product-name">
            {{ product.name }}
          </span>
          <BaseButton class="product-button" subtle color="accent" @click="$emit('close', product.id)">
            <BaseIcon class="product-button-icon" icon="basket" />
            <BaseIcon class="product-button-add-icon" icon="plus" weight="semi-bold" />
          </BaseButton>
        </li>
      </ul>
    </BaseModalBody>
    <BaseModalFooter>
      <BaseButton class="cancel-button" stroked @click="$emit('close')">
        Anuluj
      </BaseButton>
    </BaseModalFooter>
  </SheetModalContent>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

import { useIngredientsStore } from '@/stores/ingredients'

export default defineComponent({
  props: {
    ids: {
      type: Array as PropType<Array<number>>,
      required: true
    }
  },

  emits: ['close'],

  setup(props) {
    const ingredientsStore = useIngredientsStore()

    const products = computed(() =>
      props.ids.map((id): { id: number; name: string } => ({
        id: id,
        name: ingredientsStore.baseProducts.find(p => p.id === id)?.name
      }))
    )

    return {
      products
    }
  }
})
</script>

<style lang="scss" scoped>
.select-base-product-from-array-modal {
  .cancel-button {
    width: 100%;
  }

  .product {
    padding: 4px 0;
    display: flex;
  }

  .product-name {
    margin-right: 0.75rem;
    font-size: 0.875rem;
    flex: 1;
  }

  .product-button {
    min-height: 32px;
    height: 32px;
    min-width: 32px;
    padding: 4px 8px;
  }

  .product-button-icon {
    font-size: 24px;
  }

  .product-button-add-icon {
    margin-left: 2px;
    font-size: 16px;
  }
}
</style>
