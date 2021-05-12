<template>
  <router-view v-if="fetchedInitialUserProfile" />
  <AppLoading v-else />
  <vue-progress-bar />
  <Modal v-if="showGDPRModal && allowedGDPRModalRoute" :opened="showGDPRModal">
    <CookiesModal @close="showGDPRModal = false" />
  </Modal>
  <global-sheet-modal-container />
  <toasts-container />
  <MessageContainer>
    <UpdateMessage v-if="update.updateExists.value" @update="update.refreshApp()" />
  </MessageContainer>
</template>

<script>
import GDPRService from '@/services/gdpr'
import AppLoading from '@/components/AppLoading'
import MessageContainer from '@/components/MessageContainer'
import UpdateMessage from '@/components/messages/UpdateMessage'
import updateSW from './composables/update'
import { computed, onBeforeMount, reactive, toRefs } from '@vue/runtime-core'
import CookiesModal from './components/modals/CookiesModal'
import Modal from './plugins/global-sheet-modal/Modal.vue'
import { useRoute } from 'vue-router'
import { APP_HOME, AUTH_LOGIN } from './router/names'

export default {
  components: {
    AppLoading,
    MessageContainer,
    UpdateMessage,
    CookiesModal,
    Modal
  },
  setup() {
    const route = useRoute()
    const update = updateSW()
    const data = reactive({
      showGDPRModal: false
    })

    const allowedGDPRModalRoute = computed(() => !route.meta?.hideCookiesModal)

    GDPRService.init()

    onBeforeMount(() => {
      if (GDPRService.showGDPRModal()) {
        data.showGDPRModal = true
      }
    })

    return {
      ...toRefs(data),
      allowedGDPRModalRoute,
      update
    }
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
          await this.$router.replace({ name: APP_HOME })
        }
      })
      .catch(async () => {
        if (location.pathname.startsWith('/app')) {
          await this.$router.replace({ name: AUTH_LOGIN })
        }
      })
      .finally(() => {
        this.fetchedInitialUserProfile = true
      })
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
