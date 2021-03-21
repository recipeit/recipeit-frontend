<template>
  <div class="auth-page__content">
    <h1>Potwierdź swoje konto</h1>

    Sprawdź swój adres email. Może być konieczne sprawdzenie folderu ze spamem.

    <p>Nie otrzymałeś wiadomości?</p>
    <BaseLink tag="button" color="primary" @click="sendConfirmationEmail()">Wyślij jeszcze raz</BaseLink>
  </div>
</template>

<script>
import identityApi from '@/api/identityApi'
export default {
  props: {
    email: {
      type: String,
      required: true
    }
  },
  methods: {
    sendConfirmationEmail() {
      identityApi
        .sendConfirmationEmail(this.email)
        .then(() => {
          alert('sprawdź swoją skrzynkę pocztową')
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
