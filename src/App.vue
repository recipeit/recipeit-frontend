<template>
  <global-sheet-modal-container />
  <toasts-container />
  <router-view v-if="fetchedInitialUserProfile" />
  <div v-else>
    Recipeit wczytuję
    <Spinner :show="true" />
  </div>
</template>

<script>
import AnalyticsService from '@/services/analytics'
import Spinner from '@/components/Spinner'

export default {
  components: {
    Spinner
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
</style>
