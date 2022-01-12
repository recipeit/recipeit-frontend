<template>
  <AnonymousPage class="add-blog">
    <template #header>
      <AddBlogHeader />
    </template>
    <div class="add-blog-content" v-html="ADD_BLOG_HTML" />
    <div>
      <div v-for="{ urls, size, height, width } in bannerList" :key="size" class="banner-group">
        <span class="banner-size">{{ size }}</span>
        <AddBlogBanner v-for="url in urls" :key="url" class="banner-item" :url="url" :height="height" :width="width" />
      </div>
    </div>
  </AnonymousPage>
</template>

<script>
import { useMeta } from 'vue-meta'

import ADD_BLOG_HTML from '@/assets/docs/addblog/addblog.html?raw'

import { BASE_URL } from '@/configs/url'

import AnonymousPage from '@/layouts/AnonymousPage.vue'

import { ADD_BLOG } from '@/router/paths'

import AddBlogBanner from '@/components/AddBlogBanner.vue'
import AddBlogHeader from '@/components/landingPage/AddBlogHeader.vue'

export default {
  components: { AnonymousPage, AddBlogHeader, AddBlogBanner },
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
      ADD_BLOG_HTML,
      bannerList
    }
  }
}
</script>

<style lang="scss" scoped>
.add-blog {
  .add-blog-content {
    font-size: 0.75rem;
    line-height: 1.75;

    :deep(h1) {
      font-size: 1.25rem;
    }

    :deep(h2) {
      font-size: 1rem;
      margin: 1.5rem 0;
    }

    :deep(h3) {
      font-size: 0.875rem;
      margin: 1.5rem 0;
    }

    :deep(ol) {
      counter-reset: list;
    }

    :deep(ol > li) {
      position: relative;
      list-style: none;
    }

    :deep(ol > li::before) {
      position: absolute;
      left: -24px;
      content: counter(list, decimal) '. ';
      counter-increment: list;
      font-weight: bold;
    }

    :deep(ul) {
      list-style: disc;
      padding-inline-start: 40px;
    }

    :deep(ul > li) {
      margin: 0.75rem 0;
    }

    :deep(a) {
      text-decoration: none;
      font-weight: bold;
      color: var(--color-primary);
    }
  }

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
