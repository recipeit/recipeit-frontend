<template>
  <div class="layout__page__content recipe-page">
    <div v-if="errors" class="error-page">
      <img class="error-image" src="@/assets/img/broccoli-sad.svg" alt="" />
      <span class="error-text"> Ojjj... nie znaleźliśmy takiego przepisu </span>
      <router-link v-slot="{ href, navigate }" :to="{ name: APP_HOME }" custom>
        <BaseButton tag="a" :href="href" class="recipe-button" stroked @click="navigate($event)"> Wróć na stronę główną </BaseButton>
      </router-link>
    </div>
    <div v-else-if="recipe && recipe.details" :class="['recipe', { 'recipe--hidden': isHidden }]">
      <div class="recipe__image-container">
        <div class="recipe__image-container__buttons">
          <BaseLink class="recipe__image-container__button" tag="button" @click="back()">
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
            {{ cookingHours }}
          </div>
          <!-- <div v-if="recipe.details.servings" class="recipe__header-pill">
            <BaseIcon class="recipe__header-pill__icon" icon="user" weight="semi-bold" />
            {{ $tc('shared.servings', recipe.details.servings) }}
          </div> -->
          <BaseButton class="recipe__header-pill-button" color="primary" raised @click="openPlanRecipeModal()">
            <BaseIcon class="recipe__header-pill-button__icon" icon="clock" weight="semi-bold" />
            Zaplanuj
          </BaseButton>
        </div>

        <BaseLink v-if="isHidden" tag="button" class="recipe__hidden-bar" color="red" @click="showInvisibleInfoModal()">
          <BaseIcon class="recipe__hidden-bar__icon" icon="eye-hidden" weight="semi-bold" />
          Ten przepis jest ukryty
        </BaseLink>

        <div class="recipe__header">
          <h1 class="recipe__header__title">{{ recipe.name }}</h1>
          <div class="recipe__header__actions">
            <FavouriteIcon :is-favourite="isFavourite" @removed="deleteFromFavourites" @added="addToFavourites" />
          </div>
        </div>
        <div class="recipe__author">
          <router-link
            v-slot="{ href, navigate }"
            :to="{ name: 'blog', params: { blogId: recipe.author.blog.slug || recipe.author.blog.id, blogName: recipe.author.blog.name } }"
            custom
          >
            <BaseLink :href="href" color="text-secondary" @click="navigate($event)">
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
            v-for="category in recipe.details.categoriesWithGroups"
            :key="category.key"
            subtle
            color="accent"
            class="recipe__tags__button"
            @click="navigateToRecipesWithCategoryFilter(category)"
          >
            {{ $t(`recipeCategory.${category.value}`) }}
          </BaseButton>
        </div>

        <RecipeIngredientsSection
          :recipe-id="recipe.id"
          :servings="recipe.details.servings"
          :ingredient-groups="recipe.details.ingredientGroups"
        />

        <div v-if="recipe.details.introductionParagraphs" class="recipe-introduction">
          <p v-for="(paragraph, index) in recipe.details.introductionParagraphs" :key="index" class="recipe-paragraph">
            {{ paragraph }}
          </p>
        </div>

        <RecipeDirectionsSection :recipe-id="recipe.id" :directions="recipe.details.directionsParagraphs" />

        <div v-if="recipe.details.summaryParagraphs" class="recipe-summary">
          <p v-for="(paragraph, index) in recipe.details.summaryParagraphs" :key="index" class="recipe-paragraph">
            {{ paragraph }}
          </p>
        </div>

        <div v-if="recipe.details.footerParagraphs" class="recipe-footer">
          <p v-for="(paragraph, index) in recipe.details.footerParagraphs" :key="index" class="recipe-paragraph">
            {{ paragraph }}
          </p>
        </div>

        <div class="recipe-bottom-buttons-section">
          <!-- <BaseButton class="update-button" stroked>Zjedzone! Zaaktualizuj kuchnię</BaseButton> -->
          <BaseButton class="plan-button" raised color="primary" @click="openPlanRecipeModal()">
            <BaseIcon class="plan-button__icon" icon="clock" /> Zaplanuj na później
          </BaseButton>

          <BaseButton v-if="recipe.url" target="_blank" :href="recipe.url" tag="a" class="original-link" stroked>
            <BaseIcon class="plan-button__icon" icon="arrow-right" /> Przejdź do oryginału
          </BaseButton>

          <BaseLink :href="reportLinkHref" color="text-secondary" class="report-link">zgłoś błąd w przepisie</BaseLink>
        </div>

        <!-- <BaseAdSenseAd /> -->
      </div>
    </div>
    <div v-else>Wczytuję...</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, markRaw, PropType, reactive, toRefs } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute, useRouter } from 'vue-router'

