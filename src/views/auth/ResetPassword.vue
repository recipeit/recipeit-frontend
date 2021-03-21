<template>
  <div class="auth-page__content">
    <h1>Nie pamiętasz hasła?</h1>

    <template v-if="state === 'BEFORE'">
      <p>Wpisz adres e-mail, aby zresetować hasło. Może być konieczne sprawdzenie folderu ze spamem.</p>

      <form @submit.prevent="resetPassword()">
        <BaseInput class="form-row" label="Email" type="text" v-model="userData.email"></BaseInput>
        <BaseButton class="form-row auth-page__content__submit" raised color="contrast" type="submit">Prześlij</BaseButton>
      </form>
    </template>

    <template v-else-if="state === 'SENDING'">
      ...czekaj
    </template>

    <template v-else-if="state === 'SENT'">
      Sprawdź swoją skrzynkę pocztową!
    </template>

    <template v-else>
      Wystąpił błąd
    </template>
  </div>
</template>

<script>
import identityApi from '@/api/identityApi'

export default {
  data: () => ({
    userData: {
      email: ''
    },
    state: 'BEFORE'
  }),
  beforeMount() {
    this.state = 'BEFORE'
  },
  methods: {
    resetPassword() {
      if (this.userData.email) {
        this.state = 'SENDING'
        identityApi
          .resetPassword(this.userData.email)
          .then(() => {
            this.state = 'SENT'
          })
          .catch(() => {
            this.state = 'ERROR'
          })
      }
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
