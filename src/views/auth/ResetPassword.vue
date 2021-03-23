<template>
  <div class="auth-page__content">
    <h1>Zmiana hasła</h1>

    <template v-if="state === 'BEFORE'">
      <p>
        Wprowadź nowe hasło dla konta <b>{{ email }}</b>
      </p>

      <form @submit.prevent="resetPassword()">
        <BaseInput class="form-row" label="Hasło" type="password" v-model="userData.password"></BaseInput>
        <BaseInput class="form-row" label="Potwierdź hasło" type="password" v-model="userData.confirmPassword"></BaseInput>
        <BaseButton class="form-row auth-page__content__submit" raised color="contrast" type="submit">Zmień hasło</BaseButton>
      </form>
    </template>

    <template v-else-if="state === 'SENDING'">
      ...czekaj
    </template>

    <template v-else-if="state === 'SUCCESS'">
      Hasło zostało zmienione
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
    state: 'BEFORE',
    email: null,
    token: null,
    userData: {
      password: '',
      confirmPassword: ''
    }
  }),
  beforeMount() {
    this.state = 'BEFORE'

    const { email, token } = this.$route.query
    this.email = email
    this.token = token

    if (!email || !token) {
      this.state = 'ERROR'
    }
  },
  methods: {
    resetPassword() {
      this.state = 'SENDING'
      identityApi
        .resetPassword({
          email: this.email,
          token: this.token,
          password: this.userData.password,
          confirmPassword: this.userData.confirmPassword
        })
        .then(resp => {
          if (resp.data.success) {
            this.state = 'SUCCESS'
          } else {
            this.state = 'ERROR'
          }
        })
        .catch(() => {
          this.state = 'ERROR'
        })
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
