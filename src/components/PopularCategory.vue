<template>
  <NuxtLink
    v-slot="{ href, navigate }"
    :to="{ path: page, query: { [`filters.${categoryGroup}`]: categoryKey } }"
    custom
  >
    <a :href="href" class="category" @click="navigate($event)">
      <BaseImageLazyload class="category-image" :src="imageUrl" />
      <div>
        <span class="category-name">{{
          $t(`recipeCategory.${categoryValue}`)
        }}</span>
      </div>
    </a>
  </NuxtLink>
</template>

<script>
import { CATEGORY_IMAGES } from "@/src/configs/recipeCategories";

export default {
  props: {
    page: String,
    categoryKey: Number,
    categoryValue: String,
    categoryGroup: String,
  },
  setup(props) {
    const imageUrl = CATEGORY_IMAGES[props.categoryValue];

    return {
      imageUrl,
    };
  },
};
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

    :deep(.image) {
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
    font-size: 0.75rem;
    font-weight: 700;
    z-index: 0;
    text-align: center;
    text-transform: uppercase;
    color: var(--color-max-contrast);
    background-color: var(--color-background);
    font-style: normal;
    position: relative;
    display: inline;
    box-decoration-break: clone;
    padding: 8.5px 12px;
    border-radius: 32px;
  }
}
</style>
