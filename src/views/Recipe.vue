<template>
  <div class="layout__page__content">
    <div v-if="recipe && recipe.details" class="recipe">
      <div class="recipe__image-container">
        <div class="recipe__image-container__buttons">
          <BaseLink class="recipe__image-container__button" :href="href" @click="back" tag="button">
            <BaseIcon icon="arrowRight" weight="regular" />
          </BaseLink>
          <BaseMenu>
            <template v-slot:toggle>
              <BaseButton size="small" class="recipe__image-container__button">
                <BaseIcon icon="arrowRight" weight="regular" />
              </BaseButton>
            </template>
            <template v-slot:dropdown>
              <BaseMenuList>
                <BaseMenuLink>Ukryj przepis</BaseMenuLink>
                <BaseMenuLink>Ukryj ten blog</BaseMenuLink>
                <BaseMenuSeparator></BaseMenuSeparator>
                <BaseMenuLink>Skopiuj link do przepisu</BaseMenuLink>
              </BaseMenuList>
            </template>
          </BaseMenu>
        </div>
        <img ref="parallaxImage" class="recipe__main-image" :src="recipe.mainImageUrl" alt="" />
      </div>
      <div class="recipe__main">
        <div class="recipe__header">
          <h2 class="recipe__header__title">{{ recipe.name }}</h2>
          <div class="recipe__header__actions">
            <FavouriteIcon :isFavourite="isFavourite" @removed="deleteFromFavourites" @added="addToFavourites" />
          </div>
        </div>
        <div class="recipe__author">
          <span class="recipe__author__name">{{ recipe.author.name }}</span>
          <span class="recipe__author__blog-name">, {{ recipe.author.blog.name }}</span>
        </div>

        <div class="recipe__tags">
          <BaseButton stroked size="small">
            <Rating :value="recipe.rating" />
          </BaseButton>
          <BaseButton subtle color="blue" size="small" v-for="category in recipe.categoryKeys" :key="category">{{
            $t(`recipeCategory.${category}`)
          }}</BaseButton>
        </div>

        <div class="section-header">
          <div class="section-title">
            <div>Składniki</div>
          </div>
          <BaseLink :href="href" @click="navigate" tag="button" color="primary" class="link-with-icon">
            dodaj wszystkie <BaseIcon class="link-with-icon__icon" icon="plus" weight="semiBold" />
          </BaseLink>
        </div>
        <ul class="recipe__ingredients-list">
          <RecipeIngredient v-for="ingredient in recipe.details.ingredients" :key="ingredient.id" :ingredient="ingredient" />
        </ul>

        <div class="section-header">
          <div class="section-title">
            <div>Przygotowanie</div>
          </div>
        </div>
        <div class="recipe__directions-list">
          <div
            v-for="(paragraph, index) in recipe.details.directionsParagraphs"
            :key="index"
            :class="[
              'recipe__directions-list__item',
              { 'recipe__directions-list__item--selected': index === selectedDirection },
              { 'recipe__directions-list__item--finished': finishedDirections.includes(index) }
            ]"
          >
            <BaseCheckbox v-model="finishedDirections" :value="index">
              <template v-slot:label>
                <div>{{ paragraph }}</div>
              </template>
            </BaseCheckbox>
          </div>
        </div>
        <BaseButton class="update-button" stroked color="black">Zjedzone! Zaaktualizuj kuchnię</BaseButton>
        <BaseButton class="plan-button" raised color="black">
          <BaseIcon class="plan-button__icon" icon="clock" /> Zaplanuj na później
        </BaseButton>
      </div>
    </div>
    <div v-else>
      Wczytuję...
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import _ from 'lodash'
import { mapState } from 'vuex'
import RecipeIngredient from '@/components/recipe/RecipeIngredient'
import FavouriteIcon from '@/components/FavouriteIcon'
import Rating from '@/components/Rating'
import Dialog from '@/components/modals/Dialog'

