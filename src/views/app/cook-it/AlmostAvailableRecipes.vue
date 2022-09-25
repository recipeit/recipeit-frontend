<template>
  <div class="layout__page__content almost-available-recipes">
    <PageHeader title="Dokup i ugotuj" :back-button="true" :search="true" />

    <GenericRecipesListWithFilters
      :recipes="recipesList.recipes.value"
      :errors="recipesList.recipesErrors.value"
      :load-handler="pageNumber => recipesList.loadRecipesPage(pageNumber)"
      @reload="recipesList.reloadRecipes($event)"
      @reload-with-query="recipesList.reloadRecipesWithQuery($event)"
    >
      <template #count="{ count, fetching }">
        <div v-if="count !== 0" class="recipes-count" :class="{ 'hide-text': fetching }">
          <BaseIcon class="recipes-count-icon" icon="basket" />
          <span>
            Znaleźliśmy <b>{{ $tc('shared.recipes', count) }}</b
            >, które możesz przygotować po dokupieniu paru składników
          </span>
        </div>
        <div v-else class="recipes-count-loading">wczytuję</div>
      </template>

      <template #empty-with-filters>
        <EmptyListMessage>
          <template #title>Nie znaleźliśmy przepisów dla użytych filtrów</template>
          <template #details>
            Możesz <BaseLink class="message-link" color="primary">wyczyścić filtry</BaseLink> lub sprawdzić całą
            <BaseLink class="message-link" color="primary">bazę przepisów</BaseLink>.
          </template>
        </EmptyListMessage>
      </template>

      <template #empty-without-filters>
        <EmptyListMessage v-if="kitchenProductsCount === 0" :broccoli="'happy'">
          <template #title>Najpierw dodaj coś do swojej kuchni</template>
          <template #button>
            <router-link v-slot="{ href, navigate }" :to="{ name: 'my-kitchen' }" custom>
              <BaseButton tag="a" :href="href" stroked @click="navigate($event)">Przejdź do kuchni</BaseButton>
            </router-link>
          </template>
        </EmptyListMessage>

        <EmptyListMessage v-else class="empty-list-message">
          <template #title>Nie znaleźliśmy przepisów pasujących do Twoich produktów</template>
          <template #details>
            Możesz <BaseLink class="message-link" color="primary">wyczyścić filtry</BaseLink> lub sprawdzić całą
            <BaseLink class="message-link" color="primary">bazę przepisów</BaseLink>.
          </template>
        </EmptyListMessage>
      </template>
    </GenericRecipesListWithFilters>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

import userApi from '@/api/userApi'

import { useMyKitchenStore } from '@/stores/myKitchen'

import recipeFilteredPagedList from '@/views/app/composable/recipeFilteredPagedList'

import GenericRecipesListWithFilters from '@/components/GenericRecipesListWithFilters.vue'
import PageHeader from '@/components/PageHeader.vue'
import EmptyListMessage from '@/components/EmptyListMessage.vue'

export default defineComponent({
  name: 'AlmostAvailableRecipes',

  components: {
    GenericRecipesListWithFilters,
    PageHeader,
    EmptyListMessage
  },

  setup() {
    useMeta({
      title: 'Zrób drobne zakupy'
    })

    // usings
    const myKitchenStore = useMyKitchenStore()

    // composables
    const recipesList = recipeFilteredPagedList(userApi.getAlmostAvailableRecipes)

    // computed
    const kitchenProductsCount = computed(() => myKitchenStore.products?.length || 0)

    return {
      // composables
      recipesList,
      // computed
      kitchenProductsCount
    }
  }
})
</script>

<style lang="scss" scoped>
.almost-available-recipes {
  display: flex;
  flex-direction: column;

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
