<template>
  <div class="auth-page__content">
    <h1>Nie pamiętasz hasła?</h1>

    <p>Wpisz adres e-mail, aby zresetować hasło. Może być konieczne sprawdzenie folderu ze spamem.</p>

    <form @submit.prevent="register()">
      <BaseInput class="form-row" label="Email" type="text" v-model="userData.email"></BaseInput>
      <BaseButton class="form-row auth-page__content__submit" raised color="contrast" type="submit">Prześlij</BaseButton>
    </form>
  </div>
</template>

<script>
export default {
  data: () => ({
    userData: {
      email: ''
    }
  }),
  methods: {
    resetPassword() {
      this.$store.dispatch('user/resetPassword', this.userData)
    }
  }
}
</script>

<style lang="scss" scoped>
// form {
// margin-bottom: 16px;
// }
h1 {
  margin-bottom: 8px;
}
</style>
