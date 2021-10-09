import { ERROR_ACTION_TAG_NAME } from '@/configs/error'

import { ToastType } from '@/plugins/toast/toastType'

import FacebookService from '@/services/facebook'
import GoogleService from '@/services/google'

export default {
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
        await this.$store.dispatch('user/facebookAuth', { accessToken })
      } catch (error) {
        this.$toast.show('Wystąpił problem podczas próby logowania', ToastType.ERROR)
        this.$errorHandler.captureError(error, {
          [ERROR_ACTION_TAG_NAME]: 'authSocialMixin.loginFacebook'
        })
      } finally {
        this.facebookSending = false
      }
    },
    async loginGoogle() {
      this.googleSending = true
      try {
        const accessToken = await GoogleService.login()
        await this.$store.dispatch('user/googleAuth', { accessToken })
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
