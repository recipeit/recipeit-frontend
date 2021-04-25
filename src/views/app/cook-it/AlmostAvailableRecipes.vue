<template>
  <div class="layout__page__content">
    <PageHeader title="Lista przepisów" :backButton="true" :search="true" />
    <!-- <div class="recipes-list-title">Te potrawy możesz przyrządzić po drobnych zakupach</div> -->
    <GenericRecipesList
      :recipes="recipesList.recipes.value"
      @load-next="recipesList.loadNextRecipes()"
      @reload="recipesList.reloadRecipes($event)"
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
    </GenericRecipesList>
  </div>
</template>

<script>
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'
import userApi from '@/api/userApi'
import recipeFilteredPagedList from '../composable/recipeFilteredPagedList'

export default {
  name: 'AlmostAvailableRecipes',
  components: {
    GenericRecipesList,
    PageHeader
  },
  setup() {
    const recipesList = recipeFilteredPagedList(userApi.getAlmostAvailableRecipes)

    return {
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

  &-icon {
    font-size: 1.5rem;
    margin-right: 1rem;
  }
}
</style>
