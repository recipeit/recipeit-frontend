<template>
  <AnonymousPageHeader />
  <slot name="header" />
  <div class="page-container" :class="classes">
    <slot />
    <Footer class="footer" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import AnonymousPageHeader from '@/components/anonymous/AnonymousPageHeader.vue'
import Footer from '@/components/landingPage/Footer.vue'

export default defineComponent({
  components: { AnonymousPageHeader, Footer },

  props: {
    classes: {
      type: String,
      default: ''
    }
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  max-width: 960px;
  width: 100%;
  padding: 2rem;
  padding-top: 0;
  margin: 0 auto;

  .footer {
    margin-top: 48px;
  }
}
</style>
