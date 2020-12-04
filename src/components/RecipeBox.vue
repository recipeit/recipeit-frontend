<template>
  <div class="recipe-box">
    <div class="recipe-box__image-container" @click="showDetails">
      <div class="recipe-box__image-container__image">
        <img :src="recipe.mainImageUrl" :alt="recipe.name" />
      </div>
    </div>
    <div class="recipe-box__name">
      {{ recipe.name }}
    </div>
    <div class="recipe-box__props">
      <Rating :value="recipe.rating" />
      <span v-if="isFavourite" @click="deleteFromFavourites">❤</span>
      <span v-else @click="addToFavourites">🤍</span>
    </div>
  </div>
</template>

<script>
import Rating from '@/components/Rating.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Rating
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
      return this.favouriteRecipesIds.find(id => id === this.recipe.id)
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
    overflow: hidden;

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
  }

  &__props {
    margin-top: 8px;
  }

  &__rating {
    &__value {
      font-size: 10px;
      font-weight: 700;
    }
  }
}
</style>
