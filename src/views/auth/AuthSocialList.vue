<template>
  <div class="social-list">
    <BaseButton class="social-button" stroked :disabled="anySending ? true : null" :loading="facebookSending" @click="loginFacebook()">
      <div class="social-logo" v-html="FacebookLogo" />
      Kontynuuj z Facebook
    </BaseButton>
    <BaseButton class="social-button" stroked :disabled="anySending ? true : null" :loading="googleSending" @click="loginGoogle()">
      <div class="social-logo" v-html="GoogleLogo" />
      Kontynuuj z Google
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, toRefs, watch } from 'vue'

import FacebookLogo from '@/assets/logos/facebook.svg?raw'
import GoogleLogo from '@/assets/logos/google.svg?raw'

import { ERROR_ACTION_TAG_NAME } from '@/configs/error'

import { useErrorHandler } from '@/error'

import { useToast } from '@/plugins/toast'
import { ToastType } from '@/plugins/toast/toastType'

import FacebookService from '@/services/facebook'
import GoogleService from '@/services/google'

import { useUserStore } from '@/stores/user'

export default defineComponent({
  emits: ['lock-inputs', 'unlock-inputs'],

  setup(_, { emit }) {
    // usings
    const userStore = useUserStore()
    const errorHandler = useErrorHandler()
    const toast = useToast()

    // data
    const data = reactive({
      facebookSending: false,
      googleSending: false
    })

    // computed
    const anySending = computed(() => {
      return data.facebookSending || data.googleSending
    })

    // methods
    const loginFacebook = async () => {
      data.facebookSending = true
      try {
        const accessToken = await FacebookService.login()
        await userStore.facebookAuth({ accessToken })
      } catch (errors) {
        const toastContent =
          Array.isArray(errors) && errors.includes('EMAIL_NOT_IN_TOKEN')
            ? 'Nie udało nam się uzyskać Twojego adresu email'
            : 'Wystąpił problem podczas próby logowania'

        toast.show(toastContent, ToastType.ERROR)
        errorHandler.captureError(errors, {
          [ERROR_ACTION_TAG_NAME]: 'authSocialMixin.loginFacebook'
        })
      } finally {
        data.facebookSending = false
      }
    }

    const loginGoogle = async () => {
      data.googleSending = true
      try {
        const idToken = await GoogleService.login()
        await userStore.googleAuth({ idToken })
      } catch (error) {
        toast.show('Wystąpił problem podczas próby logowania', ToastType.ERROR)
        errorHandler.captureError(error, {
          [ERROR_ACTION_TAG_NAME]: 'authSocialMixin.loginGoogle'
        })
      } finally {
        data.googleSending = false
      }
    }

    watch(anySending, newValue => {
      if (newValue) {
        emit('lock-inputs')
      } else {
        emit('unlock-inputs')
      }
    })

    FacebookService.init()
    // GoogleService.init() // because of cookies

    return {
      // consts
      FacebookLogo,
      GoogleLogo,
      // data
      ...toRefs(data),
      // computed
      anySending,
      // methods
      loginFacebook,
      loginGoogle
    }
  }
})
</script>

<style lang="scss" scoped>
.social-list {
  margin-top: 1rem;

  .social-button {
    width: 100%;
  }

  .social-button + .social-button {
    margin-top: 1rem;
  }

  .social-logo {
    height: 1rem;
    margin-right: 0.5rem;

    ::v-deep(svg) {
      height: 100%;
    }
  }
}
</style>
