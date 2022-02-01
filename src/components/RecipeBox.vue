<template>
  <router-link class="recipe-box" :to="{ name: APP_RECIPE, params: { recipeId: recipeSlug, recipeName } }">
    <div class="recipe-box__image-container">
      <div class="recipe-box__image-container__image">
        <BaseImageLazyload :src="imageUrl" :alt="recipeName" :error-placeholder="placeholder" />
      </div>

      <div v-if="showRecipeProps" class="recipe-box__props2">
        <!-- <Rating v-if="recipeRating > 0" class="prop-rating" :value="recipeRating" /> -->
        <FavouriteIcon
          class="prop-favourite"
          :is-favourite="isFavourite"
          color="text-primary"
          @removed="deleteFromFavourites()"
          @added="addToFavourites()"
          @click.prevent
        />
      </div>
    </div>
    <div class="recipe-box__name">
      {{ recipeName }}
    </div>
  </router-link>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'

import placeholderDark from '@/assets/img/placeholders/recipe-box-dark.webp'
import placeholderLight from '@/assets/img/placeholders/recipe-box.webp'

import { THEME_DARK } from '@/configs/theme'

import { APP_RECIPE } from '@/router/names'

import { useRecipesStore } from '@/stores/recipes'
import { useUserStore } from '@/stores/user'

import { RecipeEntity } from '@/typings/entities'

import FavouriteIcon from '@/components/FavouriteIcon.vue'

export default defineComponent({
  components: {
    FavouriteIcon
  },

  props: {
    recipeId: {
      type: String as PropType<RecipeEntity['id']>,
      required: true
    },
    recipeSlug: {
      type: String as PropType<RecipeEntity['slug']>,
      required: true
    },
    recipeName: {
      type: String as PropType<RecipeEntity['name']>,
      required: true
    },
    recipeRating: {
      type: Number as PropType<RecipeEntity['rating']>
    },
    showRecipeProps: {
      type: Boolean,
      default: true
    }
  },

  setup(props) {
    // usings
    const recipesStore = useRecipesStore()
    const userStore = useUserStore()

    // computed
    const placeholder = computed(() => {
      return userStore.theme === THEME_DARK ? placeholderDark : placeholderLight
    })
    const isFavourite = computed(() => {
      return recipesStore.favouriteRecipesIds?.find(id => id === props.recipeId) !== undefined
    })
    const imageUrl = computed(() => {
      return `/static/recipes/${props.recipeId}/thumb.webp?v=1`
    })

    // methods
    const addToFavourites = () => {
      recipesStore.addToFavourites(props.recipeId)
    }
    const deleteFromFavourites = () => {
      recipesStore.deleteFromFavourites(props.recipeId)
    }

    return {
      // consts
      APP_RECIPE,
      // computed
      placeholder,
      isFavourite,
      imageUrl,
      // methods
      addToFavourites,
      deleteFromFavourites
    }
  }
})
</script>

<style lang="scss" scoped>
.recipe-box {
  $root: &;

  text-align: left;
  // max-width: 192px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;

  &:hover &__image-container__image :deep(.image) {
    transform: scale(1.1);
  }

  &__image-container {
    width: 100%;
    border-radius: 16px;
    border-radius: 24px;
    overflow: hidden;
    position: relative;

    &__image {
      position: relative;
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      background-color: var(--color-image-background);

      :deep(.image) {
        top: 0;
        left: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        @include transition((opacity, transform));
      }
    }
  }

  &__name {
    margin: 12px 0;
    font-size: 12px;
    line-height: 1.25;
    font-weight: bold;
    padding: 0 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 2.5em;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  &__props {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
  }

  &__props2 {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;

    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 8px;
    min-height: 2rem;

    .prop-rating {
      padding-left: 10px;
      padding-right: 12px;
    }

    .prop-favourite {
      margin-left: auto;
    }

    > * {
      // backdrop-filter: blur(8px) saturate(200%) brightness(150%);
      // backdrop-filter: blur(8px);
      padding: 0 8px;
      border-radius: 50px;
      background-color: rgba(var(--color-background-rgb), 0.95);
      // color: #fff;
    }
  }

  &__rating {
    &__value {
      font-size: 10px;
      font-weight: 700;
    }
  }
}
</style>
