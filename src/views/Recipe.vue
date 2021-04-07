<template>
  <div class="layout__page__content">
    <div v-if="recipe && recipe.details" class="recipe">
      <div class="recipe__image-container">
        <div class="recipe__image-container__buttons">
          <BaseLink class="recipe__image-container__button" @click="back()" tag="button">
            <BaseIcon icon="arrow-right" weight="regular" />
          </BaseLink>
          <BaseMenu>
            <template v-slot:toggle>
              <BaseLink class="recipe__image-container__button" tag="button">
                <BaseIcon icon="dots-horizontal" weight="regular" />
              </BaseLink>
            </template>
            <template v-slot:dropdown>
              <BaseMenuList>
                <BaseMenuLink v-if="!hiddenRecipe" @click="hideRecipeInLists()">Ukryj ten przepis</BaseMenuLink>
                <BaseMenuLink v-else @click="unhideRecipeInLists()">Pokazuj ten przepis</BaseMenuLink>

                <BaseMenuLink v-if="!hiddenBlog" @click="hideBlogInLists()">Ukryj ten blog</BaseMenuLink>
                <BaseMenuLink v-else @click="unhideBlogInLists()">Pokazuj ten blog</BaseMenuLink>

                <BaseMenuSeparator></BaseMenuSeparator>
                <BaseMenuLink @click="copyLinkToClipboard()">Skopiuj link do przepisu</BaseMenuLink>
              </BaseMenuList>
            </template>
          </BaseMenu>
        </div>
        <RecipeParallaxGallery :images="images"></RecipeParallaxGallery>
      </div>
      <div class="recipe__main">
        <div class="recipe__header-pills">
          <div v-if="cookingHours" class="recipe__header-pill">
            <BaseIcon class="recipe__header-pill__icon" icon="clock" weight="semi-bold"></BaseIcon>
            {{ cookingHours }} h
          </div>
          <div v-if="recipe.details.servings" class="recipe__header-pill">
            <BaseIcon class="recipe__header-pill__icon" icon="user" weight="semi-bold"></BaseIcon>
            {{ $tc('shared.servings', recipe.details.servings) }}
          </div>
          <BaseButton class="recipe__header-pill-button" color="primary" raised @click="openPlanRecipeModal()">
            <BaseIcon class="recipe__header-pill-button__icon" icon="stop-watch"></BaseIcon>
            Zaplanuj
          </BaseButton>
        </div>
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
          <BaseButton subtle color="accent" size="small" v-for="category in recipe.categoryKeys" :key="category">
            {{ $t(`recipeCategory.${category}`) }}
          </BaseButton>
        </div>

        <div class="section-header">
          <div class="section-title">
            <div class="servings-title">
              Składniki dla
              <BaseButton
                class="servings-button servings-button--left"
                subtle
                color="primary"
                v-bind:disabled="servings <= 1"
                @click="decreaseServings()"
              >
                <BaseIcon icon="minus" weight="semi-bold" />
              </BaseButton>
              <span class="servings-count">{{ servings }}</span>
              <BaseButton class="servings-button servings-button--right" subtle color="primary" @click="increaseServings()">
                <BaseIcon icon="plus" weight="semi-bold" />
              </BaseButton>
              porcji
            </div>
          </div>
        </div>
        <div class="recipe__ingredient-groups">
          <div class="recipe__ingredient-group" v-for="(list, groupName) in recipe.details.ingredientGroups" :key="groupName">
            <div v-if="groupName" class="recipe__ingredient-group-name">{{ groupName }}</div>
            <ul class="recipe__ingredients-list">
              <RecipeIngredient v-for="ingredient in list" :key="ingredient.id" :amountFactor="amountFactor" :ingredient="ingredient" />
            </ul>
          </div>
        </div>
        <div class="recipe__ingredients-button-container">
          <BaseLink tag="button" color="primary" class="all-to-shopping-list-button link-with-icon">
            dodaj brakujące składniki do zakupów
            <!-- <BaseIcon class="link-with-icon__icon" icon="plus" weight="semi-bold" /> -->
          </BaseLink>
        </div>

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
        <BaseButton class="update-button" stroked color="contrast">Zjedzone! Zaaktualizuj kuchnię</BaseButton>
        <BaseButton class="plan-button" raised color="contrast" @click="openPlanRecipeModal()">
          <BaseIcon class="plan-button__icon" icon="clock" /> Zaplanuj na później
        </BaseButton>
        <!-- <BaseAdSenseAd /> -->
      </div>
    </div>
    <div v-else>
      Wczytuję...
    </div>
  </div>
</template>

