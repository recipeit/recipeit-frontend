<template>
  <div class="auth-main__content">
    <h1>Potwierdź swoje konto</h1>

    Sprawdź swoją skrzynkę pocztową. Może być konieczne sprawdzenie folderu ze spamem.

    <p>Nie otrzymałeś wiadomości?</p>
    <BaseLink tag="button" color="primary" @click="sendConfirmationEmail()">Wyślij jeszcze raz</BaseLink>
  </div>
</template>

<script>
import identityApi from '@/api/identityApi'
import recaptcha from '@/services/recaptcha'
import { RECAPTCHA_ACTIONS } from '@/configs/recaptcha'
export default {
  props: {
    email: {
      type: String,
      required: true
    }
  },
  methods: {
    sendConfirmationEmail() {
      recaptcha
        .execute(RECAPTCHA_ACTIONS.SEND_CONFIRMATION_EMAIL)
        .then(recaptchaToken => {
          identityApi
            .sendConfirmationEmail({ email: this.email, recaptchaToken })
            .then(() => {
              alert('sprawdź swoją skrzynkę pocztową')
            })
            .catch(() => {
              alert('coś poszło nie tak')
            })
        })
        .catch(() => {
          alert('coś poszło nie tak')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 8px;
}
</style>
