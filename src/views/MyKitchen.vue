<template>
  <div class="layout__page__content">
    <PageHeader :title="$t('myKitchen.title')"></PageHeader>

    <ul class="product-list-groups">
      <li class="product-list-group" v-for="(products, key) in groupedProducts" :key="key">
        <div class="product-list-group__title">
          <BaseIcon class="product-list-group__title__icon" icon="food"></BaseIcon>
          <div class="product-list-group__title__name">
            {{ $t(`productCategory.${key}`) }}
          </div>
        </div>
        <ul class="product-list">
          <li class="product-list__item" v-for="product in products" :key="product.id">
            <KitchenProduct :product="product" />
          </li>
        </ul>
      </li>
    </ul>

    <!-- <BaseButton :anchorTag="true" href="#" color="accent">Dodaj produkt</BaseButton>
    <BaseButton raised>Dodaj produkt</BaseButton> -->
    <!-- <div><BaseButton raised>Dodaj produkt</BaseButton></div>
    <div><BaseButton raised color="primary">Dodaj produkt</BaseButton></div>
    <div><BaseButton raised color="accent">Dodaj produkt</BaseButton></div>
    <div><BaseButton raised color="warn">Dodaj produkt</BaseButton></div>
    ___

    <div><BaseButton subtle>Dodaj produkt</BaseButton></div>
    <div><BaseButton subtle color="green">Dodaj produkt</BaseButton></div>
    <div><BaseButton subtle color="accent">Dodaj produkt</BaseButton></div>
    <div><BaseButton subtle color="warn">Dodaj produkt</BaseButton></div> -->

    <div class="floating-action-button-container">
      <BaseButton raised color="contrast" @click="newProduct">
        <BaseIcon class="floating-action-button__icon" icon="plus" weight="semi-bold" />
        {{ $t('shared.addProduct') }}
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import { mapState } from 'vuex'
import { groupBy } from 'lodash'
import KitchenProduct from '@/components/KitchenProduct'
import NewKitchenProductModal from '@/components/modals/NewKitchenProductModal'
import PageHeader from '@/components/PageHeader.vue'

export default {
  name: 'MyKitchen',
  components: {
    KitchenProduct,
    PageHeader
  },
  computed: {
    ...mapState({
      products: state => state.myKitchen.products
    }),
    groupedProducts() {
      if (!this.products) return null
      return groupBy(this.products, 'category')
      // groupBy
      // return this.products?.groupBy(p => p.category)
    }
  },
  beforeMount() {
    this.$store.dispatch('ingredients/fetchBaseProducts')
    this.$store.dispatch('myKitchen/fetchProducts')
  },
  methods: {
    newProduct() {
      this.$modal.show(markRaw(NewKitchenProductModal), {}, {})
    }
  }
}
</script>

<style lang="scss" scoped>
.product-list-groups {
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
    }

    &__name {
      padding-top: 4px;
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
  margin: -6px 0;

  &__item {
    padding: 6px 0;
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
