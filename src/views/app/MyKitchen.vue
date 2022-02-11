<template>
  <div class="layout__page__content my-kitchen">
    <PageHeader :title="$t('myKitchen.title')" />

    <!-- <SearchWithFilter class="product-list-filter" placeholder="Szukaj produktu" @search="onSearch($event)" /> -->

    <div class="add-product-button-container">
      <BaseButton
        v-show="!selectFocused && !isEmpty"
        class="add-product-button absolute"
        stroked
        color="primary"
        @click="openAddProductSelect()"
      >
        <BaseIcon class="floating-action-button__icon" icon="plus" weight="semi-bold" />
        {{ $t('shared.addProduct') }}
      </BaseButton>
    </div>

    <BaseSelect
      ref="addProductSelect"
      class="add-product-select"
      :class="{ hidden: !selectFocused }"
      placeholder="Dodaj produkt"
      track-by="id"
      search-by="variants"
      label="name"
      :options="groupedBaseProducts"
      :limit="1000"
      :searchable="true"
      group-label="groupKey"
      group-values="groupValues"
      @click.stop
      @change="addProductFromSelect($event)"
      @blur="selectFocused = false"
    >
      <template #groupLabel="{ label }">
        <span class="category-group">
          <ProductIcon class="category-group-icon" :group="label" />
          {{ $t(`productCategory.${label}`) }}
        </span>
      </template>
    </BaseSelect>

    <div v-if="groupedProducts === null">...wczytuję</div>
    <ul v-else-if="groupedProducts.length > 0" class="product-list-groups">
      <li v-for="[category, groupProducts] in groupedProducts" :key="category" class="product-list-group">
        <div class="product-list-group__title">
          <ProductIcon class="product-list-group__title__icon" :group="category" />
          <div class="product-list-group__title__name">
            {{ $t(`productCategory.${category}`) }}
          </div>
        </div>
        <ul class="product-list">
          <li v-for="product in groupProducts" :key="product.id" class="product-list__item">
            <KitchenProduct :product="product" />
          </li>
        </ul>
      </li>
    </ul>
    <div v-else class="empty-message">
      <div class="empty-message-title">Trochę tu pusto</div>
      Dodaj to, co masz w swojej kuchni
      <BaseButton class="add-product-button space-top" raised color="primary" @click="openAddProductSelect()">
        <BaseIcon class="floating-action-button__icon" icon="plus" weight="semi-bold" />
        {{ $t('shared.addProduct') }}
      </BaseButton>
    </div>

    <!-- <div class="floating-action-button-container">
      <BaseButton class="gtm_my-kitchen-add-product-button floating-action-button" raised color="primary" @click="newProduct()">
        <BaseIcon class="floating-action-button__icon" icon="plus" weight="semi-bold" />
        {{ $t('shared.addProduct') }}
      </BaseButton>
    </div> -->
  </div>
</template>

<script lang="ts">
import groupby from 'lodash.groupby'
import sortby from 'lodash.sortby'
import { computed, defineComponent, nextTick, onBeforeMount, reactive, ref, toRefs, watch } from 'vue'
import { useMeta } from 'vue-meta'

import { PRODUCT_CATEGORY_ORDER } from '@/configs/productCategories'

import { useIngredientsStore } from '@/stores/ingredients'
import { useMyKitchenStore } from '@/stores/myKitchen'
import { useShoppingListStore } from '@/stores/shoppingList'
import { useUserStore } from '@/stores/user'

import KitchenProduct from '@/components/KitchenProduct.vue'
import PageHeader from '@/components/PageHeader.vue'
import ProductIcon from '@/components/ProductIcon.vue'
import { ProductCategory } from '@/typings/productCategories'
import { UserKitchenProductEntity } from '@/typings/entities'
// import SearchWithFilter from '@/components/SearchWithFilter.vue'
// import NewKitchenProductModal from '@/components/modals/NewKitchenProductModal.vue'

