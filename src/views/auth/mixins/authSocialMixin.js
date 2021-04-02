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
    GoogleService.init()
  },
  methods: {
    async loginFacebook() {
      this.facebookSending = true
      try {
        const accessToken = await FacebookService.login()
        this.$store.dispatch('user/facebookAuth', accessToken)
      } catch (e) {
        this.$toast.show('Wystąpił problem podczas próby logowania', ToastType.ERROR)
      } finally {
        this.facebookSending = false
      }
    },
    async loginGoogle() {
      this.googleSending = true
      try {
        const accessToken = await GoogleService.login()
        this.$store.dispatch('user/googleAuth', accessToken)
      } catch (e) {
        this.$toast.show('Wystąpił problem podczas próby logowania', ToastType.ERROR)
      } finally {
        this.googleSending = false
      }
    }
  }
}
