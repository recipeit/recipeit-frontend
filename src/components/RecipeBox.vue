<template>
  <div class="recipe-box">
    <div class="recipe-box__image-container" @click="showDetails">
      <div class="recipe-box__image-container__image">
        <img :src="recipe.mainImageUrl" :alt="recipe.name" />
      </div>

      <div class="recipe-box__props2">
        <Rating :value="recipe.rating" />
        <FavouriteIcon :isFavourite="isFavourite" @removed="deleteFromFavourites" @added="addToFavourites" @click.stop />
      </div>
    </div>
    <div class="recipe-box__name">
      {{ recipe.name }}
    </div>
    <!-- <div class="recipe-box__props">
      <Rating :value="recipe.rating" />
      <FavouriteIcon :isFavourite="isFavourite" @removed="deleteFromFavourites" @added="addToFavourites" />
    </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
    }
  },
  methods: {
    showDetails() {
      this.$router.push({ name: 'recipe', params: { recipeId: this.recipe.id } })
    },
    addToFavourites() {
      this.$store.dispatch('recipes/addToFavourites', this.recipe.id)
    },
    deleteFromFavourites() {
      this.$store.dispatch('recipes/deleteFromFavourites', this.recipe.id)
    }
  },
  computed: {
    ...mapState({
      favouriteRecipesIds: state => state.recipes.favouriteRecipesIds
    }),
    isFavourite() {
      return this.favouriteRecipesIds.find(id => id === this.recipe.id) !== null
    }
  }
}
</script>

<style lang="scss" scoped>
.recipe-box {
  $root: &;

  text-align: left;
  max-width: 192px;

  &:hover &__image-container__image img {
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

      img {
        top: 0;
        left: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
    }
  }

  &__name {
    margin-top: 12px;
    font-size: 14px;
    font-weight: 500;
    padding: 0 8px;
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

    > * {
      // backdrop-filter: blur(8px) saturate(200%) brightness(150%);
      // backdrop-filter: blur(8px);
      padding: 7px 8px;
      border-radius: 50px;
      background-color: rgba(#fff, 0.85);
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
