<template>
  <div class="layout__page__content">
    <div class="cook-it-layout">
      <PageHeader :title="$t('cookIt.title')" />

      <GenericRecipesList
        :recipes="recipesList.recipes.value"
        :errors="recipesList.recipesErrors.value"
        :loadHandler="pageNumber => recipesList.loadRecipesPage(pageNumber)"
        @reload="reloadRecipes($event)"
        @reload-with-query="recipesList.reloadRecipesWithQuery($event)"
      >
        <!-- <template v-if="!(!almostAvailableRecipes.fetching && Object.keys(almostAvailableRecipesList.recipes.value.pagedItems).length === 0)" #above-list> -->
        <template
          v-if="
            !(
              !Object.values(almostAvailableRecipesList.recipes.value.fetchingPages).some(v => v) &&
              Object.keys(almostAvailableRecipesList.recipes.value.pagedItems).length === 0
            )
          "
          #above-list
        >
          <div class="almost-available-horizontal">
            <SectionTitle icon="basket" :title="$t('cookIt.buyMissingIngredient')" />
            <HorizontalRecipesList
              :recipes="almostAvailableRecipesList.recipes.value"
              :errors="almostAvailableRecipesList.recipesErrors.value"
              @reload-with-query="almostAvailableRecipesList.reloadRecipesWithQuery($event)"
              @showAll="$router.push({ name: 'almost-available', query: $route.query })"
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
              <BaseLink tag="button" @click="reloadRecipes({})" class="empty-list-message-link" color="primary">
                wyczyścić filtry
              </BaseLink>
              , przeszukać całą
              <router-link :to="{ name: 'recipes', query: $route.query }" v-slot="{ href, navigate }" custom>
                <BaseLink :href="href" @click="navigate($event)" class="empty-list-message-link" color="primary">bazę przepisów</BaseLink>
              </router-link>
              , bądź sprawdzić
              <router-link :to="{ name: 'almost-available', query: $route.query }" v-slot="{ href, navigate }" custom>
                <BaseLink :href="href" @click="navigate($event)" class="empty-list-message-link" color="primary">
                  propozycje przepisów
                </BaseLink>
              </router-link>
              po dokupieniu paru składników.
            </p>
            <p v-else class="empty-list-message-sub">
              Możesz
              <BaseLink tag="button" @click="reloadRecipes({})" class="empty-list-message-link" color="primary">
                wyczyścić filtry
              </BaseLink>
              lub sprawdzić całą
              <router-link :to="{ name: 'recipes', query: $route.query }" v-slot="{ href, navigate }" custom>
                <BaseLink :href="href" @click="navigate($event)" class="empty-list-message-link" color="primary">bazę przepisów</BaseLink>
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
            <router-link :to="{ name: 'my-kitchen' }" v-slot="{ href, navigate }" custom>
              <BaseButton tag="a" :href="href" @click="navigate($event)" stroked>
                Przejdź do kuchni
              </BaseButton>
            </router-link>
          </div>

          <div v-else class="empty-list-message">
            <img class="empty-list-message-image" src="@/assets/img/broccoli-sad.svg" alt="" />
            <p class="empty-list-message-title">Nie znaleźliśmy przepisów pasujących do Twoich produktów</p>
            <p class="empty-list-message-sub">
              <router-link :to="{ name: 'almost-available', query: $route.query }" v-slot="{ href, navigate }" custom>
                <BaseLink :href="href" @click="navigate($event)" color="primary" class="empty-list-message-link">
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

<script>
import { useMeta } from 'vue-meta'
import { computed } from 'vue'
import { useStore } from 'vuex'
import userApi from '@/api/userApi'
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'
import HorizontalRecipesList from '@/components/HorizontalRecipesList'
import SectionTitle from '@/components/SectionTitle'
import recipeFilteredPagedList from './composable/recipeFilteredPagedList'

export default {
  name: 'CookIt',
  components: { GenericRecipesList, PageHeader, HorizontalRecipesList, SectionTitle },
  setup() {
    useMeta({
      title: 'Ugotuj to!'
    })

    const store = useStore()
    const kitchenProductsCount = computed(() => store.state.myKitchen.products?.length || 0)

    const recipesList = recipeFilteredPagedList(userApi.getAvailableRecipes)
    const almostAvailableRecipesList = recipeFilteredPagedList(userApi.getAlmostAvailableRecipes)
    almostAvailableRecipesList.loadRecipesPage(1, false)

    const reloadRecipes = ({ orderMethod, filters, search }) => {
      const query = { orderMethod, filters, search }

      recipesList.reloadRecipes(query)

      almostAvailableRecipesList.reloadRecipes(query)
      almostAvailableRecipesList.loadRecipesPage(1, false)
    }

    return {
      kitchenProductsCount,
      recipesList,
      almostAvailableRecipesList,
      reloadRecipes
    }
  }
}
</script>

<style lang="scss" scoped>
.layout__page__content {
  display: flex;
  flex: 1;
}

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
</style>
