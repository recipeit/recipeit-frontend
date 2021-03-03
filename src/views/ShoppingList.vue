<template>
  <div class="layout__page__content">
    <PageHeader :title="$t('shoppingList.title')"></PageHeader>

    <ul class="product-list">
      <li class="product-list__item" v-for="product in products" :key="product.id">
        <ShoppingListProduct :product="product" @purchase="purchase(product.id)" />
      </li>
    </ul>
    <BaseLink v-if="products && products.length > 0" color="primary" class="purchase-all-button" @click="purchaseAll">
      {{ $t('shoppingList.purchaseAllButton') }}
    </BaseLink>

    <div class="floating-action-button-container">
      <BaseButton raised color="contrast">
        <BaseIcon class="floating-action-button__icon" icon="plus" weight="semiBold" />
        {{ $t('shared.addProduct') }}
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { mapState } from 'vuex'
import ShoppingListProduct from '@/components/ShoppingListProduct'
import Dialog from '@/components/modals/Dialog'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'ShoppingList',
  components: {
    ShoppingListProduct,
    PageHeader
  },
  methods: {
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
    ...mapState({
      products: state => state.shoppingList.products
    })
  },
  beforeMount() {
    this.$store.dispatch('shoppingList/fetchProducts')
  }
}
</script>

<style lang="scss" scoped>
.product-list {
  display: flex;
  flex-direction: column;

  &__item {
    padding: 6px 0;
  }
}

.purchase-all-button {
  margin-top: 8px;
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