<script>
import RecipeParallaxGallery from '@/components/RecipeParallaxGallery'
import dayjs from '@/functions/dayjs'
import { markRaw } from 'vue'
import _ from 'lodash'
import { mapGetters, mapState } from 'vuex'
import RecipeIngredient from '@/components/recipe/RecipeIngredient'
import FavouriteIcon from '@/components/FavouriteIcon'
import Rating from '@/components/Rating'
import Dialog from '@/components/modals/Dialog'
import { ToastType } from '@/plugins/toast/toastType'
import PlanRecipeModal from '@/components/modals/PlanRecipeModal'
import userApi from '@/api/userApi'

// import { useMeta } from 'vue-meta'

export default {
  name: 'Recipe',
  // metaInfo: {
  //   title: 'My Example App',
  //   titleTemplate: '%s - Yay!',
  //   htmlAttrs: {
  //     lang: 'en',
  //     amp: true
  //   }
  // },
  props: {
    recipeId: {
      type: String,
      required: true
    }
  },
  components: {
    RecipeIngredient,
    FavouriteIcon,
    RecipeParallaxGallery,
    Rating
  },
  data: component => ({
    fetchedData: false,
    recipe: null,
    // recipeDetails: null,
    servings: 1,
    finishedDirections: component.$store.getters['recipes/getFinishedDirectionsForRecipe'](component.recipeId) || [],
    hiddenRecipe: false, //temporary!!!! TODO
    hiddenBlog: false //temporary!!!! TODO
  }),
  created() {
    this.$store.dispatch('recipes/fetchDetailedRecipe', this.recipeId).then(rd => {
      this.recipe = rd
      this.servings = rd.details.servings
    })
    this.tryFetchInitialData()
  },
  methods: {
    tryFetchInitialData() {
      if (this.fetchedData) return

      if (this.isAuthenticated) {
        this.$store.dispatch('myKitchen/fetchProducts')
        this.$store.dispatch('shoppingList/fetchProducts')
        this.fetchedData = true
      }
    },
    back() {
      this.$router.go(-1)
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
    },
    decreaseServings() {
      if (this.servings > 1) {
        this.servings -= 1
      } else {
        this.servings = 1
      }
    },
    increaseServings() {
      this.servings += 1
    },
    copyLinkToClipboard() {
      const { url } = this.recipe

      if (!url) {
        this.$toast.show('Nie udało się skopiować do schowka', ToastType.ERROR)
      } else if (this.$clipboard(url)) {
        this.$toast.show('Skopiowano do schowka', ToastType.SUCCESS)
      } else {
        this.$toast.show('Nie udało się skopiować do schowka', ToastType.ERROR)
      }
    },
    openPlanRecipeModal() {
      if (!this.isAuthenticated) {
        alert('Zaloguj się')
        return
      }
      this.$modal.show(markRaw(PlanRecipeModal), { recipeId: this.recipeId }, {})
    },
    hideRecipeInLists() {
      if (!this.isAuthenticated) {
        alert('Zaloguj się')
        return
      }

      userApi
        .changeRecipeVisibility(this.recipeId, false)
        .then(({ data }) => {
          if (data.success) {
            this.hiddenRecipe = true
            this.$toast.show('Przepis został ukryty', ToastType.SUCCESS)
          } else {
            this.$toast.show('Nie udało się ukryć przepisu. Spróbuj ponownie', ToastType.ERROR)
          }
        })
        .catch(() => {
          this.$toast.show('Nie udało się ukryć przepisu. Spróbuj ponownie', ToastType.ERROR)
        })
    },
    unhideRecipeInLists() {
      userApi
        .changeRecipeVisibility(this.recipeId, true)
        .then(({ data }) => {
          if (data.success) {
            this.hiddenRecipe = false
            this.$toast.show('Przepis został odkryty. Od teraz będzie pojawiał się w wynikach wyszukiwania', ToastType.SUCCESS)
          } else {
            this.$toast.show('Nie udało się odkryć przepisu. Spróbuj ponownie', ToastType.ERROR)
          }
        })
        .catch(() => {
          this.$toast.show('Nie udało się odkryć przepisu. Spróbuj ponownie', ToastType.ERROR)
        })
    },
    hideBlogInLists() {
      if (!this.isAuthenticated) {
        alert('Zaloguj się')
        return
      }
      if (this.hiddenBlog) return
      this.hiddenBlog = true
      // this.$store.dispatch('user/hideBlog', this.recipe.id)
      this.$toast.show('Blog został ukryty', ToastType.SUCCESS)
    },
    unhideBlogInLists() {
      if (!this.hiddenBlog) return
      this.hiddenBlog = false
      // this.$store.dispatch('user/unhideBlog', this.recipe.id)
      this.$toast.show('Blog został odkryty. Od teraz przepisy tego twórcy będą pojawiać się w wynikach wyszukiwania', ToastType.SUCCESS)
    }
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
    }),
    ...mapState({
      favouriteRecipesIds: state => state.recipes.favouriteRecipesIds
    }),
    cookingHours() {
      if (this.recipe && this.recipe.cookingMinutes) {
        return dayjs.duration(this.recipe.cookingMinutes, 'minutes').format('H:mm')
      }
      return null
    },
    amountFactor() {
      if (this.recipe) {
        return this.servings / this.recipe.details.servings
      }
      return this.servings
    },
    isFavourite() {
      return this.favouriteRecipesIds.find(id => id === this.recipe.id) !== undefined
    },
    allIndexes() {
      return this.recipe.details.directionsParagraphs.map((element, index) => index)
    },
    selectedDirection() {
      return _.min(_.difference(this.allIndexes, this.finishedDirections))
    },
    images() {
      return [
        {
          src: this.recipe.mainImageUrl
        },
        {
          src: 'https://www.kwestiasmaku.com/sites/v123.kwestiasmaku.com/files/makaron_stir_fry_01.jpg'
        },
        {
          src: 'https://www.kwestiasmaku.com/sites/v123.kwestiasmaku.com/files/stirfry_wolowina_brokul_01.jpg'
        },
        {
          src: 'https://www.kwestiasmaku.com/sites/v123.kwestiasmaku.com/files/nalesniki-po-bolonsku-01.jpg'
        }
      ]
    }
  },
  watch: {
    isAuthenticated(newValue) {
      if (newValue && !this.fetchedData) {
        this.tryFetchInitialData()
      }
    },
    finishedDirections(finishedDirections) {
      this.$store.dispatch('recipes/setFinishedDirectionsForRecipe', { recipeId: this.recipeId, finishedDirections })
      const remaining = _.difference(this.allIndexes, finishedDirections)

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

.servings-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.servings-count {
  color: var(--color-primary);
  min-width: 36px;
  padding: 0 6px;
  display: inline-block;
  text-align: center;
}

.servings-button {
  display: inline-flex;
  width: 32px;
  padding: 0;
  height: 32px;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  vertical-align: middle;
  line-height: 1;

  &--left {
    margin-left: 12px;
  }

  &--right {
    margin-right: 12px;
  }
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

    &__buttons {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      padding: 32px;
    }

    &__button {
      z-index: 100;
      position: relative;
      font-size: 1.5rem;
      padding: 0.5rem;
      // background: rgba(#fff, 0.75);
      // background-color: rgba(#222, 0.75);
      background-color: rgba(var(--color-background-rgb), 0.95);
      color: var(--color-text-primary);
      // backdrop-filter: blur(8px);
      border-radius: 50px;
      line-height: 0;
      transform: rotate(180deg); // TODO arrow ikonki
    }

    &__parallax {
      height: 320px;
      max-height: 320px;
    }
  }

  &__main {
    margin-top: -32px;
    // z-index: 1;
    position: relative;
    background-color: var(--color-background);
    border-radius: 32px 32px 0 0;
    box-shadow: 0 0 32px rgba(0, 0, 0, 0.1);
    padding: 32px;

    // &::before {
    //   content: '';
    //   position: absolute;
    //   height: 4px;
    //   width: 48px;
    //   border-radius: 8px;
    //   background-color: var(--color-border);
    //   top: 12px;
    //   left: 50%;
    //   transform: translateX(-50%);

    //   // @media (max-width: 719px) {
    //   //   content: '';
    //   // }
    // }
  }

  &__header-pills {
    display: flex;
    // width: 100%;
    gap: 8px;
    position: absolute;
    top: 0;
    right: 32px;
    left: 32px;
    transform: translateY(-50%);
  }

  &__header-pill {
    background-color: var(--color-background-flyout);
    box-shadow: 0 24px 48px -8px rgba(0, 0, 0, 0.3);
    padding: 8px 12px;
    font-size: 0.75rem;
    font-weight: bold;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 6px;

    &__icon {
      color: var(--color-text-secondary);
      font-size: 16px;
    }
  }

  &__header-pill-button {
    margin-left: auto;
    padding: 8px 12px;
    font-size: 0.75rem;
    font-weight: bold;
    height: auto;
    gap: 6px;

    &__icon {
      font-size: 16px;
    }
  }

  &__header {
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

  &__ingredient-groups {
  }

  &__ingredient-group {
  }

  &__ingredient-group-name {
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    min-height: 2rem;
    font-weight: bold;
    gap: 1rem;

    &:before,
    &:after {
      content: '';
      height: 1px;
      flex: 1;
      background: var(--color-border);
    }
  }
  &__ingredients-button-container {
    margin-top: 16px;

    button {
      margin-left: auto;
      font-size: 0.75rem;
    }
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
        color: var(--color-text-secondary);
        text-decoration: line-through;
      }

      &--selected {
        font-weight: bold;
      }
    }
  }

  &__author {
    margin-top: 4px;
    color: var(--color-text-secondary);

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