export default defineComponent({
  name: 'MyKitchen',

  components: {
    KitchenProduct,
    PageHeader,
    ProductIcon
    // SearchWithFilter
  },

  setup() {
    useMeta({
      title: 'Moja kuchnia'
    })

    // usings
    const ingredientsStore = useIngredientsStore()
    const myKitchenStore = useMyKitchenStore()
    const shoppingListStore = useShoppingListStore()
    const userStore = useUserStore()

    // template refs
    const addProductSelect = ref(null)

    // data
    const data = reactive({
      fetchedData: false,
      selectFocused: false,
      simpleView: true
    })

    // setup computed
    const userAuthenticatedLazy = computed(() => userStore.userAuthenticatedLazy)

    // computed
    const groupedBaseProducts = computed(() => ingredientsStore.groupedBaseProducts)

    const products = computed(() => myKitchenStore.products)

    const groupedProducts = computed(() => {
      if (!products.value) return null

      const sorted = sortby(products.value, 'baseProductName')
      const grouped = groupby(sorted, 'category')
      const entries = Object.entries(grouped) as Array<[ProductCategory, Array<UserKitchenProductEntity>]>

      return sortby(entries, ([group]) => PRODUCT_CATEGORY_ORDER[group])
    })

    const isEmpty = computed(() => {
      return !(groupedProducts.value === null || groupedProducts.value.length > 0)
    })

    // setup methods
    const tryFetchInitialData = () => {
      if (data.fetchedData) return

      if (userAuthenticatedLazy.value) {
        ingredientsStore.fetchBaseProducts()
        ingredientsStore.fetchUnitsGroupedByMeasurement()
        myKitchenStore.fetchProducts()
        shoppingListStore.fetchProducts()
        data.fetchedData = true
      }
    }

    // methods
    const addProductFromSelect = async ({ id }: { id?: number } = {}) => {
      if (id === undefined) return

      await myKitchenStore.addProduct({
        product: {
          baseProductId: id
        }
      })
    }

    const openAddProductSelect = async () => {
      data.selectFocused = true
      await nextTick()
      addProductSelect.value?.setFocus()
    }

    // watch
    watch(userAuthenticatedLazy, newValue => {
      if (newValue && !data.fetchedData) {
        tryFetchInitialData()
      }
    })

    // lifecycle hooks
    onBeforeMount(() => {
      tryFetchInitialData()
    })

    return {
      // template refs
      addProductSelect,
      // data
      ...toRefs(data),
      // computed
      groupedBaseProducts,
      products,
      groupedProducts,
      isEmpty,
      // methods
      addProductFromSelect,
      openAddProductSelect
    }
  }
})
</script>

<style lang="scss" scoped>
.my-kitchen {
  margin-bottom: 88px;
  flex-direction: column;
  display: flex;
  flex: 1;

  .category-group {
    display: flex;
    align-items: center;
  }

  .category-group-icon {
    margin-right: 0.5rem;
    font-size: 1.25rem;
  }

  .empty-message {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 0.875rem;
    color: var(--color-text-secondary);

    .empty-message-title {
      color: var(--color-text-primary);
      margin-bottom: 1rem;
      font-weight: bold;
      font-size: 1rem;
    }
  }

  .add-product-button-container {
    position: relative;
  }

  .add-product-button {
    color: var(--color-primary);

    &.space-top {
      margin-top: 1.5rem;
    }

    &.absolute {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  }

  .add-product-select {
    &.hidden {
      visibility: hidden;
      opacity: 0;
    }
  }

  .add-product-button,
  .add-product-select {
    margin-bottom: 1.5rem;
  }

  .product-list-group {
    &__title {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;

      &__icon {
        margin-right: 0.5rem;
        font-size: 1.5rem;
      }

      &__name {
        font-size: 0.875rem;
        font-weight: bold;
      }
    }
  }

  .product-list-group + .product-list-group {
    margin-top: 1.5rem;
  }

  .product-list {
    display: flex;
    flex-direction: column;
    padding: 0;
    background: var(--color-background-flyout);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border-radius: 1.5rem;
    padding: 0.5rem 1.5rem;

    &__item {
      cursor: pointer;
    }
  }

  .floating-action-button-container {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 100;
  }

  .floating-action-button {
    white-space: nowrap;

    &__icon {
      margin-right: 0.5rem;
      font-size: 1rem;
    }
  }
}
</style>
