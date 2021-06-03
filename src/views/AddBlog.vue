<template>
  <AnonymousPage>
    <div class="add-blog" v-html="ADD_BLOG_HTML" />
  </AnonymousPage>
</template>

<script>
import { useMeta } from 'vue-meta'
import AnonymousPage from '@/layouts/AnonymousPage'
import ADD_BLOG_HTML from 'html-loader!@/assets/docs/addblog/addblog.html'

export default {
  components: { AnonymousPage },
  setup() {
    useMeta({
      title: 'Dodaj blog'
    })

    return {
      ADD_BLOG_HTML
    }
  }
}
</script>

<style lang="scss" scoped>
.add-blog {
  font-size: 0.75rem;
  line-height: 1.75;

  ::v-deep(h1) {
    font-size: 1.25rem;
  }

  ::v-deep(h2) {
    font-size: 1rem;
    margin: 1.5rem 0;
  }

  ::v-deep(h3) {
    font-size: 0.875rem;
    margin: 1.5rem 0;
  }

  ::v-deep(ol) {
    counter-reset: list;
  }

  ::v-deep(ol > li) {
    position: relative;
    list-style: none;
  }

  ::v-deep(ol > li::before) {
    position: absolute;
    left: -24px;
    content: counter(list, decimal) '. ';
    counter-increment: list;
    font-weight: bold;
  }

  ::v-deep(ul) {
    list-style: disc;
    padding-inline-start: 40px;
  }

  ::v-deep(ul > li) {
    margin: 0.75rem 0;
  }

  :deep(a) {
    text-decoration: none;
    font-weight: bold;
    color: var(--color-primary);
  }
}
</style>
