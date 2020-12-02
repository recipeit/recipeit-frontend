<template>
  <div class="layout__page__content">
    <div v-if="recipe && recipeDetails" class="recipe">
      <img class="recipe__main-image" :src="recipe.mainImageUrl" alt="" />
      <h2>{{ recipe.name }}</h2>
      <div>
        <span v-if="isFavourite" @click="deleteFromFavourites">❤</span>
        <span v-else @click="addToFavourites">🤍</span>
      </div>
      <div class="recipe__author">
        <span class="recipe__author__name">{{ recipe.author.name }}</span>
        <span class="recipe__author__blog-name">, {{ recipe.author.blog.name }}</span>
      </div>

      <div class="section-header">
        <div class="section-title">
          <div>Składniki</div>
        </div>
        <a class="link-with-icon"><BaseIcon class="link-with-icon__icon" icon="plus" weight="semiBold" /> dodaj wszystkie</a>
      </div>
      <ul class="recipe__ingredients-list">
        <RecipeIngredient v-for="ingredient in recipeDetails.ingredients" :key="ingredient.id" :ingredient="ingredient" />
      </ul>

      <div class="section-header">
        <div class="section-title">
          <div>Przygotowanie</div>
        </div>
      </div>
      <p v-for="(paragraph, index) in recipeDetails.directionsParagraphs" :key="index">
        {{ paragraph }}
      </p>

      <BaseButton> </BaseButton>
    </div>
    <div v-else>
      Wczytuję...
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RecipeIngredient from '@/components/recipe/RecipeIngredient'

export default {
  name: 'Recipe',
  props: {
    recipeId: {
      type: String,
      required: true
    }
  },
  components: {
    RecipeIngredient
  },
  data() {
    return {
      recipe: null,
      recipeDetails: null
    }
  },
  created() {
    this.$store.dispatch('recipes/fetchRecipe', this.recipeId).then(r => (this.recipe = r))
    this.$store.dispatch('recipes/fetchRecipeDetails', this.recipeId).then(rd => (this.recipeDetails = rd))
    this.$store.dispatch('myKitchen/fetchProducts')
    this.$store.dispatch('shoppingList/fetchProducts')
  },
  methods: {
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
.recipe {
  font-size: 0.875rem;
  line-height: 1.5;

  &__main-image {
    width: 100%;
    max-height: 256px;
    object-fit: cover;
  }

  &__ingredients-list {
  }

  &__author {
    color: $text-secondary;

    &__name {
      font-weight: 700;
    }
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0 8px 0;
}

.section-title {
  // font-size: 0.875rem;
  font-size: 1rem;
  font-weight: bold;
}

.recipes-list {
  display: flex;
  flex-wrap: wrap;
  max-width: 416px;
  margin: -8px;

  &__item {
    width: 50%;
    padding: 8px;
    box-sizing: border-box;
    cursor: pointer;
  }
}

.link-with-icon {
  display: flex;
  align-items: center;
  color: $accent;
  font-weight: 600;
  // font-size: 12px;
  cursor: pointer;

  &__icon {
    margin-right: 4px;
    font-size: 16px;
  }
}
</style>
