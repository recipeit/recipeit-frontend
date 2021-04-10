<template>
  <div class="skeleton-recipe-box">
    <div class="skeleton-recipe-box__image-container">
      <SkeletonBox class="skeleton-recipe-box__image-container__image" />
    </div>
    <div class="skeleton-recipe-box__name">
      <SkeletonBox class="skeleton-recipe-box__name__line" />
      <SkeletonBox class="skeleton-recipe-box__name__line" />
    </div>
  </div>
</template>

<script>
import SkeletonBox from './SkeletonBox'

export default {
  components: { SkeletonBox }
}
</script>

<style lang="scss" scoped>
.skeleton-recipe-box {
  max-width: 192px;

  &__image-container {
    width: 100%;
    border-radius: 16px;
    border-radius: 24px;
    overflow: hidden;
    position: relative;

    &__image {
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      background-color: var(--color-image-background);
    }
  }

  &__name {
    margin-top: 12px;
    font-size: 14px;
    font-weight: 500;
    padding: 0 8px;
    display: flex;
    flex-direction: column;

    &__line {
      height: 1em;
      margin: 0.25em 0;
      border-radius: 1em;
      background-color: var(--color-image-background);

      &:first-child {
        margin-right: 24px;
      }

      &:last-child {
        margin-right: 96px;
      }
    }
  }
}
</style>
