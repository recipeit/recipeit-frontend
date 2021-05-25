<template>
  <router-link :to="{ name: APP_RECIPE, params: { recipeId: recipe.id } }" v-slot="{ href, navigate }" custom>
    <a :href="href" @click="navigate($event)" class="hidden-recipe">
      <BaseImageLazyload :src="recipe.mainImageUrl" :alt="recipe.name" class="hidden-recipe__image" />
      <div class="hidden-recipe__details">
        <div class="hidden-recipe__name">{{ recipe.name }}</div>
        <div class="hidden-recipe__author-section">
          <span class="hidden-recipe__author">{{ recipe.author.name }}</span
          ><span class="hidden-recipe__blog">, {{ recipe.author.blog.name }}</span>
        </div>
      </div>
      <div class="hidden-recipe__action">
        <button class="unhide" @click.prevent.stop="$emit('unhide')">
          <BaseIcon icon="eye" weight="semi-bold" />
        </button>
      </div>
    </a>
  </router-link>
</template>

<script>
import { APP_RECIPE } from '@/router/names'

export default {
  props: {
    recipe: {
      type: Object,
      required: true
    }
  },
  setup() {
    return {
      APP_RECIPE
    }
  }
}
</script>

<style lang="scss" scoped>
.hidden-recipe {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-primary);

  &__image {
    height: 48px;
    width: 48px;
    border-radius: 1rem;
    overflow: hidden;
    background-color: var(--color-image-background);

    ::v-deep(img) {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }

  &__details {
    flex: 1;
    padding: 0 1rem;
    min-width: 0;
  }

  &__name,
  &__author-section {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__name {
    font-size: 0.875rem;
  }

  &__author-section {
    color: var(--color-text-secondary);
    font-size: 0.75rem;
  }

  &__author {
    font-weight: bold;
  }

  &__action {
    .unhide {
      width: 32px;
      height: 32px;
      border-radius: 48px;
      background-color: var(--color-button-subtle-primary-background);
      color: var(--color-button-subtle-primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      border: none;
      // margin-right: -5px;
      cursor: pointer;
      @include transition((background-color));

      &:hover {
        background-color: var(--color-button-subtle-primary-background-hover);
      }

      &:active {
        background-color: var(--color-button-subtle-primary-background-active);
      }
    }
  }
}
</style>
