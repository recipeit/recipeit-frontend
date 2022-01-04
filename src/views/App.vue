<template>
  <div class="layout">
    <div class="layout__page">
      <router-view v-slot="{ Component }">
        <transition name="page-component-fade" mode="out-in" @after-leave="eventHub.$emit('triggerScroll')">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <NavigationBar class="layout__navigation" />
  </div>
</template>

<script>
import eventHub from '@/services/eventHub'

import NavigationBar from '@/components/NavigationBar.vue'

export default {
  components: {
    NavigationBar
  },
  setup() {
    return {
      eventHub
    }
  }
}
</script>

<style lang="scss">
.layout {
  max-width: 460px;
  box-sizing: border-box;
  margin: 0 auto;
  background: var(--color-background);
  min-height: 100%;
  // box-shadow: 0 0 64px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;

  &__page {
    padding: 32px 32px 84px 32px;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;

    &__content {
      flex: 1;
    }
  }

  @media (min-width: 721px) {
    flex-direction: row-reverse;
    width: 960px;
    max-width: 100%;

    &__navigation {
      width: 25%;
    }
    &__page {
      padding-top: 48px;
      padding-bottom: 48px;
    }
  }
}
</style>
