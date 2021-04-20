<template>
  <div class="layout__page__content">
    <PageHeader :showUser="false">
      <template #title>
        <BaseLink tag="button" @click="$router.go(-1)" class="back-button" color="text-secondary">
          <BaseIcon class="back-button-icon" icon="arrow-left" weight="semi-bold" />
          cofnij
        </BaseLink>
      </template>
    </PageHeader>

    <BlogDetails v-if="blogDetails" :blog="blogDetails" class="blog-details-row" />
    <div v-else>...wczytuję</div>

    <GenericRecipesList
      :recipes="recipes"
      :showFilterButtons="false"
      @load-next="loadNextRecipes($event)"
      @reload="reloadRecipes($event)"
    />
  </div>
</template>

<script>
import blogApi from '@/api/blogApi'
import { fetchRecipesQueryParams, RecipeList } from '@/constants'
import GenericRecipesList from '@/components/GenericRecipesList'
import BlogDetails from '@/components/BlogDetails'
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
    BlogDetails,
    PageHeader
  },
  data: () => ({
    recipes: new RecipeList(),
    blogDetails: null
  }),
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
      if (this.recipes.fetching) return
      this.recipes.fetching = true

      const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

      blogApi
        .getBlogRecipes(this.blogId, {
          ...queryParams,
          pageNumber: this.recipes.pagesTo + 1
        })
        .then(resp => {
          this.recipes.addFromApi(resp.data)
        })
    },
    fetchRecipes(orderMethod, filters, search) {
      if (this.recipes.fetching) return
      this.recipes = new RecipeList()
      this.recipes.fetching = true

      const queryParams = fetchRecipesQueryParams(orderMethod, filters, search)

      blogApi.getBlogRecipes(this.blogId, queryParams).then(resp => {
        this.recipes.setFromApi(resp.data)
      })
    }
  },
  beforeMount() {
    this.fetchRecipes()
    blogApi.getBlogDetails(this.blogId).then(({ data }) => {
      this.blogDetails = data
    })
  }
}
</script>

<style lang="scss" scoped>
.recipes-page {
  &__header {
    margin-bottom: 16px;
  }
}

.back-button {
  font-weight: bold;
  font-size: 0.75rem;
  display: flex;

  &-icon {
    font-size: 1rem;
    margin-right: 0.5rem;
  }
}

.blog-details-row {
  margin-bottom: 24px;
}
</style>