import { CONTACT_MAIL_ADDRESS } from '@/configs/emails'
import { ERROR_ACTION_TAG_NAME } from '@/configs/error'

import { parseFilters } from '@/constants'

import { useErrorHandler } from '@/error'

import dayjs from '@/functions/dayjs'

import { useClipboard } from '@/plugins/clipboard'
import { useModal } from '@/plugins/global-sheet-modal'
import { useToast } from '@/plugins/toast'

import { APP_HOME, APP_RECIPES } from '@/router/names'

import { useMyKitchenStore } from '@/stores/myKitchen'
import { useRecipesStore } from '@/stores/recipes'
import { useShoppingListStore } from '@/stores/shoppingList'
import { useUserStore } from '@/stores/user'

import { RecipeEntity } from '@/typings/entities'
import { DetailedRecipe } from '@/typings/recipes'

import FavouriteIcon from '@/components/FavouriteIcon.vue'
import Rating from '@/components/Rating.vue'
import RecipeParallaxGallery from '@/components/RecipeParallaxGallery.vue'
import InvisibleRecipeInfoModal from '@/components/modals/InvisibleRecipeInfoModal.vue'
import PlanRecipeModal from '@/components/modals/PlanRecipeModal.vue'
import RecipeDirectionsSection from '@/components/recipe/RecipeDirectionsSection.vue'
import RecipeIngredientsSection from '@/components/recipe/RecipeIngredientsSection.vue'

