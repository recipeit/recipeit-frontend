import { ERROR_ACTION_TAG_NAME } from '@/configs/error'

import { ToastType } from '@/plugins/toast/toastType'

import FacebookService from '@/services/facebook'
import GoogleService from '@/services/google'
import { useUserStore } from '@/stores/user'

export default {
  setup() {
    const userStore = useUserStore()

    return {
      userStore
    }
  },
  data: () => ({
    facebookSending: false,
    googleSending: false
  }),
  created() {
    FacebookService.init()
    // GoogleService.init() // because of cookies
  },
  methods: {
    async loginFacebook() {
      this.facebookSending = true
      try {
        const accessToken = await FacebookService.login()
        await this.userStore.facebookAuth({ accessToken })
      } catch (errors) {
        const toastContent =
          Array.isArray(errors) && errors.includes('EMAIL_NOT_IN_TOKEN')
            ? 'Nie udało nam się uzyskać Twojego adresu email'
            : 'Wystąpił problem podczas próby logowania'

        this.$toast.show(toastContent, ToastType.ERROR)
        this.$errorHandler.captureError(errors, {
          [ERROR_ACTION_TAG_NAME]: 'authSocialMixin.loginFacebook'
        })
      } finally {
        this.facebookSending = false
      }
    },
    async loginGoogle() {
      this.googleSending = true
      try {
        const idToken = await GoogleService.login()
        await this.userStore.googleAuth({ idToken })
      } catch (error) {
        this.$toast.show('Wystąpił problem podczas próby logowania', ToastType.ERROR)
        this.$errorHandler.captureError(error, {
          [ERROR_ACTION_TAG_NAME]: 'authSocialMixin.loginGoogle'
        })
      } finally {
        this.googleSending = false
      }
    }
  }
}
