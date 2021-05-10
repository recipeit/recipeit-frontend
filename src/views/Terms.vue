<template>
  <AnonymousPage>
    <div class="terms" v-html="TERMS_HTML" />
  </AnonymousPage>
</template>

<script>
import AnonymousPage from '@/layouts/AnonymousPage'
import TERMS_HTML from 'html-loader!@/assets/docs/terms/terms_v1.html'

export default {
  components: { AnonymousPage },
  setup() {
    return {
      TERMS_HTML
    }
  }
}
</script>

<style lang="scss" scoped>
.terms {
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
