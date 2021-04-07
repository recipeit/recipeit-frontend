<template>
  <div class="layout__page__content">
    <PageHeader :title="$t('myKitchen.title')"></PageHeader>

    <div v-if="currentUserAuthState === 'USER_LOGGED_IN'">
      <SearchWithFilter class="product-list-filter" placeholder="Szukaj produktu" @search="onSearch($event)" />

      <ul class="product-list-groups">
        <li class="product-list-group" v-for="products in groupedProducts" :key="products[0]">
          <div class="product-list-group__title">
            <ProductIcon class="product-list-group__title__icon" :group="products[0]"></ProductIcon>
            <div class="product-list-group__title__name">
              {{ $t(`productCategory.${products[0]}`) }}
            </div>
          </div>
          <ul class="product-list">
            <li class="product-list__item" v-for="product in products[1]" :key="product.id">
              <KitchenProduct :product="product" />
            </li>
          </ul>
        </li>
      </ul>

      <div class="floating-action-button-container">
        <BaseButton class="gtm_my-kitchen-add-product-button" raised color="contrast" @click="newProduct">
          <BaseIcon class="floating-action-button__icon" icon="plus" weight="semi-bold" />
          {{ $t('shared.addProduct') }}
        </BaseButton>
      </div>
    </div>

    <template v-else-if="currentUserAuthState === 'USER_FETCHING'">
      Czekaj...
    </template>

    <LoginBeforeEnter v-else-if="currentUserAuthState === 'USER_LOGGED_OUT'"></LoginBeforeEnter>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { mapGetters, mapState } from 'vuex'
// import { groupBy } from 'lodash'
import _ from 'lodash'
import KitchenProduct from '@/components/KitchenProduct'
import NewKitchenProductModal from '@/components/modals/NewKitchenProductModal'
import PageHeader from '@/components/PageHeader.vue'
import LoginBeforeEnter from '@/components/LoginBeforeEnter'
import ProductIcon from '@/components/ProductIcon'
import SearchWithFilter from '@/components/SearchWithFilter'

export default {
  name: 'MyKitchen',
  components: {
    KitchenProduct,
    PageHeader,
    LoginBeforeEnter,
    ProductIcon,
    SearchWithFilter
  },
  data: () => ({
    fetchedData: false,
    searchString: null
  }),
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated',
      currentUserAuthState: 'user/currentUserAuthState'
    }),
    ...mapState({
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
    console.log(this.$router)
    this.tryFetchInitialData()
  },
  watch: {
    isAuthenticated(newValue) {
      if (newValue && !this.fetchedData) {
        this.tryFetchInitialData()
      }
    }
  },
  methods: {
    tryFetchInitialData() {
      if (this.fetchedData) return

      if (this.isAuthenticated) {
        this.$store.dispatch('ingredients/fetchBaseProducts')
        this.$store.dispatch('myKitchen/fetchProducts')
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
      // padding-top: 4px;
      font-size: 0.875rem;
      font-weight: bold;
      // color: var(--color-text-secondary);
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
  // margin: -6px 0;
  background: var(--color-background-flyout);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 1.5rem;
  padding: 0.5rem 1.5rem;

  &__item {
    // padding: 6px 0;
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