export default defineComponent({
  name: 'Recipe',

  components: {
    FavouriteIcon,
    RecipeParallaxGallery,
    RecipeIngredientsSection,
    RecipeDirectionsSection,
    Rating
  },

  props: {
    recipeId: {
      type: String as PropType<RecipeEntity['id']>,
      required: true
    },
    recipeName: {
      type: String as PropType<RecipeEntity['name']>
    }
  },

  setup(props) {
    // usings
    const myKitchenStore = useMyKitchenStore()
    const shoppingListStore = useShoppingListStore()
    const recipesStore = useRecipesStore()
    const userStore = useUserStore()
    const errorHandler = useErrorHandler()
    const toast = useToast()
    const modal = useModal()
    const clipboard = useClipboard()
    const router = useRouter()
    const route = useRoute()

    // data
    const data = reactive({
      errors: false,
      fetchedData: false,
      recipe: null as DetailedRecipe,
      finishedDirections: [] as Array<number>
    })

    // computed
    const isRecipeHidden = computed(() => {
      if (data.recipe) {
        return userStore.isRecipeHidden(data.recipe.id)
      }
      return false
    })

    const isBlogHidden = computed(() => {
      if (data.recipe) {
        return userStore.isBlogHidden(data.recipe.author.blogId)
      }
      return false
    })

    const isHidden = computed(() => {
      return isRecipeHidden.value || isBlogHidden.value
    })

    const cookingHours = computed(() => {
      const recipe = data.recipe
      const cookingMinutes = data.recipe.cookingMinutes

      if (recipe && cookingMinutes) {
        const duration = dayjs.duration(cookingMinutes, 'minutes')

        if (cookingMinutes < 60) {
          return duration.humanize()
        } else if (cookingMinutes === 60) {
          return '1 godzina'
        }
        return `${duration.format('H:mm')} godz.`
      }
      return null
    })

    const isFavourite = computed(() => {
      return recipesStore.favouriteRecipesIds.find(id => id === data.recipe.id) !== undefined
    })

    const images = computed(() => {
      const recipe = data.recipe

      if (!recipe) return null

      const imagesCount = Math.max(recipe.imagesCount, 1)

      return [...Array(imagesCount).keys()].map(i => ({
        src: `/static/recipes/${recipe.id}/${i + 1}.webp`
      }))
    })

    const reportLinkHref = computed(() => {
      const recipe = data.recipe

      if (!recipe) {
        return ''
      }

      const subject = `Błąd w przepisie [ID=${recipe.id}]`

      return `mailto:${CONTACT_MAIL_ADDRESS}?subject=${encodeURIComponent(subject)}`
    })

    // methods
    const navigateToRecipesWithCategoryFilter = ({ key, categoryGroup }) => {
      router.push({ name: APP_RECIPES, query: parseFilters({ [categoryGroup]: [key] }) })
    }

    const back = () => {
      router.go(-1)
    }

    const addToFavourites = () => {
      recipesStore.addToFavourites(data.recipe.id)
    }

    const deleteFromFavourites = () => {
      recipesStore.deleteFromFavourites(data.recipe.id)
    }

    const copyLinkToClipboard = () => {
      const url = window.location.origin + route.path

      if (!url) {
        toast.show('Nie udało się skopiować do schowka', 'error')
      } else if (clipboard(url)) {
        toast.show('Skopiowano do schowka', 'success')
      } else {
        toast.show('Nie udało się skopiować do schowka', 'error')
      }
    }

    const openPlanRecipeModal = () => {
      if (data.recipe) {
        modal.show(markRaw(PlanRecipeModal), { recipeId: data.recipe.id }, {})
      }
    }

    const changeRecipeVisibility = visible => {
      if (data.recipe) {
        userStore.changeRecipeVisibility({ recipeId: data.recipe.id, visible })
      }
    }

    const changeBlogVisibility = visible => {
      userStore.changeBlogVisibility({ blogId: data.recipe.author.blog.id, visible })
    }

    const showInvisibleInfoModal = () => {
      modal.show(markRaw(InvisibleRecipeInfoModal), {}, {})
    }

    // others
    useMeta(
      computed(() => {
        const title = data.recipe?.name || props.recipeName
        return title ? { title } : {}
      })
    )

    recipesStore
      .fetchDetailedRecipe(props.recipeId)
      .then(rd => {
        data.recipe = rd
        data.finishedDirections = recipesStore.getFinishedDirectionsForRecipe(rd.id) || []
      })
      .catch(error => {
        data.errors = true
        errorHandler.captureError(error, {
          [ERROR_ACTION_TAG_NAME]: 'recipe.fetchDetailedRecipe'
        })
      })

    myKitchenStore.fetchProducts().catch(error => {
      errorHandler.captureError(error, {
        [ERROR_ACTION_TAG_NAME]: 'recipe.fetchKitchenProducts'
      })
    })

    shoppingListStore.fetchProducts().catch(error => {
      errorHandler.captureError(error, {
        [ERROR_ACTION_TAG_NAME]: 'recipe.fetchShoppingListProducts'
      })
    })

    return {
      // consts
      APP_HOME,
      // data
      ...toRefs(data),
      // computed
      isRecipeHidden,
      isBlogHidden,
      isHidden,
      cookingHours,
      isFavourite,
      images,
      reportLinkHref,
      //methods
      navigateToRecipesWithCategoryFilter,
      back,
      addToFavourites,
      deleteFromFavourites,
      copyLinkToClipboard,
      openPlanRecipeModal,
      changeRecipeVisibility,
      changeBlogVisibility,
      showInvisibleInfoModal
    }
  }
})
</script>

<style lang="scss" scoped>
.recipe-page {
  display: flex;
  flex-direction: column;

  .error-page {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    .error-image {
      width: 96px;
    }

    .error-text {
      margin-top: 16px;
    }

    .recipe-button {
      margin-top: 16px;
    }
  }

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
    // overflow: hidden;

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
        line-height: 1.5rem;

        #{ $root }--hidden & {
          color: var(--color-text-secondary);
        }
      }

      &__actions {
        display: flex;
        align-items: center;
        font-size: 24px;
        height: 1.5rem;

        & {
          margin-left: 16px;
        }
      }
    }

    &__tags {
      margin-top: 1rem;
      display: flex;
      flex-wrap: nowrap;
      overflow: auto;
      gap: 8px;
      margin-left: -32px;
      margin-right: -32px;
      padding: 0 32px;

      &__button {
        white-space: nowrap;
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
      margin-top: 0.5rem;

      &__name {
        font-weight: 700;
      }
    }
  }

  .original-link {
    margin-top: 1rem;
    width: 100%;
  }
}
</style>
