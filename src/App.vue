<template>
  HAU 2
  <UpdateMessage />
  <metainfo>
    <template #title="{ content }">{{ content ? `${content} - ${TITLE_SMALL_TEMPLATE}` : TITLE_TEMPLATE }}</template>
  </metainfo>
  <router-view v-if="fetchedInitialUserProfile" />
  <AppLoading v-else />
  <vue-progress-bar />
  <Modal v-if="showGDPRModal && allowedGDPRModalRoute" :opened="showGDPRModal">
    <CookiesModal @close="showGDPRModal = false" />
  </Modal>
  <global-sheet-modal-container />
  <toasts-container />
  <!-- <MessageContainer>
    <UpdateMessage v-if="update.updateExists.value" @update="update.refreshApp()" />
  </MessageContainer> -->
</template>

<script>
import { computed, onBeforeMount, reactive, toRefs, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useMeta } from 'vue-meta'
import { useRoute, useRouter } from 'vue-router'

// import updateSW from '@/composables/update'

import { EXACT_THEMES, THEME_DARK, THEME_DARK_COLOR, THEME_HTML_ATTRIBUTE, THEME_LIGHT, THEME_LIGHT_COLOR } from '@/configs/theme'

import Modal from '@/plugins/global-sheet-modal/Modal.vue'

import { APP_HOME, APP_ROUTE_NAMES, AUTH_LOGIN, LOGGED_USER_ALLOWED_ROUTE_NAMES } from '@/router/names'

import GDPRService from '@/services/gdpr'

import AppLoading from '@/components/AppLoading.vue'
// import MessageContainer from '@/components/MessageContainer.vue'
import UpdateMessage from '@/components/messages/UpdateMessage.vue'
import CookiesModal from '@/components/modals/CookiesModal.vue'

const TITLE_TEMPLATE = 'Recipeit - Znajdź przepis ze swoich produktów'
const TITLE_SMALL_TEMPLATE = 'Recipeit'

export default {
  components: {
    AppLoading,
    // MessageContainer,
    UpdateMessage,
    CookiesModal,
    Modal
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    // const update = updateSW()
    const data = reactive({
      showGDPRModal: false,
      fetchedInitialUserProfile: false
    })

    store.dispatch('user/initTheme')

    const allowedGDPRModalRoute = computed(() => !route.meta?.hideCookiesModal)

    GDPRService.init()

    onBeforeMount(() => {
      if (GDPRService.showGDPRModal()) {
        data.showGDPRModal = true
      }
    })

    const exactTheme = computed(() => {
      const { theme } = store.state.user

      if (EXACT_THEMES.includes(theme)) {
        return theme
      }

      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? THEME_DARK : THEME_LIGHT
    })

    const themeColor = computed(() => {
      return exactTheme.value === THEME_LIGHT ? THEME_LIGHT_COLOR : THEME_DARK_COLOR
    })

    watchEffect(() => {
      const themeMeta = document.querySelector('meta[name=theme-color]')

      if (themeMeta) {
        themeMeta.content = themeColor.value
      }
    })

    const computedMeta = computed(() => ({
      title: '',
      htmlAttrs: {
        [THEME_HTML_ATTRIBUTE]: store.state.user.theme
      }
    }))

    useMeta(computedMeta)

    const initRoute = async () => {
      let userFetchSuccess = false

      try {
        await store.dispatch('user/fetchUserProfile', { getInitUserData: true })
        userFetchSuccess = true
      } catch {
        userFetchSuccess = false
      }

      var stopped = false

      const stop = watchEffect(async () => {
        if (stopped) {
          if (typeof stop === 'function') {
            stop()
          }
          return
        }

        const routeName = route.name

        if (routeName) {
          if (typeof stop === 'function') {
            stop()
          }
          stopped = true

          if (userFetchSuccess) {
            if (!LOGGED_USER_ALLOWED_ROUTE_NAMES.includes(routeName)) {
              await router.replace({ name: APP_HOME })
            }
          } else {
            if (APP_ROUTE_NAMES.includes(routeName)) {
              await router.replace({ name: AUTH_LOGIN })
            }
          }
          data.fetchedInitialUserProfile = true
        }
      })
    }

    initRoute()

    return {
      ...toRefs(data),
      allowedGDPRModalRoute,
      // update,
      TITLE_TEMPLATE,
      TITLE_SMALL_TEMPLATE
    }
  }
  // data: () => ({
  //   fetchedInitialUserProfile: false
  // }),
  // async created() {
  //   try {
  //     await this.$store.dispatch('user/fetchUserProfile', { getInitUserData: true })
  //     if (!LOGGED_USER_ALLOWED_ROUTE_NAMES.includes(routeName)) {
  //       await this.$router.replace({ name: APP_HOME })
  //     }
  //   } catch {
  //     if (APP_ROUTE_NAMES.includes(routeName)) {
  //       await this.$router.replace({ name: AUTH_LOGIN })
  //     }
  //   } finally {
  //     this.fetchedInitialUserProfile = true
  //   }
  // }
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
