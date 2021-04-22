<template>
  <router-link :to="{ name: 'cook-it', query: { 'filters.Category': categoryKey } }" #default="{ href, navigate }" custom>
    <a :href="href" @click="navigate($event)" class="category">
      <BaseImageLazyload class="category-image" :src="imageUrl" />
      <span class="category-name">{{ $t(`recipeFilterOptions.Category.${categoryValue}`) }}</span>
    </a>
  </router-link>
</template>

<script>
import PopularCategoryData from '@/configs/popularCategories'
import { computed } from '@vue/runtime-core'
// https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGFzdGF8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60

export default {
  props: {
    categoryKey: String,
    categoryValue: String
  },
  setup(props) {
    const imageUrl = computed(() => PopularCategoryData[props.categoryValue]?.image)

    return {
      imageUrl
    }
  }
}
</script>

<style lang="scss" scoped>
.category {
  $root: &;

  position: relative;
  overflow: hidden;
  background-color: var(--color-image-background);
  color: inherit;
  text-decoration: none;
  display: block;
  height: 100%;
  width: 100%;
  display: flex;
  padding: 16px;
  text-align: center;
  justify-content: center;
  align-items: center;
  border-radius: 1.5rem;
  min-height: 96px;

  &-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;

    ::v-deep(img) {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }

    @include transition((transform));

    @include cursor-only {
      #{ $root }:hover &,
      #{ $root }:focus & {
        transform: scale(1.25);
      }
    }
  }

  &-name {
    color: var(--color-max-contrast);
    font-size: 0.75rem;
    font-weight: 700;
    z-index: 0;
    display: block;
    text-transform: uppercase;
    height: 32px;
    padding: 0 16px;
    border-radius: 30px;
    background: var(--color-background);
    line-height: 32px;
  }
}
</style>
