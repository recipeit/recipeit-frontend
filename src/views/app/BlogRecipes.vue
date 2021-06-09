<template>
  <div class="layout__page__content">
    <div class="header">
      <div class="header-container">
        <div class="header-buttons">
          <BaseLink class="header-button" @click="$router.go(-1)" tag="button">
            <BaseIcon icon="arrow-right" weight="regular" />
          </BaseLink>
          <BaseMenu>
            <template #toggle>
              <BaseLink class="header-button" tag="button">
                <BaseIcon icon="dots-horizontal" weight="regular" />
              </BaseLink>
            </template>
            <template #dropdown>
              <BaseMenuList>
                <BaseMenuLink v-if="!isHidden" @click="changeBlogVisibility(false)">Ukryj ten blog</BaseMenuLink>
                <BaseMenuLink v-else @click="changeBlogVisibility(true)">Pokazuj ten blog</BaseMenuLink>

                <BaseMenuSeparator />

                <BaseMenuLink @click="copyLinkToClipboard()">Skopiuj link do blogu</BaseMenuLink>
              </BaseMenuList>
            </template>
          </BaseMenu>
        </div>
        <div class="header-avatar-container">
          <BaseIcon v-if="blogDetails && !blogDetails.imageUrl" class="no-avatar-icon" icon="user" weight="semi-bold" />
          <BaseImageLazyload v-else class="header-avatar" :src="blogDetails?.imageUrl" alt="" />
        </div>
      </div>
      <RecipeParallaxImage class="header-image">
        <BaseImageLazyload :src="blogBgUrl" />
      </RecipeParallaxImage>
    </div>

    <BaseLink tag="button" class="hidden-bar" v-if="isHidden" color="red" @click="showInvisibleInfoModal()">
      <BaseIcon class="hidden-bar-icon" icon="eye-hidden" weight="semi-bold" />
      Ten blog jest ukryty
    </BaseLink>

    <BlogDetails v-if="blogDetails" :blog="blogDetails" class="blog-details-row" />
    <div v-else>...wczytuję</div>

    <GenericRecipesList
      :recipes="recipesList.recipes.value"
      :errors="recipesList.recipesErrors.value"
      :showFilterButtons="false"
      @load-next="recipesList.loadNextRecipes($event)"
      @reload="recipesList.reloadRecipes()"
      @reload-with-query="recipesList.reloadRecipes()"
    />
  </div>
</template>

<script>
import { computed, markRaw, onBeforeMount, ref } from 'vue'
import { mapGetters } from 'vuex'
import blogApi from '@/api/blogApi'
import RecipeParallaxImage from '@/components/RecipeParallaxImage'
import GenericRecipesList from '@/components/GenericRecipesList'
import BlogDetails from '@/components/BlogDetails'
import InvisibleBlogInfoModal from '@/components/modals/InvisibleBlogInfoModal'
import recipePagedList from './composable/recipePagedList'
import { useMeta } from 'vue-meta'
import blogBgUrl from '@/assets/img/blog-bg.webp'

export default {
  name: 'Recipes',
  props: {
    blogId: {
      type: String,
      required: true
    },
    blogName: {
      type: String
    }
  },
  components: {
    RecipeParallaxImage,
    GenericRecipesList,
    BlogDetails
  },
  setup(props) {
    const blogDetails = ref(null)
    const recipesList = recipePagedList(queryParams => blogApi.getBlogRecipes(props.blogId, queryParams))

    onBeforeMount(() => {
      blogApi.getBlogDetails(props.blogId).then(({ data }) => {
        blogDetails.value = data
      })
    })

    const computedMeta = computed(() => {
      const title = blogDetails.value?.name || props.blogName
      return title ? { title } : {}
    })

    useMeta(computedMeta)

    return {
      blogDetails,
      recipesList,
      blogBgUrl
    }
  },
  computed: {
    ...mapGetters({
      isBlogHiddenGetter: 'user/isBlogHidden'
    }),
    isHidden() {
      return this.isBlogHiddenGetter(this.blogId)
    }
  },
  methods: {
    changeBlogVisibility(visible) {
      this.$store.dispatch('user/changeBlogVisibility', { blogId: this.blogId, visible })
    },
    showInvisibleInfoModal() {
      this.$modal.show(markRaw(InvisibleBlogInfoModal), {}, {})
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

.header {
  display: flex;
  position: relative;
  margin: -32px -32px 16px -32px;

  @media (min-width: 721px) {
    margin-top: 0;
    margin-left: 0;
    margin-right: 0;
  }

  &::before {
    content: '';
    z-index: 1;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    min-height: 32px;
    border-radius: 32px 32px 0 0;
    background-color: var(--color-background);

    @media (min-width: 721px) {
      content: none;
    }
  }

  &-buttons {
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    padding: 32px;
  }

  &-button {
    position: relative;
    font-size: 1.5rem;
    padding: 0.5rem;
    // background: rgba(#fff, 0.75);
    // background-color: rgba(#222, 0.75);
    background-color: rgba(var(--color-background-rgb), 0.95);
    color: var(--color-text-primary);
    // backdrop-filter: blur(8px);
    border-radius: 50px;
    line-height: 0;
    transform: rotate(180deg); // TODO arrow ikonki
  }

  &-image {
    position: relative;
    height: 196px;

    @media (min-width: 721px) {
      border-radius: 32px;
      margin-bottom: 40px;
    }

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--color-background);
      opacity: 0.5;
    }
  }

  &-avatar-container {
    z-index: 1;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 80px;
    overflow: hidden;
    background-color: var(--color-image-background);
    height: 80px;
    width: 80px;

    .no-avatar-icon {
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      color: var(--color-text-secondary);
    }
  }

  &-avatar {
    :deep(.image) {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
}

.hidden-bar {
  font-size: 0.875rem;
  font-weight: bold;
  // text-transform: uppercase;
  padding: 0.5rem 0;
  line-height: 1rem;
  display: flex;
  align-items: center;

  &-icon {
    font-size: 1rem;
    line-height: inherit;
    margin-right: 0.75rem;
  }
}
</style>
