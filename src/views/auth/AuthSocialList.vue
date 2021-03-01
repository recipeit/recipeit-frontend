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
      alert('login facebook')
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
