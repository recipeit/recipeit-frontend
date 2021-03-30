<template>
  <div class="layout__page__content">
    <PageHeader :title="$t('myKitchen.title')"></PageHeader>

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
              <KitchenProduct :product="product" />
            </li>
          </ul>
        </li>
      </ul>

      <div class="floating-action-button-container">
        <BaseButton raised color="contrast" @click="newProduct">
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
// import { groupBy } from 'lodash'
import _ from 'lodash'
import KitchenProduct from '@/components/KitchenProduct'
import NewKitchenProductModal from '@/components/modals/NewKitchenProductModal'
import PageHeader from '@/components/PageHeader.vue'
import LoginBeforeEnter from '@/components/LoginBeforeEnter'
import { PRODUCT_GROUP_ICONS } from '@/constants'

export default {
  name: 'MyKitchen',
  components: {
    KitchenProduct,
    PageHeader,
    LoginBeforeEnter
  },
  setup() {
    return {
      PRODUCT_GROUP_ICONS
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
    }),
    ...mapState({
      products: state => state.myKitchen.products
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
      this.$store.dispatch('ingredients/fetchBaseProducts')
      this.$store.dispatch('myKitchen/fetchProducts')
    }
  },
  methods: {
    newProduct() {
      this.$modal.show(markRaw(NewKitchenProductModal), {}, {})
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
