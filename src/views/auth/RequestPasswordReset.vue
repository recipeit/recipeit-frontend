<template>
  <div class="auth-page__content">
    <h1>Nie pamiętasz hasła?</h1>

    <template v-if="state === 'BEFORE'">
      <p>Wpisz adres e-mail, aby zresetować hasło. Może być konieczne sprawdzenie folderu ze spamem.</p>

      <form @submit.prevent="requestPasswordReset()">
        <BaseInput class="form-row" label="Email" type="email" v-model="userData.email" :errors="userDataErrors.email"></BaseInput>
        <BaseButton class="form-row auth-page__content__submit" raised color="contrast" type="submit">Prześlij</BaseButton>
      </form>
    </template>

    <template v-else-if="state === 'SENDING'">
      ...czekaj
    </template>

    <template v-else-if="state === 'SUCCESS'">
      Sprawdź swoją skrzynkę pocztową!
    </template>

    <template v-else>
      Wystąpił błąd
    </template>
  </div>
</template>

<script>
import identityApi from '@/api/identityApi'
import { validateEmail } from '@/functions/validators'

export default {
  data: () => ({
    userData: {
      email: ''
    },
    userDataErrors: {
      email: null
    },
    state: 'BEFORE'
  }),
  beforeMount() {
    this.state = 'BEFORE'
  },
  methods: {
    requestPasswordReset() {
      this.userDataErrors.email = this.validateEmail()

      if (Object.values(this.userDataErrors).some(v => v !== null)) return

      this.state = 'SENDING'
      identityApi
        .requestPasswordReset(this.userData.email)
        .then(() => {
          this.state = 'SUCCESS'
        })
        .catch(() => {
          this.state = 'ERROR'
        })
    },
    validateEmail() {
      const { email } = this.userData
      if (!email) return ['REQUIRED']
      if (!validateEmail(email)) return ['INVALID_EMAIL']
      return null
    },
    validatePassword() {
      if (!this.userData.password) return ['REQUIRED']
      return null
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
