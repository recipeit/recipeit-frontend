<template>
  <div class="layout__page__content almost-available-recipes">
    <PageHeader title="Dokup i ugotuj" :back-button="true" :search="true" />
    <GenericRecipesList
      :recipes="recipesList.recipes.value"
      :errors="recipesList.recipesErrors.value"
      :load-handler="pageNumber => recipesList.loadRecipesPage(pageNumber)"
      @reload="recipesList.reloadRecipes($event)"
      @reload-with-query="recipesList.reloadRecipesWithQuery($event)"
    >
      <template #count="{ count, fetching}">
        <div v-if="count !== 0" class="recipes-count" :class="{ 'hide-text': fetching }">
          <BaseIcon class="recipes-count-icon" icon="basket" />
          <span>
            Znaleźliśmy <b>{{ $tc('shared.recipes', count) }}</b
            >, które możesz przygotować po dokupieniu paru składników
          </span>
        </div>
        <div v-else class="recipes-count-loading">
          wczytuję
        </div>
      </template>

      <template #empty-with-filters>
        <div class="empty-list-message">
          <img class="empty-list-message-image" src="@/assets/img/broccoli-sad.svg" alt="" />
          <p class="empty-list-message-title">Nie znaleźliśmy przepisów dla użytych filtrów</p>
          <p class="empty-list-message-sub">
            Możesz <BaseLink class="empty-list-message-link" color="primary">wyczyścić filtry</BaseLink> lub sprawdzić całą
            <BaseLink class="empty-list-message-link" color="primary">bazę przepisów</BaseLink>.
          </p>
        </div>
      </template>

      <template #empty-without-filters>
        <div v-if="kitchenProductsCount === 0" class="empty-list-message">
          <img class="empty-list-message-image" src="@/assets/img/broccoli-happy.svg" alt="" />
          <p class="empty-list-message-title">Najpierw dodaj coś do swojej kuchni</p>
          <router-link v-slot="{ href, navigate }" :to="{ name: 'my-kitchen' }" custom>
            <BaseButton tag="a" :href="href" stroked @click="navigate($event)">
              Przejdź do kuchni
            </BaseButton>
          </router-link>
        </div>

        <div v-else class="empty-list-message">
          <img class="empty-list-message-image" src="@/assets/img/broccoli-sad.svg" alt="" />
          <p class="empty-list-message-title">Nie znaleźliśmy przepisów pasujących do Twoich produktów</p>
          <p class="empty-list-message-sub">
            Możesz <BaseLink class="empty-list-message-link" color="primary">wyczyścić filtry</BaseLink> lub sprawdzić całą
            <BaseLink class="empty-list-message-link" color="primary">bazę przepisów</BaseLink>.
          </p>
        </div>
      </template>
    </GenericRecipesList>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useMeta } from 'vue-meta'

import userApi from '@/api/userApi'

import recipeFilteredPagedList from '@/views/app/composable/recipeFilteredPagedList'

import GenericRecipesList from '@/components/GenericRecipesList.vue'
import PageHeader from '@/components/PageHeader.vue'

import { useMyKitchenStore } from '@/stores/myKitchen'

export default {
  name: 'AlmostAvailableRecipes',
  components: {
    GenericRecipesList,
    PageHeader
  },
  setup() {
    useMeta({
      title: 'Zrób drobne zakupy'
    })

    const myKitchenStore = useMyKitchenStore()

    const kitchenProductsCount = computed(() => myKitchenStore.products?.length || 0)
    const recipesList = recipeFilteredPagedList(userApi.getAlmostAvailableRecipes)

    return {
      kitchenProductsCount,
      recipesList
    }
  }
}
</script>

<style lang="scss" scoped>
.almost-available-recipes {
  display: flex;
  flex-direction: column;

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

  .recipes-count {
    padding: 1.25rem 1.5rem;
    border-radius: 1.5rem;
    color: var(--color-primary);
    font-weight: 500;
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
}
</style>