export default {
  name: 'Recipe',
  props: {
    recipeId: {
      type: String,
      required: true
    }
  },
  components: {
    RecipeIngredient,
    FavouriteIcon,
    Rating
  },
  data: () => ({
    recipe: null,
    // recipeDetails: null,
    finishedDirections: []
  }),
  created() {
    // this.$store.dispatch('recipes/fetchRecipe', this.recipeId).then(r => (this.recipe = r))
    this.$store.dispatch('recipes/fetchDetailedRecipe', this.recipeId).then(rd => (this.recipe = rd))
    this.$store.dispatch('myKitchen/fetchProducts')
    this.$store.dispatch('shoppingList/fetchProducts')
  },
  mounted() {
    window.addEventListener('scroll', () => {
      if (this.$refs.parallaxImage) {
        const rect = this.$refs.parallaxImage.getBoundingClientRect()
        const height = rect.height
        const invisible = height - Math.min(Math.max(height + rect.top, 0), height)
        this.$refs.parallaxImage.style.paddingTop = `${invisible}px`
      }
    })
  },
  methods: {
    back() {
      this.$router.go(-1)
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
      return this.favouriteRecipesIds.find(id => id === this.recipe.id) !== undefined
    },
    allIndexes() {
      return this.recipe.details.directionsParagraphs.map((element, index) => index)
    },
    selectedDirection() {
      return _.min(_.difference(this.allIndexes, this.finishedDirections))
    }
  },
  watch: {
    finishedDirections() {
      const remaining = _.difference(this.allIndexes, this.finishedDirections)

      if (!remaining || remaining.length === 0) {
        this.$modal.show(
          markRaw(Dialog),
          {
            title: 'Zrobione!',
            content: 'Czy chcesz zaaktualizować produkty w swojej kuchni?',
            secondaryText: this.$t('shared.no'),
            primaryText: this.$t('shared.yes')
          },
          {
            close: updateKitchen => {
              if (updateKitchen) {
                alert('Update kitchen')
              }
              this.finishedDirections = []
            }
          }
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.plan-button,
.update-button {
  width: 100%;
}

.update-button {
  margin-top: 32px;
}

.plan-button {
  margin-top: 16px;

  &__icon {
    font-size: 20px;
    margin-right: 8px;
  }
}

.header-dropdown {
  white-space: nowrap;
  margin: 8px 0;

  li {
    padding: 8px 16px;
  }
}

.recipe {
  font-size: 0.875rem;
  line-height: 1.5;
  margin: -32px -32px 0 -32px;
  overflow: hidden;

  &__image-container {
    position: relative;
    padding: 32px;
    height: 320px;
    max-height: 320px;

    &__buttons {
      display: flex;
      justify-content: space-between;
    }

    &__button {
      z-index: 100;
      position: relative;
      font-size: 1.5rem;
      padding: 0.5rem;
      // background: rgba(#fff, 0.75);
      background-color: rgba(#222, 0.75);
      color: #fff;
      // backdrop-filter: blur(8px);
      border-radius: 50px;
      line-height: 0;
      transform: rotate(180deg); // TODO arrow ikonki
    }
  }

  &__main-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__main {
    margin-top: -32px;
    // z-index: 1;
    position: relative;
    background-color: #fff;
    border-radius: 32px 32px 0 0;
    box-shadow: 0 0 32px rgba(0, 0, 0, 0.1);
    padding: 32px;

    &::before {
      content: '';
      position: absolute;
      height: 4px;
      width: 48px;
      border-radius: 8px;
      background-color: $border;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);

      // @media (max-width: 719px) {
      //   content: '';
      // }
    }
  }

  &__header {
    // margin-top: 16px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    &__title {
      margin: 0;
      font-size: 1.25rem;
      line-height: 1.75rem;
    }

    &__actions {
      display: flex;
      align-items: center;
      font-size: 24px;
      height: 1.75rem;

      & {
        margin-left: 16px;
      }
    }
  }

  &__tags {
    margin-top: 12px;
    display: flex;
    flex-wrap: nowrap;
    overflow: auto;
    gap: 8px;

    button {
      text-transform: uppercase;
      font-size: 0.625rem;
      font-weight: bold;
      padding: 0.625rem 1rem;
      height: 32px;
    }
  }

  &__ingredients-list {
  }

  &__directions-list {
    label {
      display: flex;
      align-items: flex-start;

      input {
        margin-right: 16px;
      }
    }

    &__item + &__item {
      margin-top: 16px;
    }

    &__item {
      @include transition((color, text-decoration));

      &--finished {
        color: $text-secondary;
        text-decoration: line-through;
      }

      &--selected {
        font-weight: bold;
      }
    }
  }

  &__author {
    margin-top: 4px;
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
  font-weight: 600;

  &__icon {
    margin: 0 4px;
    font-size: 16px;
  }
}
</style>
