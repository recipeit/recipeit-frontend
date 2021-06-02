<template>
  <div class="layout__page__content">
    <div v-if="recipe && recipe.details" :class="['recipe', { 'recipe--hidden': isHidden }]">
      <div class="recipe__image-container">
        <div class="recipe__image-container__buttons">
          <BaseLink class="recipe__image-container__button" @click="back()" tag="button">
            <BaseIcon icon="arrow-right" weight="regular" />
          </BaseLink>
          <BaseMenu>
            <template #toggle>
              <BaseLink class="recipe__image-container__button" tag="button">
                <BaseIcon icon="dots-horizontal" weight="regular" />
              </BaseLink>
            </template>
            <template #dropdown>
              <BaseMenuList>
                <BaseMenuLink v-if="!isRecipeHidden" @click="changeRecipeVisibility(false)">Ukryj ten przepis</BaseMenuLink>
                <BaseMenuLink v-else @click="changeRecipeVisibility(true)">Pokazuj ten przepis</BaseMenuLink>

                <BaseMenuLink v-if="!isBlogHidden" @click="changeBlogVisibility(false)">Ukryj ten blog</BaseMenuLink>
                <BaseMenuLink v-else @click="changeBlogVisibility(true)">Pokazuj ten blog</BaseMenuLink>

                <BaseMenuSeparator />

                <BaseMenuLink @click="copyLinkToClipboard()">Skopiuj link do przepisu</BaseMenuLink>
              </BaseMenuList>
            </template>
          </BaseMenu>
        </div>
        <RecipeParallaxGallery class="recipe__image-gallery" :images="images" />
      </div>
      <div class="recipe__main">
        <div class="recipe__header-pills">
          <div v-if="cookingHours" class="recipe__header-pill">
            <BaseIcon class="recipe__header-pill__icon" icon="clock" weight="semi-bold" />
            {{ cookingHours }} h
          </div>
          <div v-if="recipe.details.servings" class="recipe__header-pill">
            <BaseIcon class="recipe__header-pill__icon" icon="user" weight="semi-bold" />
            {{ $tc('shared.servings', recipe.details.servings) }}
          </div>
          <BaseButton class="recipe__header-pill-button" color="primary" raised @click="openPlanRecipeModal()">
            <BaseIcon class="recipe__header-pill-button__icon" icon="clock" weight="semi-bold" />
            Zaplanuj
          </BaseButton>
        </div>

        <BaseLink tag="button" class="recipe__hidden-bar" v-if="isHidden" color="red" @click="showInvisibleInfoModal()">
          <BaseIcon class="recipe__hidden-bar__icon" icon="eye-hidden" weight="semi-bold" />
          Ten przepis jest ukryty
        </BaseLink>

        <div class="recipe__header">
          <h2 class="recipe__header__title">{{ recipe.name }}</h2>
          <div class="recipe__header__actions">
            <FavouriteIcon :isFavourite="isFavourite" @removed="deleteFromFavourites" @added="addToFavourites" />
          </div>
        </div>
        <div class="recipe__author">
          <router-link :to="{ name: 'blog', params: { blogId: recipe.author.blogId } }" v-slot="{ href, navigate }" custom>
            <BaseLink :href="href" @click="navigate($event)" color="text-secondary">
              <span v-if="recipe.author.name" class="recipe__author__name">{{ recipe.author.name }}, </span>
              <span class="recipe__author__blog-name">{{ recipe.author.blog.name }}</span>
            </BaseLink>
          </router-link>
        </div>

        <div class="recipe__tags">
          <BaseButton v-if="recipe.rating > 0" stroked size="small">
            <Rating :value="recipe.rating" />
          </BaseButton>
          <BaseButton
            subtle
            color="accent"
            size="small"
            v-for="category in recipe.details.categoriesWithGroups"
            :key="category.key"
            @click="navigateToRecipesWithCategoryFilter(category)"
          >
            {{ $t(`recipeCategory.${category.value}`) }}
          </BaseButton>
        </div>

        <RecipeIngredientsSection
          :recipeId="recipe.id"
          :servings="recipe.details.servings"
          :ingredientGroups="recipe.details.ingredientGroups"
        />

        <div v-if="recipe.details.introductionParagraphs" class="recipe-introduction">
          <p class="recipe-paragraph" v-for="(paragraph, index) in recipe.details.introductionParagraphs" :key="index">
            {{ paragraph }}
          </p>
        </div>

        <RecipeDirectionsSection :recipeId="recipe.id" :directions="recipe.details.directionsParagraphs" />

        <div v-if="!recipe.details.summaryParagraphs" class="recipe-summary">
          <p class="recipe-paragraph" v-for="(paragraph, index) in recipe.details.summaryParagraphs" :key="index">
            {{ paragraph }}
          </p>
        </div>

        <div v-if="recipe.details.footerParagraphs" class="recipe-footer">
          <p class="recipe-paragraph" v-for="(paragraph, index) in recipe.details.footerParagraphs" :key="index">
            {{ paragraph }}
          </p>
        </div>

        <div class="recipe-bottom-buttons-section">
          <!-- <BaseButton class="update-button" stroked>Zjedzone! Zaaktualizuj kuchnię</BaseButton> -->
          <BaseButton class="plan-button" raised color="primary" @click="openPlanRecipeModal()">
            <BaseIcon class="plan-button__icon" icon="clock" /> Zaplanuj na później
          </BaseButton>

          <BaseButton target="_blank" v-if="recipe.url" :href="recipe.url" tag="a" class="original-link" stroked>
            <BaseIcon class="plan-button__icon" icon="arrow-right" /> Przejdź do oryginału
          </BaseButton>

          <BaseLink :href="reportLinkHref" color="text-secondary" class="report-link">
            zgłoś błąd w przepisie
          </BaseLink>
        </div>

        <!-- <BaseAdSenseAd /> -->
      </div>
    </div>
    <div v-else>
      Wczytuję...
    </div>
  </div>
