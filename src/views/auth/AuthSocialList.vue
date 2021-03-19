<template>
  <div class="auth-page__content__social-list">
    <BaseButton stroked @click="loginFacebook()">f</BaseButton>
    <BaseButton stroked @click="loginGoogle()">G</BaseButton>
    <BaseButton stroked @click="loginTwitter()">t</BaseButton>
  </div>
</template>

<script>
export default {
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
      alert('login google')
    },
    loginTwitter() {
      alert('login twitter')
    }
  }
}
</script>
