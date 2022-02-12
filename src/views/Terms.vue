<template>
  <AnonymousPage>
    <TermsMarkdown />
  </AnonymousPage>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

import { BASE_URL } from '@/configs/url'

import AnonymousPage from '@/layouts/AnonymousPage.vue'

import TermsMarkdown from '@/markdowns/terms/terms_v1.md'

import { TERMS } from '@/router/paths'

export default defineComponent({
  components: { AnonymousPage, TermsMarkdown },

  setup() {
    useMeta({
      title: 'Regulamin',
      link: [{ rel: 'canonical', href: `${BASE_URL}${TERMS}` }]
    })
  }
})
</script>
