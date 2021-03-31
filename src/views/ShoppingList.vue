<template>
  <div class="layout__page__content">
    <PageHeader :title="$t('shoppingList.title')"></PageHeader>

    <!-- <ul class="product-list">
      <li class="product-list__item" v-for="product in products" :key="product.id">
        <ShoppingListProduct :product="product" @purchase="purchase(product.id)" />
      </li>
    </ul> -->
    <template v-if="isAuthenticated">
      <ul class="product-list-groups">
        <li class="product-list-group" v-for="products in groupedProducts" :key="products[0]">
          <div class="product-list-group__title">
            <BaseIcon
              :class="['product-list-group__title__icon', `product-list-group__title__icon--${products[0].toLowerCase()}`]"
              :icon="PRODUCT_GROUP_ICONS[products[0]]"
            ></BaseIcon>
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

      <BaseLink v-if="products && products.length > 0" color="primary" class="purchase-all-button" @click="purchaseAll">
        {{ $t('shoppingList.purchaseAllButton') }}
      </BaseLink>

      <div class="floating-action-button-container">
        <BaseButton raised color="contrast" @click="newProduct()">
          <BaseIcon class="floating-action-button__icon" icon="plus" weight="semi-bold" />
          {{ $t('shared.addProduct') }}
        </BaseButton>
      </div>
    </template>

    <LoginBeforeEnter v-else></LoginBeforeEnter>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { mapGetters, mapState } from 'vuex'
import _ from 'lodash'
import ShoppingListProduct from '@/components/ShoppingListProduct'
import Dialog from '@/components/modals/Dialog'
import PageHeader from '@/components/PageHeader.vue'
import LoginBeforeEnter from '@/components/LoginBeforeEnter'
import { PRODUCT_GROUP_ICONS } from '@/constants'
import NewShoppingListProduct from '@/components/modals/NewShoppingListProduct'

export default {
  name: 'ShoppingList',
  components: {
    ShoppingListProduct,
    PageHeader,
    LoginBeforeEnter
  },
  setup() {
    return {
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
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
    }),
    ...mapState({
      products: state => state.shoppingList.products
    }),
    groupedProducts() {
      if (!this.products) return null
      return _(this.products)
        .sortBy(item => item.baseProductName)
        .groupBy(item => item.category)
        .toPairs()
        .sortBy(group => this.$t(`productCategory.${group[0]}`))
        .value()
    }
  },
  beforeMount() {
    if (this.isAuthenticated) {
      this.$store.dispatch('shoppingList/fetchProducts')
    }
  }
}
</script>

<style lang="scss" scoped>
.layout__page__content {
  margin-bottom: 96px;
}

.product-list-group {
  &__title {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;

    &__icon {
      margin-right: 0.5rem;
      color: var(--color-primary);
      font-size: 1.5rem;

      &--dairy {
        color: var(--color-product-dairy);
      }

      &--sweeteners {
        color: var(--color-product-sweeteners);
      }

      &--vegetables {
        color: var(--color-product-vegetables);
      }

      &--bakingandgrains {
        color: var(--color-product-bakingandgrains);
      }

      &--nuts {
        color: var(--color-product-nuts);
      }

      &--dessertsandsnacks {
        color: var(--color-product-dessertsandsnacks);
      }

      &--oils {
        color: var(--color-product-oils);
      }
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
