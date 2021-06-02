<template>
  <div class="layout__page__content">
    <PageHeader :title="$t('shoppingList.title')" />

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
            <ShoppingListProduct :product="product" @purchase="purchase(product.id)" />
          </li>
        </ul>
      </li>
    </ul>
    <div v-else>
      Dodaj pierwszy produkt do listy zakupów!
    </div>

    <BaseLink v-if="products && products.length > 0" color="primary" class="purchase-all-button" @click="purchaseAll">
      {{ $t('shoppingList.purchaseAllButton') }}
    </BaseLink>

    <div class="floating-action-button-container">
      <BaseButton raised color="primary" @click="newProduct()">
        <BaseIcon class="floating-action-button__icon" icon="plus" weight="semi-bold" />
        {{ $t('shared.addProduct') }}
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { markRaw, ref } from 'vue'
import { mapState } from 'vuex'
import _ from 'lodash'
import ShoppingListProduct from '@/components/ShoppingListProduct'
import Dialog from '@/components/modals/Dialog'
import PageHeader from '@/components/PageHeader'
import { PRODUCT_GROUP_ICONS } from '@/constants'
import NewShoppingListProduct from '@/components/modals/NewShoppingListProduct'
import ProductIcon from '@/components/ProductIcon'
import { useMeta } from 'vue-meta'

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

    const fetchedData = ref(false)
    const searchString = ref(null)

    return {
      fetchedData,
      searchString,
      PRODUCT_GROUP_ICONS
    }
  },
  methods: {
    newProduct() {
      this.$modal.show(markRaw(NewShoppingListProduct), {}, {})
    },
    purchase(id) {
      this.$store.dispatch('shoppingList/purchaseProduct', id)
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
              this.$store.dispatch('shoppingList/purchaseAllProducts')
            }
          }
        }
      )
    },
    onSearch({ search }) {
      this.searchString = search
    }
  },
  computed: {
    ...mapState({
      products: state => state.shoppingList.products
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
    this.$store.dispatch('ingredients/fetchBaseProducts')
    this.$store.dispatch('ingredients/fetchUnitsGroupedByMeasurement')
    this.$store.dispatch('shoppingList/fetchProducts')
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
  &__icon {
    margin-right: 0.5rem;
    font-size: 1rem;
  }
}
</style>
