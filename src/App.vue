<template>
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
  <RefreshPWA />
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, reactive, toRefs, watchEffect, WatchStopHandle } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute, useRouter } from 'vue-router'

import { THEME_DARK_COLOR, THEME_HTML_ATTRIBUTE, THEME_LIGHT_COLOR } from '@/configs/theme'

import { ExactThemes } from '@/constants/themes'

import Modal from '@/plugins/global-sheet-modal/Modal.vue'

import { APP_HOME, APP_ROUTE_NAMES, AUTH_LOGIN, LOGGED_USER_ALLOWED_ROUTE_NAMES } from '@/router/names'

import GDPRService from '@/services/gdpr'

import { useUserStore } from '@/stores/user'

import { ExactTheme } from '@/typings/theme'

import AppLoading from '@/components/AppLoading.vue'
import RefreshPWA from '@/components/messages/RefreshPWA.vue'
import CookiesModal from '@/components/modals/CookiesModal.vue'

const TITLE_TEMPLATE = 'Recipeit - Znajdź przepis ze swoich produktów'
const TITLE_SMALL_TEMPLATE = 'Recipeit'

export default defineComponent({
  components: {
    AppLoading,
    RefreshPWA,
    CookiesModal,
    Modal
  },

  setup() {
    // usings
    const userStore = useUserStore()
    const route = useRoute()
    const router = useRouter()

    // others
    userStore.initTheme()
    GDPRService.init()

    // data
    const data = reactive({
      showGDPRModal: false,
      fetchedInitialUserProfile: false
    })

    // computed
    const allowedGDPRModalRoute = computed(() => !route.meta?.hideCookiesModal)

    const exactTheme = computed<ExactTheme>(() => {
      if (ExactThemes.find(validTheme => validTheme === userStore.theme)) {
        return userStore.theme as ExactTheme
      }

      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    })

    const themeColor = computed(() => {
      return exactTheme.value === 'light' ? THEME_LIGHT_COLOR : THEME_DARK_COLOR
    })

    // lifecycle hooks
    onBeforeMount(() => {
      if (GDPRService.showGDPRModal()) {
        data.showGDPRModal = true
      }
    })

    // watch
    watchEffect(() => {
      const themeMeta: HTMLMetaElement = document.querySelector('meta[name=theme-color]')

      if (themeMeta) {
        themeMeta.content = themeColor.value
      }
    })

    // others
    useMeta(
      computed(() => ({
        title: '',
        htmlAttrs: {
          [THEME_HTML_ATTRIBUTE]: userStore.theme
        }
      }))
    )

    const initRoute = async () => {
      let userFetchSuccess = false

      try {
        await userStore.fetchUserProfile({ fetchInitUserData: true })
        userFetchSuccess = true
      } catch {
        userFetchSuccess = false
      }

      let stopped = false
      let stop: WatchStopHandle

      stop = watchEffect(async () => {
        if (stopped) {
          stop?.()
          return
        }

        const routeName = route.name?.toString()

        if (routeName) {
          stop?.()
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
      // consts
      TITLE_TEMPLATE,
      TITLE_SMALL_TEMPLATE,
      // data
      ...toRefs(data),
      // computed
      allowedGDPRModalRoute
    }
  }
})
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
