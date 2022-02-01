<template>
  <div class="logo" v-html="Logo" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import Logo from '@/assets/themed-logo.svg?raw'

export default defineComponent({
  setup() {
    return {
      Logo
    }
  }
})
</script>

<style lang="scss" scoped>
.logo {
  ::v-deep(svg) {
    height: 100%;
    width: 100%;
  }
}
</style>
