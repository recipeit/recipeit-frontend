<template>
  <div class="layout__page__content">
    <PageHeader title="Ulubione" :backButton="true" />
    <GenericRecipesList :recipes="recipes" @load-next="loadNextRecipes" :showFilterButtons="false" />
  </div>
</template>

<script>
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'
import userApi from '@/api/userApi'
import { RecipeList } from '@/constants'

export default {
  name: 'AvailableRecipes',
  components: {
    GenericRecipesList,
    PageHeader
  },
  data: () => ({
    recipes: new RecipeList()
  }),
  methods: {
    loadNextRecipes() {
      if (this.recipes.fetching) return

      const queryParams = { pageNumber: this.recipes.pagesTo + 1 }

      userApi.getFavouriteRecipes(queryParams).then(({ data }) => {
        this.recipes.addFromApi(data)
      })
    }
  },
  // computed: {
  //   ...mapState({
  //     recipes: state => state.recipes.availableRecipes
  //   })
  // },
  created() {
    this.recipes.fetching = true
    userApi.getFavouriteRecipes().then(({ data }) => {
      this.recipes.setFromApi({ ...data, fetching: false })
    })
    // if (this.recipes.items === null) {
    //   this.$store.dispatch('recipes/fetchAvailableRecipes')
    // }
  }
}
</script>

<style lang="scss" scoped>
.recipes-list-title {
  font-size: 14px;
  margin-bottom: 16px;
  font-weight: bold;
}
</style>
