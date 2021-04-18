<template>
  <router-link :to="{ name: 'recipe', params: { recipeId: recipe.id } }" v-slot="{ href, navigate }" custom>
    <a :href="href" @click="navigate($event)" class="recipe-box">
      <div class="recipe-box__image-container">
        <div class="recipe-box__image-container__image">
          <BaseImageLazyload :src="recipe.mainImageUrl" :alt="recipe.name" />
        </div>

        <div v-if="showRecipeProps" class="recipe-box__props2">
          <Rating :value="recipe.rating" />
          <FavouriteIcon
            :isFavourite="isFavourite"
            @removed="deleteFromFavourites"
            @added="addToFavourites"
            @click.prevent
            color="text-primary"
          />
        </div>
      </div>
      <div class="recipe-box__name">
        {{ recipe.name }}
      </div>
    </a>
  </router-link>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Rating from '@/components/Rating'
import FavouriteIcon from '@/components/FavouriteIcon'

export default {
  components: {
    Rating,
    FavouriteIcon
  },
  props: {
    recipe: {
      type: Object,
      required: true
    },
    showRecipeProps: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    showDetails() {
      this.$router.push({ name: 'recipe', params: { recipeId: this.recipe.id } })
    },
    addToFavourites() {
      if (!this.isAuthenticated) {
        alert('Zaloguj się')
        return
      }
      this.$store.dispatch('recipes/addToFavourites', this.recipe.id)
    },
    deleteFromFavourites() {
      this.$store.dispatch('recipes/deleteFromFavourites', this.recipe.id)
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
    }),
    ...mapState({
      favouriteRecipesIds: state => state.recipes.favouriteRecipesIds
    }),
    isFavourite() {
      // if (!this.isAuthenticated) {
      //   return false
      // }
      return this.favouriteRecipesIds?.find(id => id === this.recipe.id) !== undefined
    }
  }
}
</script>

<style lang="scss" scoped>
.recipe-box {
  $root: &;

  text-align: left;
  max-width: 192px;
  text-decoration: none;
  color: inherit;

  &:hover &__image-container__image ::v-deep(img) {
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

      ::v-deep(img) {
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
    margin-top: 12px;
    font-size: 14px;
    font-weight: 500;
    padding: 0 8px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
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

    > *:first-child {
      padding-left: 10px;
      padding-right: 12px;
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
