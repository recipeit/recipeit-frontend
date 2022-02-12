<template>
  <AnonymousPage>
    <PrivacyPolicyMarkdown />
  </AnonymousPage>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useMeta } from 'vue-meta'

import { BASE_URL } from '@/configs/url'

import AnonymousPage from '@/layouts/AnonymousPage.vue'

import PrivacyPolicyMarkdown from '@/markdowns/privacypolicy/privacypolicy_v1.md'

import { PRIVACY_POLICY } from '@/router/paths'

export default defineComponent({
  components: { AnonymousPage, PrivacyPolicyMarkdown },

  setup() {
    useMeta({
      title: 'Polityka Prywatności',
      link: [{ rel: 'canonical', href: `${BASE_URL}${PRIVACY_POLICY}` }]
    })
  }
})
</script>
