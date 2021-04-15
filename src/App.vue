<template>
  <router-view v-if="fetchedInitialUserProfile" />
  <AppLoading v-else />
  <vue-progress-bar />
  <global-sheet-modal-container />
  <toasts-container />
</template>

<script>
import AnalyticsService from '@/services/analytics'
import AppLoading from '@/components/AppLoading'

export default {
  components: {
    AppLoading
  },
  data: () => ({
    fetchedInitialUserProfile: false
  }),
  beforeCreate() {
    const currentTheme = localStorage.getItem('theme')
    document.documentElement.setAttribute('theme', currentTheme || 'system')
  },
  created() {
    this.$store
      .dispatch('user/fetchUserProfile', { getInitUserData: true })
      .then(async () => {
        if (
          !location.pathname.startsWith('/app') &&
          !location.pathname.startsWith('/terms') &&
          !location.pathname.startsWith('/privacy-policy')
        ) {
          await this.$router.replace({ name: 'home' })
        }
      })
      .catch(async () => {
        if (location.pathname.startsWith('/app')) {
          await this.$router.replace({ name: 'login' })
        }
      })
      .finally(() => {
        this.fetchedInitialUserProfile = true
      })
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

.route-loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 10%;
  height: 3px;
  background: var(--color-primary);
  z-index: 1111111;
  animation: routeLoader 2s 1 linear;
  @include transition(all);
}

@keyframes routeLoader {
  0% {
    right: 100%;
  }
  100% {
    right: 10%;
  }
}
</style>
