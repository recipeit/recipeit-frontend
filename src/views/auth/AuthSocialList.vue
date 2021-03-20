<template>
  <!-- <div class="auth-social-list-title">lub użyj</div> -->
  <div class="auth-social-list">
    <BaseButton class="form-row auth-social-list__button" stroked color="contrast" @click="loginFacebook()">
      <img src="@/assets/logos/facebook.svg" alt="logo" />
      Zaloguj się z Facebook
    </BaseButton>
    <BaseButton class="form-row auth-social-list__button" stroked color="contrast" @click="loginGoogle()">
      <img src="@/assets/logos/google.svg" alt="logo" />
      Zaloguj się z Google
    </BaseButton>

    <!-- <BaseButton stroked @click="loginFacebook()">f</BaseButton> -->
    <!-- <BaseButton stroked @click="loginGoogle()">G</BaseButton> -->
    <!-- <BaseButton stroked @click="loginTwitter()">t</BaseButton> -->
  </div>
</template>

<script>
// import { google } from 'googleapis'

export default {
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

    img {
      height: 16px;
      margin-right: 8px;
    }
  }
}
</style>
