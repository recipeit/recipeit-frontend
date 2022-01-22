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
      :limit="100"
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
            <KitchenProduct :product="product" @add-to-shopping-list="addToShoppingList(product)" />
          </li>
        </ul>
      </li>
    </ul>
    <div v-else class="empty-message">
      <div class="empty-message-title">
        Trochę tu pusto
      </div>
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

<script>
import groupby from 'lodash.groupby'
import sortby from 'lodash.sortby'
import { computed, nextTick, reactive, ref, toRefs } from 'vue'
import { mapState, useStore } from 'vuex'
import { useMeta } from 'vue-meta'

import KitchenProduct from '@/components/KitchenProduct.vue'
import PageHeader from '@/components/PageHeader.vue'
import ProductIcon from '@/components/ProductIcon.vue'
// import SearchWithFilter from '@/components/SearchWithFilter.vue'
// import NewKitchenProductModal from '@/components/modals/NewKitchenProductModal.vue'

import { PRODUCT_CATEGORY_ORDER } from '@/configs/productCategories'

export default {
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

    const store = useStore()

    const addProductSelect = ref(null)

    const data = reactive({
      fetchedData: false,
      selectFocused: false,
      simpleView: true
    })

    const groupedBaseProducts = computed(() => store.getters['ingredients/groupedBaseProducts'])

    const addProductFromSelect = ({ id } = {}) => {
      const requestData = {
        product: {
          baseProductId: id
        }
      }

      store.dispatch('myKitchen/addProduct', requestData)
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
      openAddProductSelect
    }
  },
  computed: {
    ...mapState({
      userAuthenticatedLazy: state => state.user.userAuthenticatedLazy,
      products: state => state.myKitchen.products
    }),
    isEmpty() {
      return !(this.groupedProducts === null || this.groupedProducts.length > 0)
    },
    filteredProducts() {
      // if (!this.products) return null
      return this.products

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
  watch: {
    userAuthenticatedLazy(newValue) {
      if (newValue && !this.fetchedData) {
        this.tryFetchInitialData()
      }
    }
  },
  beforeMount() {
    this.tryFetchInitialData()
  },
  methods: {
    tryFetchInitialData() {
      if (this.fetchedData) return

      if (this.userAuthenticatedLazy) {
        this.$store.dispatch('ingredients/fetchBaseProducts')
        this.$store.dispatch('ingredients/fetchUnitsGroupedByMeasurement')
        this.$store.dispatch('myKitchen/fetchProducts')
        this.$store.dispatch('shoppingList/fetchProducts')
        this.fetchedData = true
      }
    }
    // newProduct() {
    //   this.$modal.show(markRaw(NewKitchenProductModal), {}, {})
    // }
    // onSearch({ search }) {
    //   this.searchString = search
    // }
  }
}
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
