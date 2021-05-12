<template>
  <AnonymousPageHeader />
  <div class="page-container">
    <slot />
    <Footer class="footer" />
  </div>
</template>

<script>
import AnonymousPageHeader from '@/components/anonymous/AnonymousPageHeader'
import Footer from '@/components/landingPage/Footer'

export default {
  components: { AnonymousPageHeader, Footer }
}
</script>

<style lang="scss" scoped>
.page-container {
  max-width: 960px;
  width: 100%;
  padding: 2rem;
  padding-top: 0;
  margin: 0 auto;
}

.footer {
  margin-top: 48px;
}
</style>
