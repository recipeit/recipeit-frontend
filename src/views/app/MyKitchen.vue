<template>
  <div class="layout__page__content">
    <PageHeader :title="$t('myKitchen.title')" />

    <SearchWithFilter class="product-list-filter" placeholder="Szukaj produktu" @search="onSearch($event)" />

    <div v-if="groupedProducts === null">...wczytuję</div>
    <ul v-else-if="groupedProducts.length > 0" class="product-list-groups">
      <li class="product-list-group" v-for="products in groupedProducts" :key="products[0]">
        <div class="product-list-group__title">
          <ProductIcon class="product-list-group__title__icon" :group="products[0]" />
          <div class="product-list-group__title__name">
            {{ $t(`productCategory.${products[0]}`) }}
          </div>
        </div>
        <ul class="product-list">
          <li class="product-list__item" v-for="product in products[1]" :key="product.id">
            <KitchenProduct :product="product" @add-to-shopping-list="addToShoppingList(product)" />
          </li>
        </ul>
      </li>
    </ul>
    <div v-else>
      Dodaj to, co masz w swojej kuchni!
    </div>

    <div class="floating-action-button-container">
      <BaseButton class="gtm_my-kitchen-add-product-button" raised color="primary" @click="newProduct()">
        <BaseIcon class="floating-action-button__icon" icon="plus" weight="semi-bold" />
        {{ $t('shared.addProduct') }}
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { mapState } from 'vuex'
import _ from 'lodash'
import KitchenProduct from '@/components/KitchenProduct'
import NewKitchenProductModal from '@/components/modals/NewKitchenProductModal'
import PageHeader from '@/components/PageHeader'
import ProductIcon from '@/components/ProductIcon'
import SearchWithFilter from '@/components/SearchWithFilter'
import { useMeta } from 'vue-meta'

export default {
  name: 'MyKitchen',
  components: {
    KitchenProduct,
    PageHeader,
    ProductIcon,
    SearchWithFilter
  },
  setup() {
    useMeta({
      title: 'Moja kuchnia'
    })
  },
  data: () => ({
    fetchedData: false,
    searchString: null
  }),
  computed: {
    ...mapState({
      userAuthenticatedLazy: state => state.user.userAuthenticatedLazy,
      products: state => state.myKitchen.products
    }),
    filteredProducts() {
      if (!this.products) return null
      if (!this.searchString) return this.products

      return this.products.filter(p => p.baseProductName.toLowerCase().includes(this.searchString.toLowerCase()))
    },
    groupedProducts() {
      if (!this.filteredProducts) return null
      return _(this.filteredProducts)
        .sortBy(item => item.baseProductName)
        .groupBy(item => item.category)
        .toPairs()
        .sortBy(group => this.$t(`productCategory.${group[0]}`))
        .value()
    }
  },
  beforeMount() {
    this.tryFetchInitialData()
  },
  watch: {
    userAuthenticatedLazy(newValue) {
      if (newValue && !this.fetchedData) {
        this.tryFetchInitialData()
      }
    }
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
    },
    newProduct() {
      this.$modal.show(markRaw(NewKitchenProductModal), {}, {})
    },
    onSearch({ search }) {
      this.searchString = search
    }
  }
}
</script>

<style lang="scss" scoped>
.layout__page__content {
  margin-bottom: 88px;
}

.product-list-filter {
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

  & + & {
    margin-top: 1.5rem;
  }
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
  &__icon {
    margin-right: 0.5rem;
    font-size: 1rem;
  }
}
</style>
