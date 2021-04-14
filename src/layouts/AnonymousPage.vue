<template>
  <AnonymousPageHeader />
  <div class="page-container">
    <slot />
  </div>
</template>

<script>
import AnonymousPageHeader from '@/components/anonymous/AnonymousPageHeader'

export default {
  components: { AnonymousPageHeader }
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
</style>
