<template>
  <global-sheet-modal-container />
  <div class="layout">
    <div class="layout__page">
      <router-view v-slot="slotProps">
        <transition name="page-component-fade" mode="out-in">
          <component :is="slotProps.Component"></component>
        </transition>
      </router-view>
    </div>
    <NavigationBar />
  </div>
</template>

<script>
import NavigationBar from '@/components/NavigationBar'

export default {
  components: {
    NavigationBar
  },
  created() {
    this.$store.dispatch('recipes/fetchFavouriteRecipesIds')
  }
}
</script>

<style lang="scss">
.layout {
  max-width: 460px;
  box-sizing: border-box;
  margin: 0 auto;
  background: $background;
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

    &__content {
      flex: 1;
    }
  }
}

.page-component-fade-enter-active,
.page-component-fade-leave-active {
  transition: all 0.2s ease;
}
.page-component-fade-enter-from,
.page-component-fade-leave-to {
  opacity: 0;
}
.page-component-fade-enter-from {
  // transform: translateX(8px);
}
.page-component-fade-leave-to {
  // transform: translateX(-8px);
}
</style>
