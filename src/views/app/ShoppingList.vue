<template>
  <div class="layout__page__content shopping-list">
    <PageHeader :title="$t('shoppingList.title')" />

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
      <li v-for="products in groupedProducts" :key="products[0]" class="product-list-group">
        <div class="product-list-group__title">
          <ProductIcon class="product-list-group__title__icon" :group="products[0]" />
          <div class="product-list-group__title__name">
            {{ $t(`productCategory.${products[0]}`) }}
          </div>
        </div>
        <ul class="product-list">
          <li v-for="product in products[1]" :key="product.id" class="product-list__item">
            <ShoppingListProduct :product="product" @purchase="purchase(product.id)" />
          </li>
        </ul>
      </li>
    </ul>
    <div v-else class="empty-message">
      <div class="empty-message-title">
        Trochę tu pusto
      </div>
      Dodaj coś do listy zakupów
      <BaseButton class="add-product-button space-top" raised color="primary" @click="openAddProductSelect()">
        <BaseIcon class="floating-action-button__icon" icon="plus" weight="semi-bold" />
        {{ $t('shared.addProduct') }}
      </BaseButton>
    </div>

    <BaseLink v-if="products && products.length > 0" color="primary" class="purchase-all-button" @click="purchaseAll">
      {{ $t('shoppingList.purchaseAllButton') }}
    </BaseLink>

    <!-- <div class="floating-action-button-container">
      <BaseButton class="floating-action-button" raised color="primary" @click="newProduct()">
        <BaseIcon class="floating-action-button__icon" icon="plus" weight="semi-bold" />
        {{ $t('shared.addProduct') }}
      </BaseButton>
    </div> -->
  </div>
</template>

<script>
import groupby from 'lodash.groupby'
import sortby from 'lodash.sortby'
import { computed, markRaw, nextTick, reactive, ref, toRefs } from 'vue'
import { useMeta } from 'vue-meta'

import { PRODUCT_CATEGORY_ORDER } from '@/configs/productCategories'

import { PRODUCT_GROUP_ICONS } from '@/constants'

import { useIngredientsStore } from '@/stores/ingredients'
import { useShoppingListStore } from '@/stores/shoppingList'

import PageHeader from '@/components/PageHeader.vue'
import ProductIcon from '@/components/ProductIcon.vue'
import ShoppingListProduct from '@/components/ShoppingListProduct.vue'
import Dialog from '@/components/modals/Dialog.vue'
// import NewShoppingListProduct from '@/components/modals/NewShoppingListProduct.vue'

export default {
  name: 'ShoppingList',
  components: {
    ShoppingListProduct,
    PageHeader,
    ProductIcon
  },
  setup() {
    useMeta({
      title: 'Lista zakupów'
    })

    const ingredientsStore = useIngredientsStore()
    const shoppingListStore = useShoppingListStore()

    const addProductSelect = ref(null)

    const data = reactive({
      fetchedData: false,
      selectFocused: false
    })

    const groupedBaseProducts = computed(() => ingredientsStore.groupedBaseProducts)
    const products = computed(() => shoppingListStore.products)

    const addProductFromSelect = ({ id } = {}) => {
      const requestData = {
        baseProductId: id
      }

      shoppingListStore.addProduct(requestData)
    }

    const openAddProductSelect = async () => {
      data.selectFocused = true
      await nextTick()
      // console.log(addProductSelect)
      addProductSelect.value?.setFocus()
    }

    return {
      ...toRefs(data),
      addProductSelect,
      groupedBaseProducts,
      addProductFromSelect,
      openAddProductSelect,
      PRODUCT_GROUP_ICONS,
      ingredientsStore,
      shoppingListStore,
      products
    }
  },
  computed: {
    isEmpty() {
      return !(this.groupedProducts === null || this.groupedProducts.length > 0)
    },
    filteredProducts() {
      return this.products
      // if (!this.products) return null
      // if (!this.searchString) return this.products

      // return this.products.filter(p => p.baseProductName.toLowerCase().includes(this.searchString.toLowerCase()))
    },
    groupedProducts() {
      const { filteredProducts } = this

      if (!filteredProducts) return null

      const sorted = sortby(filteredProducts, 'baseProductName')
      const grouped = groupby(sorted, 'category')
      const sortedGroups = sortby(Object.entries(grouped), ([group]) => PRODUCT_CATEGORY_ORDER[group])

      return sortedGroups
    }
  },
  beforeMount() {
    this.ingredientsStore.fetchBaseProducts()
    this.ingredientsStore.fetchUnitsGroupedByMeasurement()
    this.shoppingListStore.fetchProducts()
  },
  methods: {
    // newProduct() {
    //   this.$modal.show(markRaw(NewShoppingListProduct), {}, {})
    // },
    purchase(id) {
      this.shoppingListStore.purchaseProduct(id)
    },
    purchaseAll() {
      this.$modal.show(
        markRaw(Dialog),
        {
          title: this.$t('shoppingList.purchaseAllDialogTitle', {
            products: this.$tc('shared.products', this.products.length)
          }),
          secondaryText: this.$t('shared.no'),
          primaryText: this.$t('shared.yes')
        },
        {
          close: purchase => {
            if (purchase) {
              this.shoppingListStore.purchaseAllProducts()
            }
          }
        }
      )
    }
    // onSearch({ search }) {
    //   this.searchString = search
    // }
  }
}
</script>

<style lang="scss" scoped>
.shopping-list {
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

  .purchase-all-button {
    margin-top: 1.5rem;
    justify-content: flex-end;
    font-size: 12px;
    font-weight: bold;
    display: flex;
    align-items: center;

    &__icon {
      font-size: 20px;
      margin-right: 4px;
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
