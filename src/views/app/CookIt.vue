<template>
  <div class="layout__page__content cook-it">
    <div class="cook-it-layout">
      <PageHeader :title="$t('cookIt.title')" />

      <GenericRecipesList
        :recipes="recipesList.recipes.value"
        :errors="recipesList.recipesErrors.value"
        :load-handler="pageNumber => recipesList.loadRecipesPage(pageNumber)"
        @reload="reloadRecipes($event)"
        @reload-with-query="recipesList.reloadRecipesWithQuery($event)"
      >
        <!-- <template v-if="!(!almostAvailableRecipes.fetching && Object.keys(almostAvailableRecipesList.recipes.value.pagedItems).length === 0)" #above-list> -->

        <template
          v-if="
            Object.values(almostAvailableRecipesList.recipes.value.fetchingPages).some(v => v) ||
            almostAvailableRecipesList.recipes.value.pagedItems['1']?.length > 0
          "
          #above-list
        >
          <div class="almost-available-horizontal">
            <SectionTitle
              icon="basket"
              action-text="zobacz"
              :show-action="almostAvailableRecipesList.recipes.value.pagedItems[1]?.length > 0"
              :title="$t('cookIt.buyMissingIngredient')"
              @action-click="showAlmostAvailableRecipes()"
            />
            <HorizontalRecipesList
              :recipes="almostAvailableRecipesList.recipes.value"
              :errors="almostAvailableRecipesList.recipesErrors.value"
              @reload-with-query="almostAvailableRecipesList.reloadRecipesWithQuery($event)"
              @show-all="showAlmostAvailableRecipes()"
            />
          </div>
        </template>

        <template #count="{ count, fetching }">
          <div v-if="count !== 0" class="recipes-count" :class="{ 'hide-text': fetching }">
            <BaseIcon class="recipes-count-icon" icon="chef-hat" />
            <span>
              Znaleźliśmy <b>{{ $tc('shared.recipes', count) }}</b
              >, {{ count === 1 ? 'który' : 'które' }} możesz przygotować z tego, co juz masz!
            </span>
          </div>
        </template>

        <template #empty-with-filters>
          <div class="empty-list-message">
            <img class="empty-list-message-image" src="@/assets/img/broccoli-sad.svg" alt="" />
            <p class="empty-list-message-title">Nie znaleźliśmy przepisów dla użytych filtrów</p>
            <p v-if="almostAvailableRecipesList.recipes.value.totalCount" class="empty-list-message-sub">
              Możesz
              <BaseLink tag="button" class="empty-list-message-link" color="primary" @click="reloadRecipes()">wyczyścić filtry</BaseLink>
              , przeszukać całą
              <router-link v-slot="{ href, navigate }" :to="{ name: 'recipes', query: $route.query }" custom>
                <BaseLink :href="href" class="empty-list-message-link" color="primary" @click="navigate($event)">bazę przepisów</BaseLink>
              </router-link>
              , bądź sprawdzić
              <router-link v-slot="{ href, navigate }" :to="{ name: 'almost-available', query: $route.query }" custom>
                <BaseLink :href="href" class="empty-list-message-link" color="primary" @click="navigate($event)">
                  propozycje przepisów
                </BaseLink>
              </router-link>
              po dokupieniu paru składników.
            </p>
            <p v-else class="empty-list-message-sub">
              Możesz
              <BaseLink tag="button" class="empty-list-message-link" color="primary" @click="reloadRecipes()">wyczyścić filtry</BaseLink>
              lub sprawdzić całą
              <router-link v-slot="{ href, navigate }" :to="{ name: 'recipes', query: $route.query }" custom>
                <BaseLink :href="href" class="empty-list-message-link" color="primary" @click="navigate($event)">bazę przepisów</BaseLink>
              </router-link>
              .
            </p>
            <!-- <BaseButton stroked @click="clearFilters()">Wyczyść filtry</BaseButton> -->
          </div>
        </template>

        <template #empty-without-filters>
          <div v-if="kitchenProductsCount === 0" class="empty-list-message">
            <img class="empty-list-message-image" src="@/assets/img/broccoli-happy.svg" alt="" />
            <p class="empty-list-message-title">Najpierw dodaj coś do swojej kuchni</p>
            <router-link v-slot="{ href, navigate }" :to="{ name: 'my-kitchen' }" custom>
              <BaseButton tag="a" :href="href" stroked @click="navigate($event)"> Przejdź do kuchni </BaseButton>
            </router-link>
          </div>

          <div v-else class="empty-list-message">
            <img class="empty-list-message-image" src="@/assets/img/broccoli-sad.svg" alt="" />
            <p class="empty-list-message-title">Nie znaleźliśmy przepisów pasujących do Twoich produktów</p>
            <p class="empty-list-message-sub">
              <router-link v-slot="{ href, navigate }" :to="{ name: 'almost-available', query: $route.query }" custom>
                <BaseLink :href="href" color="primary" class="empty-list-message-link" @click="navigate($event)">
                  Zobacz propozycje przepisów
                </BaseLink> </router-link
              >, które przygotujesz po dokupieniu paru składników
            </p>
          </div>
        </template>
      </GenericRecipesList>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute, useRouter } from 'vue-router'

