<template>
  <global-sheet-modal-container />
  <toasts-container />

  <transition name="page-component-fade" mode="out-in">
    <AppLoading v-if="fetchedInitialUserProfile && routeLoading === true" class="route-loader" />
  </transition>

  <transition name="page-component-fade" mode="out-in">
    <router-view key="loaded-app" v-if="fetchedInitialUserProfile" v-slot="{ Component }">
      <transition name="page-component-fade" mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>
    <AppLoading key="loading-app" v-else />
  </transition>
</template>

<script>
import AnalyticsService from '@/services/analytics'
import AppLoading from '@/components/AppLoading'
import { mapState } from 'vuex'

export default {
  components: {
    AppLoading
  },
  data: () => ({
    fetchedInitialUserProfile: false
  }),
  computed: {
    ...mapState({
      routeLoading: store => store.user.routeLoading
    })
  },
  beforeCreate() {
    const currentTheme = localStorage.getItem('theme')
    document.documentElement.setAttribute('theme', currentTheme || 'system')
  },
  created() {
    this.$store
      .dispatch('user/fetchUserProfile', { getInitUserData: true })
      .then(() => {
        if (!location.pathname.startsWith('/app')) {
          this.$router.push({ name: 'home' })
        }
      })
      .catch(() => {
        if (location.pathname.startsWith('/app')) {
          this.$router.push({ name: 'login' })
        } else if (!location.pathname.startsWith('/auth')) {
          this.$router.push({ name: 'landing-page' })
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
  opacity: 0.85;
  // background: var(--color-background);
  z-index: 1111111;
}
</style>
