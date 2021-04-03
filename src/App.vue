<template>
  <global-sheet-modal-container />
  <toasts-container />
  <div class="layout">
    <dashboard v-if="isAuthenticated !== undefined" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Dashboard from './views/Dashboard'
import AnalyticsService from '@/services/analytics'

export default {
  components: { Dashboard },
  computed: {
    ...mapGetters({
      isAuthenticated: 'user/isAuthenticated'
    })
  },
  methods: {
    blurOnClick() {
      document.activeElement.blur()
    }
  },
  beforeCreate() {
    const currentTheme = localStorage.getItem('theme')
    if (currentTheme) {
      document.documentElement.setAttribute('theme', currentTheme)
    }
  },
  created() {
    this.$store.dispatch('user/fetchUserProfile', { getInitUserData: true })
    AnalyticsService.init()
  },
  mounted() {
    // document.addEventListener('click', this.blurOnClick)
  },
  beforeUnmount() {
    // document.removeEventListener('click', this.blurOnClick)
  }
}
</script>

<style lang="scss">
@import './styles/rendered';

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