import userApi from '@/api/userApi'

import { useMyKitchenStore } from '@/stores/myKitchen'

import { RecipesFilteredPageParams } from '@/typings/recipesPage'

import recipeFilteredPagedList from '@/views/app/composable/recipeFilteredPagedList'

import GenericRecipesList from '@/components/GenericRecipesList.vue'
import HorizontalRecipesList from '@/components/HorizontalRecipesList.vue'
import PageHeader from '@/components/PageHeader.vue'
import SectionTitle from '@/components/SectionTitle.vue'

export default defineComponent({
  name: 'CookIt',

  components: { GenericRecipesList, PageHeader, HorizontalRecipesList, SectionTitle },

  setup() {
    useMeta({
      title: 'Ugotuj to!'
    })

    // usings
    const myKitchenStore = useMyKitchenStore()
    const route = useRoute()
    const router = useRouter()

    // composables
    const recipesList = recipeFilteredPagedList(userApi.getAvailableRecipes)
    const almostAvailableRecipesList = recipeFilteredPagedList(userApi.getAlmostAvailableRecipes)

    // computed
    const kitchenProductsCount = computed(() => myKitchenStore.products?.length || 0)

    // methods
    const reloadRecipes = (query: RecipesFilteredPageParams = {}) => {
      const newQuery: RecipesFilteredPageParams = { ...query }

      recipesList.reloadRecipes(newQuery)

      almostAvailableRecipesList.reloadRecipes(newQuery)
      almostAvailableRecipesList.loadRecipesPage(1, false)
    }

    const showAlmostAvailableRecipes = () => {
      router.push({ name: 'almost-available', query: route.query })
    }

    // lifecycle hooks
    onBeforeMount(() => {
      almostAvailableRecipesList.loadRecipesPage(1, false)
    })

    return {
      // composables
      recipesList,
      almostAvailableRecipesList,
      // computed
      kitchenProductsCount,
      // methods
      reloadRecipes,
      showAlmostAvailableRecipes
    }
  }
})
</script>

<style lang="scss" scoped>
.cook-it {
  display: flex;
  flex: 1;

  .cook-it-layout {
    display: flex;
    flex: 1;
    width: 100%;
    flex-direction: column;
  }

  .almost-available-horizontal {
    margin: 0.5rem 0;

    ::v-deep(.section-title) {
      margin-top: 0;
    }
  }

  .recipes-count {
    padding: 1.25rem 1.5rem;
    border-radius: 1.5rem;
    color: var(--color-primary);
    font-weight: 500;
    font-size: 0.75rem;
    background-color: var(--color-button-subtle-primary-background);
    display: flex;
    align-items: center;
    width: 100%;

    @include transition((background-color, color, opacity, visibility));

    &.hide-text {
      color: transparent;
      background-color: var(--color-image-background);

      * {
        visibility: hidden;
        opacity: 0;
      }
    }

    &-icon {
      font-size: 1.5rem;
      margin-right: 1rem;
    }
  }

  .empty-list-message {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    line-height: 2.25;

    .empty-list-message-image {
      width: 96px;
    }

    .empty-list-message-title {
      margin-bottom: 1rem;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .empty-list-message-link {
      font-weight: bold;
    }

    .empty-list-message-sub {
      font-size: 0.75rem;
    }
  }
}
</style>
