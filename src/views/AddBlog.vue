<template>
  <AnonymousPage classes="add-blog">
    <template #header>
      <AddBlogHeader />
    </template>
    <AddBlogMarkdown />
    <div>
      <div v-for="{ urls, size, height, width } in bannerList" :key="size" class="banner-group">
        <span class="banner-size">{{ size }}</span>
        <AddBlogBanner v-for="url in urls" :key="url" class="banner-item" :url="url" :height="height" :width="width" />
      </div>
    </div>
  </AnonymousPage>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

import { BASE_URL } from '@/configs/url'

import AnonymousPage from '@/layouts/AnonymousPage.vue'

import AddBlogMarkdown from '@/markdowns/addblog/addblog.md'

import { ADD_BLOG } from '@/router/paths'

import AddBlogBanner from '@/components/AddBlogBanner.vue'
import AddBlogHeader from '@/components/landingPage/AddBlogHeader.vue'

export default defineComponent({
  components: { AnonymousPage, AddBlogMarkdown, AddBlogHeader, AddBlogBanner },

  setup() {
    useMeta({
      title: 'Dodaj przepisy',
      link: [{ rel: 'canonical', href: `${BASE_URL}${ADD_BLOG}` }]
    })

    const bannerList = [
      {
        size: '128x48px',
        width: '128px',
        height: '48px',
        urls: ['/banner/128x48/banner_bialy.png', '/banner/128x48/banner_czarny.png', '/banner/128x48/banner_zielony.png']
      },
      {
        size: '256x96px',
        width: '256px',
        height: '96px',
        urls: ['/banner/256x96/banner_bialy.png', '/banner/256x96/banner_czarny.png', '/banner/256x96/banner_zielony.png']
      }
    ]

    return {
      bannerList
    }
  }
})
</script>

<style lang="scss" scoped>
.add-blog {
  .banner-item {
    margin-top: 12px;
  }

  .banner-item + .banner-item {
    margin-top: 24px;
  }

  .banner-group + .banner-group {
    margin-top: 24px;
  }

  .banner-size {
    font-size: 0.875rem;
    font-weight: 600;
  }
}
</style>
