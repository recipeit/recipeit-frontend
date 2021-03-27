<template>
  <!-- <div class="auth-social-list-title">lub użyj</div> -->
  <div class="auth-social-list">
    <BaseButton class="auth-social-list__button" stroked color="contrast" @click="loginFacebook()" :disabled="anySending ? true : null">
      <Spinner :show="facebookSending" color="text-primary" />
      <img src="@/assets/logos/facebook.svg" alt="logo" />
      {{ buttonPrefix }} Facebook
    </BaseButton>
    <BaseButton class="auth-social-list__button" stroked color="contrast" @click="loginGoogle()" :disabled="anySending ? true : null">
      <Spinner :show="googleSending" color="text-primary" />
      <img src="@/assets/logos/google.svg" alt="logo" />
      {{ buttonPrefix }} Google
    </BaseButton>
    <!-- <BaseButton class="auth-social-list__button" stroked color="contrast" @click="loginGoogle()">
      <BaseIcon class="auth-social-list__button__icon auth-social-list__button__icon--apple" weight="brands" icon="apple" />
      {{ buttonPrefix }} Apple
    </BaseButton> -->
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'
import { ToastType } from '@/plugins/toast/toastType'
// import { google } from 'googleapis'

export default {
  emits: ['lockInputs', 'unlockInputs'],
  components: { Spinner },
  props: {
    buttonPrefix: String
  },
  data: () => ({
    googleAuth2: null,
    facebookSending: false,
    googleSending: false
  }),
  created() {
    // eslint-disable-next-line no-undef
    gapi.load('auth2', () => {
      // eslint-disable-next-line no-undef
      this.googleAuth2 = gapi.auth2.init({
        client_id: '1077700069274-3ff9jj9d6c6e3kg6a0rd63mv7m9cin67.apps.googleusercontent.com'
      })
    })
  },
  methods: {
    loginFacebook() {
      // eslint-disable-next-line no-undef
      if (typeof FB != 'undefined' && FB != null) {
        this.facebookSending = true
        // eslint-disable-next-line no-undef
        FB.login(
          ({ authResponse }) => {
            this.facebookSending = false
            if (authResponse) {
              // console.log(authResponse)
              // identityApi.facebookAuth(authResponse.accessToken)
              this.$store.dispatch('user/facebookAuth', authResponse.accessToken)
              // resolve()
              // accountService.apiAuthenticate(authResponse.accessToken).then(resolve)
            } else {
              // resolve()
            }
          },
          { scope: 'email,public_profile' }
        )
      } else {
        this.$toast.show('Wystąpił problem podczas próby logowania', ToastType.ERROR)
      }
    },
    loginGoogle() {
      if (this.googleAuth2) {
        this.googleSending = true
        this.googleAuth2
          .signIn({
            scope: 'profile email'
          })
          .then(resp => {
            this.googleSending = false
            const idToken = resp.getAuthResponse()?.id_token
            if (idToken) {
              this.$store.dispatch('user/googleAuth', idToken)
            }
          })
          .catch(() => {
            this.googleSending = false
          })
      }
    }
    // loginTwitter() {
    //   alert('login twitter')
    // }
  },
  computed: {
    anySending() {
      return this.facebookSending || this.googleSending
    }
  },
  watch: {
    anySending(anySending) {
      if (anySending) {
        this.$emit('lockInputs')
      } else {
        this.$emit('unlockInputs')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.auth-social-list-title {
  margin: 1.5rem 0;
  display: flex;
  align-items: center;
  // min-height: 2rem;
  // font-weight: bold;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  // font-weight: bold;
  gap: 1rem;

  &:before,
  &:after {
    content: '';
    height: 1px;
    flex: 1;
    background: var(--color-border);
  }
}
.auth-social-list {
  margin-top: 1rem;

  &__button {
    width: 100%;

    & + & {
      margin-top: 1rem;
    }

    &__icon {
      font-size: 1rem;
      margin-right: 0.5rem;

      &--apple {
        font-size: 1.25rem;
        color: var(--color-max-contrast);
      }
    }

    img {
      height: 1rem;
      margin-right: 0.5rem;
    }
  }
}
</style>