</template>

<script>
// import SectionTitle from '@/components/SectionTitle'
import RecipeParallaxGallery from '@/components/RecipeParallaxGallery'
import RecipeIngredientsSection from '@/components/recipe/RecipeIngredientsSection'
import RecipeDirectionsSection from '@/components/recipe/RecipeDirectionsSection'
import dayjs from '@/functions/dayjs'
import { computed, markRaw, reactive, toRefs } from 'vue'
// import _ from 'lodash'
import { mapGetters, mapState, useStore } from 'vuex'
import FavouriteIcon from '@/components/FavouriteIcon'
import Rating from '@/components/Rating'
// import Dialog from '@/components/modals/Dialog'
import { ToastType } from '@/plugins/toast/toastType'
import PlanRecipeModal from '@/components/modals/PlanRecipeModal'
import InvisibleRecipeInfoModal from '@/components/modals/InvisibleRecipeInfoModal'
import { parseFilters } from '@/constants'
import { useMeta } from 'vue-meta'

export default {
  name: 'Recipe',
  props: {
    recipeId: {
      type: String,
      required: true
    }
  },
  components: {
    // SectionTitle,
    FavouriteIcon,
    RecipeParallaxGallery,
    RecipeIngredientsSection,
    RecipeDirectionsSection,
    Rating
  },
  setup(props) {
    const store = useStore()

    const data = reactive({
      fetchedData: false,
      recipe: null,
      finishedDirections: store.getters['recipes/getFinishedDirectionsForRecipe'](props.recipeId) || []
    })

    store.dispatch('recipes/fetchDetailedRecipe', props.recipeId).then(rd => {
      data.recipe = rd
    })

    const computedMeta = computed(() => {
      return data.recipe
        ? {
            title: data.recipe.name
          }
        : {}
    })

    useMeta(computedMeta)

    return {
      ...toRefs(data)
    }
  },
  data: component => ({
    fetchedData: false,
    // recipe: null,
    finishedDirections: component.$store.getters['recipes/getFinishedDirectionsForRecipe'](component.recipeId) || []
  }),
  created() {
    // this.$store.dispatch('recipes/fetchDetailedRecipe', this.recipeId).then(rd => {
    //   this.recipe = rd
    //   this.servings = rd.details.servings
    // })
    this.$store.dispatch('myKitchen/fetchProducts')
    this.$store.dispatch('shoppingList/fetchProducts')
  },
  methods: {
    navigateToRecipesWithCategoryFilter({ key, categoryGroup }) {
      this.$router.push({ name: 'cook-it', query: parseFilters({ [categoryGroup]: [key] }) })
    },
    back() {
      this.$router.go(-1)
    },
    addToFavourites() {
      this.$store.dispatch('recipes/addToFavourites', this.recipe.id)
    },
    deleteFromFavourites() {
      this.$store.dispatch('recipes/deleteFromFavourites', this.recipe.id)
    },
    copyLinkToClipboard() {
      const url = window.location.origin + this.$route.path

      if (!url) {
        this.$toast.show('Nie udało się skopiować do schowka', ToastType.ERROR)
      } else if (this.$clipboard(url)) {
        this.$toast.show('Skopiowano do schowka', ToastType.SUCCESS)
      } else {
        this.$toast.show('Nie udało się skopiować do schowka', ToastType.ERROR)
      }
    },
    openPlanRecipeModal() {
      this.$modal.show(markRaw(PlanRecipeModal), { recipeId: this.recipeId }, {})
    },
    changeRecipeVisibility(visible) {
      this.$store.dispatch('user/changeRecipeVisibility', { recipeId: this.recipeId, visible })
    },
    changeBlogVisibility(visible) {
      this.$store.dispatch('user/changeBlogVisibility', { blogId: this.recipe.author.blogId, visible })
    },
    showInvisibleInfoModal() {
      this.$modal.show(markRaw(InvisibleRecipeInfoModal), {}, {})
    }
  },
  computed: {
    ...mapGetters({
      isRecipeHiddenGetter: 'user/isRecipeHidden',
      isBlogHiddenGetter: 'user/isBlogHidden'
    }),
    ...mapState({
      favouriteRecipesIds: state => state.recipes.favouriteRecipesIds
    }),

    isRecipeHidden() {
      return this.isRecipeHiddenGetter(this.recipeId)
    },
    isBlogHidden() {
      if (this.recipe) {
        return this.isBlogHiddenGetter(this.recipe.author.blogId)
      }
      return false
    },
    isHidden() {
      return this.isRecipeHidden || this.isBlogHidden
    },
    cookingHours() {
      if (this.recipe && this.recipe.cookingMinutes) {
        return dayjs.duration(this.recipe.cookingMinutes, 'minutes').format('H:mm')
      }
      return null
    },
    isFavourite() {
      return this.favouriteRecipesIds.find(id => id === this.recipe.id) !== undefined
    },
    // allIndexes() {
    //   return this.recipe.details.directionsParagraphs.map((element, index) => index)
    // },
    // selectedDirection() {
    //   return _.min(_.difference(this.allIndexes, this.finishedDirections))
    // },
    images() {
      if (!this.recipe) return null

      return [...Array(this.recipe.imagesCount).keys()].map(i => ({
        src: `/static/recipes/${this.recipeId}/${i + 1}.webp`
      }))
    },
    reportLinkHref() {
      const mail = 'kontakt@recipeit.pl'
      const subject = `Błąd w przepisie [ID=${this.recipeId}]`

      return `mailto:${mail}?subject=${subject}`
    }
  },
  watch: {
    // finishedDirections(finishedDirections) {
    //   this.$store.dispatch('recipes/setFinishedDirectionsForRecipe', { recipeId: this.recipeId, finishedDirections })
    //   const remaining = _.difference(this.allIndexes, finishedDirections)
    //   if (!remaining || remaining.length === 0) {
    //     this.$modal.show(
    //       markRaw(Dialog),
    //       {
    //         title: 'Zrobione!',
    //         content: 'Czy chcesz zaaktualizować produkty w swojej kuchni?',
    //         secondaryText: this.$t('shared.no'),
    //         primaryText: this.$t('shared.yes')
    //       },
    //       {
    //         close: updateKitchen => {
    //           if (updateKitchen) {
    //             alert('Update kitchen')
    //           }
    //           this.finishedDirections = []
    //         }
    //       }
    //     )
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.plan-button,
.update-button {
  width: 100%;
}

.recipe-bottom-buttons-section {
  margin-top: 32px;
  text-align: center;
}

.report-link {
  display: inline-block;
  margin-top: 16px;
  font-size: 12px;
  font-weight: 600;
}

.recipe-introduction {
  margin-top: 2rem;
}

.recipe-summary {
  margin-top: 2rem;
}

.recipe-footer {
  margin-top: 2rem;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.recipe-paragraph {
  margin-top: 8px;
  margin-bottom: 0;
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
  $root: &;

  font-size: 0.875rem;
  line-height: 1.5;
  margin: -32px -32px 0 -32px;
  overflow: hidden;

  @media (min-width: 721px) {
    margin: 0;
  }

  &__image-gallery {
    @media (min-width: 721px) {
      border-radius: 32px;
    }
  }

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
      background-color: rgba(var(--color-background-rgb), 0.95);
      color: var(--color-text-primary);
      border-radius: 50px;
      line-height: 0;
      transform: rotate(180deg); // TODO arrow ikonki
    }

    &__parallax {
      height: 320px;
      max-height: 320px;
    }
  }

  &__hidden-bar {
    font-size: 0.875rem;
    font-weight: bold;
    padding: 0.5rem 0 1rem 0;
    line-height: 1rem;
    display: flex;
    align-items: center;

    &__icon {
      font-size: 1rem;
      line-height: inherit;
      margin-right: 0.75rem;
    }
  }

  &__main {
    margin-top: -32px;
    position: relative;
    background-color: var(--color-background);
    border-radius: 32px 32px 0 0;
    box-shadow: 0 0 32px rgba(0, 0, 0, 0.1);
    padding: 32px;

    @media (min-width: 721px) {
      margin-top: 0;
      box-shadow: none;
    }
  }

  &__header-pills {
    display: flex;
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
    padding: 8px 16px;
    font-size: 0.75rem;
    font-weight: 600;
    height: auto;
    gap: 6px;

    &__icon {
      font-size: 16px;
      margin-left: -4px;
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

      #{ $root }--hidden & {
        color: var(--color-text-secondary);
      }
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

  // &__directions-list {
  //   label {
  //     display: flex;
  //     align-items: flex-start;

  //     input {
  //       margin-right: 16px;
  //     }
  //   }

  //   &__item + &__item {
  //     margin-top: 16px;
  //   }

  //   &__item {
  //     @include transition((color, text-decoration));

  //     &--finished {
  //       color: var(--color-text-secondary);
  //       text-decoration: line-through;
  //     }

  //     &--selected {
  //       font-weight: bold;
  //     }
  //   }
  // }

  &__author {
    margin-top: 4px;

    &__name {
      font-weight: 700;
    }
  }
}

.original-link {
  margin-top: 1rem;
  width: 100%;
}
</style>
