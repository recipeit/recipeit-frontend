<template>
  <global-sheet-modal-container />
  <toasts-container />
  <router-view />
</template>

<script>
import AnalyticsService from '@/services/analytics'

export default {
  beforeCreate() {
    const currentTheme = localStorage.getItem('theme')
    document.documentElement.setAttribute('theme', currentTheme || 'system')
  },
  created() {
    this.$store.dispatch('user/fetchUserProfile', { getInitUserData: true })
    AnalyticsService.init()
  }
}
</script>

<style lang="scss">
@import './styles/rendered';

.page-component-fade-enter-active,
.page-component-fade-leave-active {
  transition: all 0.2s ease;
}
.page-component-fade-enter-from,
.page-component-fade-leave-to {
  opacity: 0;
}
</style>
