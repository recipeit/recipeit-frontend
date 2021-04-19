<template>
  <div class="layout__page__content">
    <PageHeader :showUser="false">
      <template #title>
        <div v-if="blogDetails">
          {{ blogDetails.name }}
        </div>
        <div v-else>...wczytuję</div>
        <!-- <h1 v-if="userProfile && userProfile.username" class="home-page__title">
          <span class="home-page__title__sub">{{ $t(welcomeType) }},</span>
          <span class="home-page__title__main">{{ userProfile.username }}</span>
        </h1>
        <h1 v-else class="home-page__title">
          <span>{{ $t(welcomeType) }}</span>
        </h1> -->
      </template>
    </PageHeader>
    <GenericRecipesList :recipes="recipes" @load-next="loadNextRecipes" @reload="reloadRecipes" :showFilterButtons="false" />
  </div>
</template>

<script>
import blogApi from '@/api/blogApi'
import { mapState } from 'vuex'
import { fetchRecipesQueryParams } from '@/constants'
import recipeApi from '@/api/recipeApi'
import GenericRecipesList from '@/components/GenericRecipesList'
import PageHeader from '@/components/PageHeader'

export default {
  name: 'Recipes',
  props: {
    blogId: {
      type: String,
      required: true
    }
  },
  components: {
    GenericRecipesList,
    PageHeader
  },
  data: () => ({
    getRecipesApiEndpoint: recipeApi.getRecipes,
    blogDetails: null
  }),
  created() {
    console.log('eee')
    blogApi.getBlogDetails(this.blogId).then(({ data }) => {
      this.blogDetails = data
    })
  },
  methods: {
    loadNextRecipes() {
      const { orderMethod, filters, search } = this.recipes
      this.fetchNextRecipes(orderMethod, filters, search)
    },
    reloadRecipes({ orderMethod, filters, search }) {
      this.fetchRecipes(orderMethod, filters, search)
    },
    search() {
      this.fetchRecipes(this.recipes.orderMethod, this.recipes.filters, this.recipes.search)
    },
    fetchNextRecipes(orderMethod, filters, search) {
      this.$store.dispatch('recipes/fetchNextRecipes', fetchRecipesQueryParams(orderMethod, filters, search))
    },
    fetchRecipes(orderMethod, filters, search) {
      this.$store.dispatch('recipes/fetchRecipes', fetchRecipesQueryParams(orderMethod, filters, search))
    }
  },
  computed: {
    ...mapState({
      recipes: state => state.recipes.recipes
    })
  },
  beforeMount() {
    if (this.recipes.items === null) {
      this.$store.dispatch('recipes/fetchRecipes')
    }
  }
}
</script>

<style lang="scss" scoped>
.recipes-page {
  &__header {
    margin-bottom: 16px;
  }
}
</style>
