<template>
  <header class="page-header">
    <div class="page-header__content">
      <BaseLink v-if="backButton" class="page-header__back-icon" color="text-primary" @click="$router.go(-1)">
        <BaseIcon icon="arrow-left" weight="semi-bold" />
      </BaseLink>

      <div class="page-header__title-container">
        <slot name="title">
          <h1>{{ title }}</h1>
        </slot>
      </div>

      <PageHeaderUser v-if="showUser" />
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import PageHeaderUser from '@/components/PageHeaderUser.vue'

export default defineComponent({
  components: { PageHeaderUser },

  props: {
    backButton: {
      type: Boolean,
      default: false
    },
    showUser: {
      type: Boolean,
      default: true
    },
    title: String
  }
})
</script>

<style lang="scss" scoped>
.page-header {
  position: relative;
  margin-bottom: 24px;
  min-height: $header-height;

  &__content {
    display: flex;
    gap: 12px;
  }

  &__title-container {
    flex: 1;
    min-height: $header-height;
    display: flex;
    align-items: center;
  }

  h1 {
    margin: 0;
    font-size: 1.25rem;
  }

  &__back-icon {
    margin-left: math.div(-$header-height + 1.25rem, 2);
    width: $header-height;
    height: $header-height;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    cursor: pointer;
  }
}
</style>
