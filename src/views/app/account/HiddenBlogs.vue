<template>
  <div class="layout__page__content hidden-blogs">
    <PageHeader title="Ukryte blogi" :back-button="true" />
    <div v-if="hiddenBlogs === null">
      ...wczytuje
    </div>
    <ul v-else-if="hiddenBlogs.length > 0" class="blogs-list">
      <li v-for="blog in hiddenBlogs" :key="blog.id" class="blogs-list-item">
        <HiddenBlog :blog="blog" @unhide="unhideBlog(blog.id)" />
      </li>
    </ul>
    <div v-else>
      Nie ukryłeś jeszcze żadnego blogu
    </div>
  </div>
</template>

<script>
import { onBeforeMount, ref } from 'vue'
import { useMeta } from 'vue-meta'

import userApi from '@/api/userApi'

import { useUserStore } from '@/stores/user'

import HiddenBlog from '@/components/HiddenBlog.vue'
import PageHeader from '@/components/PageHeader.vue'

export default {
  components: {
    PageHeader,
    HiddenBlog
  },
  setup() {
    useMeta({
      title: 'Ukryte blogi'
    })

    // usings
    const userStore = useUserStore()

    // data
    const hiddenBlogs = ref(null)

    // methods
    const unhideBlog = id => {
      userStore.changeBlogVisibility({ blogId: id, visible: true }).then(() => {
        const index = hiddenBlogs.value.findIndex(v => v.id === id)
        hiddenBlogs.value.splice(index, 1)
      })
    }

    // lifecycle hooks
    onBeforeMount(() => {
      userApi.getHiddenBlogs().then(({ data }) => {
        hiddenBlogs.value = data.blogs || []
      })
    })

    return {
      // data
      hiddenBlogs,
      // methods
      unhideBlog
    }
  }
}
</script>

<style lang="scss" scoped>
.hidden-blogs {
  .blogs-list-item + .blogs-list-item {
    margin-top: 1rem;
  }
}
</style>
