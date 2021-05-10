<template>
  <AnonymousPage>
    <div class="privacy-policy" v-html="PRIVACY_POLICY_HTML" />
  </AnonymousPage>
</template>

<script>
import AnonymousPage from '@/layouts/AnonymousPage'
import PRIVACY_POLICY_HTML from 'html-loader!@/assets/docs/privacypolicy/privacypolicy_v1.html'

export default {
  components: { AnonymousPage },
  setup() {
    return {
      PRIVACY_POLICY_HTML
    }
  }
}
</script>

<style lang="scss" scoped>
.privacy-policy {
  font-size: 0.875rem;
  line-height: 1.75;

  ul {
    list-style: initial;
    padding-left: 2rem;
    margin: 1rem 0;
  }

  li + li {
    margin-top: 1rem;
  }
}

.h1 {
  font-size: 1.25rem;
}

.h2 {
  font-size: 1rem;
  margin-top: 2rem;
}

.h3 {
  font-size: 0.875rem;
  margin-top: 2rem;
}
</style>
