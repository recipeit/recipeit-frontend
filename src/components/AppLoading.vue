<template>
  <div class="app-loading">
    <div class="logo" v-html="logo" />
    <Spinner :show="true" color="primary" />
  </div>
</template>

<script>
import logo from '@/assets/logo.svg?inline'

import Spinner from '@/components/Spinner'

export default {
  components: {
    Spinner
  },
  data: () => ({
    logo
  })
}
</script>

<style lang="scss" scoped>
.app-loading {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  .logo {
    width: 64px;
    color: var(--color-primary);

    ::v-deep(svg) .a {
      fill: currentColor;
    }
  }

  ::v-deep(.spinner-container) {
    margin-top: 2rem;
    font-size: 0.75rem;
    width: 2em;
  }
}
</style>
