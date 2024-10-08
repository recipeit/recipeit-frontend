<template>
  <div class="layout__page__content blog-recipes">
    <div v-if="errors" class="error-page">
      <img class="error-image" src="@/assets/img/broccoli-sad.svg" alt="" />
      <span class="error-text"> Ojjj... nie znaleźliśmy takiego blogu </span>
      <router-link v-slot="{ href, navigate }" :to="{ name: APP_HOME }" custom>
        <BaseButton tag="a" :href="href" class="recipe-button" stroked @click="navigate($event)"> Wróć na stronę główną </BaseButton>
      </router-link>
    </div>
    <template v-else>
      <div class="header">
        <div class="header-container">
          <div class="header-buttons">
            <BaseLink class="header-button" tag="button" @click="$router.go(-1)">
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
            <BaseImageLazyload class="header-avatar" :src="avatarUrl" :error-placeholder="avatarErrorUrl" alt="" />
          </div>
        </div>
        <RecipeParallaxImage class="header-background-container">
          <BaseImageLazyload class="header-background" :src="backgroundUrl" :error-placeholder="backgroundErrorUrl" />
        </RecipeParallaxImage>
      </div>

      <BaseLink v-if="isHidden" tag="button" class="hidden-bar" color="red" @click="showInvisibleInfoModal()">
        <BaseIcon class="hidden-bar-icon" icon="eye-hidden" weight="semi-bold" />
        Ten blog jest ukryty
      </BaseLink>

      <BlogDetails v-if="blogDetails" :blog="blogDetails" class="blog-details-row" />
      <div v-else>...wczytuję</div>

      <GenericRecipesList
        :recipes="recipesList.recipes.value"
        :errors="recipesList.recipesErrors.value"
        :show-filter-buttons="false"
        :load-handler="pageNumber => recipesList.loadRecipesPage(pageNumber)"
        @reload="recipesList.reloadRecipes()"
        @reload-with-query="recipesList.reloadRecipes()"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, markRaw, onBeforeMount, ref } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'

import blogApi from '@/api/blogApi'

import avatarErrorUrl from '@/assets/img/blog-avatar.webp'
import backgroundErrorUrl from '@/assets/img/blog-bg.webp'

import { useClipboard } from '@/plugins/clipboard'
import { useModal } from '@/plugins/global-sheet-modal'
import { useToast } from '@/plugins/toast'

import { APP_HOME } from '@/router/names'

import { useUserStore } from '@/stores/user'

import recipePagedList from '@/views/app/composable/recipePagedList'

import BlogDetails from '@/components/BlogDetails.vue'
import GenericRecipesList from '@/components/GenericRecipesList.vue'
import RecipeParallaxImage from '@/components/RecipeParallaxImage.vue'
import InvisibleBlogInfoModal from '@/components/modals/InvisibleBlogInfoModal.vue'

export default defineComponent({
  name: 'BlogRecipes',

  components: {
    RecipeParallaxImage,
    GenericRecipesList,
    BlogDetails
  },

  props: {
    blogId: {
      type: String,
      required: true
    },
    blogName: {
      type: String
    }
  },

  setup(props) {
    // usings
    const userStore = useUserStore()
    const modal = useModal()
    const toast = useToast()
    const clipboard = useClipboard()
    const route = useRoute()

    // composables
    const recipesList = recipePagedList(queryParams => blogApi.getBlogRecipes(props.blogId, queryParams))

    // data
    const blogDetails = ref(null)
    const errors = ref(false)

    // computed
    const backgroundUrl = computed(() => {
      const { id } = blogDetails.value || {}
      if (id) {
        return `/static/blogs/${id}/background.webp`
      }
      return null
    })

    const avatarUrl = computed(() => {
      const { id } = blogDetails.value || {}
      if (id) {
        return `/static/blogs/${id}/avatar.webp`
      }
      return null
    })

    const isHidden = computed(() => {
      if (blogDetails.value) {
        return userStore.isBlogHidden(blogDetails.value.id)
      }
      return false
    })

    // methods
    const changeBlogVisibility = visible => {
      if (blogDetails.value) {
        userStore.changeBlogVisibility({ blogId: blogDetails.value.id, visible })
      }
    }

    const showInvisibleInfoModal = () => {
      modal.show(markRaw(InvisibleBlogInfoModal), {}, {})
    }

    const copyLinkToClipboard = () => {
      const url = window.location.origin + route.path

      if (!url) {
        toast.show('Nie udało się skopiować do schowka', 'error')
      } else if (clipboard(url)) {
        toast.show('Skopiowano do schowka', 'success')
      } else {
        toast.show('Nie udało się skopiować do schowka', 'error')
      }
    }

    // lifecycle hooks
    onBeforeMount(() => {
      blogApi
        .getBlogDetails(props.blogId)
        .then(({ data }) => {
          blogDetails.value = data
        })
        .catch(() => {
          errors.value = true
        })
    })

    // others
    useMeta(
      computed(() => {
        const title = blogDetails.value?.name || props.blogName
        return title ? { title } : {}
      })
    )

    return {
      // consts
      APP_HOME,
      avatarErrorUrl,
      backgroundErrorUrl,
      // composables
      recipesList,
      // data
      blogDetails,
      errors,
      // computed
      backgroundUrl,
      avatarUrl,
      isHidden,
      // methods
      changeBlogVisibility,
      showInvisibleInfoModal,
      copyLinkToClipboard
    }
  }
})
</script>

<style lang="scss" scoped>
.blog-recipes {
  display: flex;
  flex-direction: column;

  .error-page {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;

    .error-image {
      width: 96px;
    }

    .error-text {
      margin-top: 16px;
    }

    .recipe-button {
      margin-top: 16px;
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
      z-index: 2;
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

    &-background-container {
      position: relative;
      height: 196px;
      width: 100%;
      background-color: var(--color-image-background);

      @media (min-width: 721px) {
        border-radius: 32px;
        margin-bottom: 40px;
      }
    }

    &-background {
      height: 100%;
      width: 100%;

      :deep(img) {
        height: 100%;
        width: 100%;
        object-fit: cover;
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
      border: 4px solid var(--color-background);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);

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
      height: 100%;
      width: 100%;

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
    margin-left: auto;
    margin-right: auto;
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
}
</style>
