<template>
  <div class="skeleton-recipe-box">
    <div class="skeleton-recipe-box__image-container">
      <div class="skeleton-recipe-box__image-container__image">
        <div class="hint">Kliknij serce aby dodać do ulubionych</div>

        <div class="recipe-box-props">
          <div class="prop-favourite">
            <BaseIcon icon="heart" class="prop-favourite-icon" />
          </div>
        </div>
      </div>
    </div>
    <div class="skeleton-recipe-box__name">
      <SkeletonBox :animate="false" class="skeleton-recipe-box__name__line" />
      <SkeletonBox :animate="false" class="skeleton-recipe-box__name__line" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import SkeletonBox from '@/components/skeletons/SkeletonBox.vue'

export default defineComponent({
  components: { SkeletonBox }
})
</script>

<style lang="scss" scoped>
.skeleton-recipe-box {
  .hint {
    position: absolute;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    bottom: 0;
    display: flex;
    // align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  .recipe-box-props {
    display: flex;
    position: absolute;
    bottom: 8px;
    right: 8px;
    min-height: 2rem;

    .prop-favourite {
      margin-left: auto;
      display: flex;
      align-items: center;
      padding: 0 8px;
      border-radius: 50px;
      background-color: rgba(var(--color-background-rgb), 0.95);
    }
  }

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
    margin: 12px 0;
    font-size: 12px;
    font-weight: 500;
    padding: 0 8px;
    display: flex;
    flex-direction: column;

    &__line {
      height: 0.75em;
      margin: 0.25em 0;
      border-radius: 1em;
      background-color: var(--color-image-background);

      &:first-child {
        margin-right: 15%;
      }

      &:last-child {
        margin-right: 50%;
      }
    }
  }
}
</style>
