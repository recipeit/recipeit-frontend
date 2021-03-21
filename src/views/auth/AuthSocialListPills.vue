<template>
  <div class="auth-social-list-pills-title">lub {{ buttonPrefix }}</div>
  <div class="auth-social-list-pills">
    <BaseButton class="auth-social-list-pills__button" stroked color="contrast" @click="loginFacebook()">
      <img src="@/assets/logos/facebook.svg" alt="logo" />
    </BaseButton>
    <BaseButton class="auth-social-list-pills__button" stroked color="contrast" @click="loginGoogle()">
      <img src="@/assets/logos/google.svg" alt="logo" />
    </BaseButton>
    <BaseButton class="auth-social-list-pills__button" stroked color="contrast" @click="loginGoogle()">
      <BaseIcon class="auth-social-list-pills__button__icon auth-social-list-pills__button__icon--apple" weight="brands" icon="apple" />
    </BaseButton>
  </div>
</template>

<script>
// import { google } from 'googleapis'

export default {
  props: {
    buttonPrefix: String
  },
  data: () => ({
    googleAuth2: null
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
      FB.login(
        ({ authResponse }) => {
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
    },
    loginGoogle() {
      if (this.googleAuth2)
        this.googleAuth2
          .signIn({
            scope: 'profile email'
          })
          .then(resp => {
            console.log(resp)
            const idToken = resp?.uc?.id_token
            if (idToken) {
              this.$store.dispatch('user/googleAuth', idToken)
            }
          })
    }
    // loginTwitter() {
    //   alert('login twitter')
    // }
  }
}
</script>

<style lang="scss" scoped>
.auth-social-list-pills-title {
  margin: 1rem 0;
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
.auth-social-list-pills {
  margin-top: 1rem;
  display: flex;

  &__button {
    flex: 1;

    &__icon {
      font-size: 1rem;

      &--apple {
        font-size: 1.25rem;
        color: var(--color-max-contrast);
      }
    }

    img {
      height: 1rem;
    }
  }

  &__button + &__button {
    margin-left: 1rem;
  }
}
</style>
