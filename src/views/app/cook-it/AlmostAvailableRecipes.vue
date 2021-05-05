<template>
  <div class="layout__page__content">
    <PageHeader title="Lista przepisów" :backButton="true" :search="true" />
    <!-- <div class="recipes-list-title">Te potrawy możesz przyrządzić po drobnych zakupach</div> -->
    <GenericRecipesList
      :recipes="recipesList.recipes.value"
      :errors="recipesList.recipesErrors.value"
      @load-next="recipesList.loadNextRecipes()"
      @reload="recipesList.reloadRecipes($event)"
      @reload-with-query="recipesList.reloadRecipesWithQuery($event)"
    >
      <template #count="{ count, fetching}">
        <div v-if="count !== null && !fetching" class="recipes-count">
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
          <p class="empty-list-message-title">Nie znaleźliśmy przepisów dla użytych filtrów</p>
          <p class="empty-list-message-sub">
            Możesz <BaseLink class="empty-list-message-link" color="primary">wyczyścić filtry</BaseLink> lub sprawdzić całą
            <BaseLink class="empty-list-message-link" color="primary">bazę przepisów</BaseLink>.
          </p>
        </div>
      </template>

      <template #empty-without-filters>
        <div v-if="kitchenProductsCount === 0" class="empty-list-message">
          <p class="empty-list-message-title">Najpierw dodaj coś do swojej kuchni</p>
          <router-link :to="{ name: 'my-kitchen' }" v-slot="{ href, navigate }" custom>
            <BaseButton tag="a" :href="href" @click="navigate($event)" stroked>
              Przejdź do kuchni
            </BaseButton>
          </router-link>
        </div>

        <div v-else class="empty-list-message">
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
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'
import userApi from '@/api/userApi'
import recipeFilteredPagedList from '../composable/recipeFilteredPagedList'
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'

export default {
  name: 'AlmostAvailableRecipes',
  components: {
    GenericRecipesList,
    PageHeader
  },
  setup() {
    const store = useStore()
    const kitchenProductsCount = computed(() => store.state.myKitchen.products?.length || 0)
    const recipesList = recipeFilteredPagedList(userApi.getAlmostAvailableRecipes)

    return {
      kitchenProductsCount,
      recipesList
    }
  }
}
</script>

<style lang="scss" scoped>
.layout__page__content {
  display: flex;
  flex-direction: column;
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

  &-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
  }
}
</style>
