<template>
  <div class="auth-page__content">
    <h1>Zmiana hasła</h1>

    <template v-if="state === 'BEFORE'">
      <p>
        Wprowadź nowe hasło dla konta <b>{{ email }}</b>
      </p>

      <form @submit.prevent="resetPassword()">
        <BaseInput class="form-row" label="Hasło" type="password" v-model="userData.password" :errors="userDataErrors.password"></BaseInput>
        <BaseInput
          class="form-row"
          label="Potwierdź hasło"
          type="password"
          v-model="userData.confirmPassword"
          :errors="userDataErrors.confirmPassword"
        ></BaseInput>
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
    },
    userDataErrors: {
      password: null,
      confirmPassword: null
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
      this.userDataErrors.password = this.validatePassword()
      this.userDataErrors.confirmPassword = this.validateConfirmPassword()

      if (Object.values(this.userDataErrors).some(v => v !== null)) return

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
    },
    validatePassword() {
      const { password } = this.userData
      if (!password) return ['REQUIRED']

      let passwordPolicies = []

      if (password.length <= 6) passwordPolicies.push('REQUIRED_AT_LEAST_6_CHAR')
      if (!/[a-z]/.test(password)) passwordPolicies.push('REQUIRED_AT_LEAST_ONE_LOWER')
      if (!/[A-Z]/.test(password)) passwordPolicies.push('REQUIRED_AT_LEAST_ONE_UPPER')
      if (!/\d/.test(password)) passwordPolicies.push('REQUIRED_AT_LEAST_ONE_DIGIT')
      if (/^[a-z0-9]+$/i.test(password.toLowerCase())) passwordPolicies.push('REQUIRED_AT_LEAST_ONE_NON_ALPHANUM')

      if (passwordPolicies.length > 0) return passwordPolicies

      return null
    },
    validateConfirmPassword() {
      if (!this.userData.confirmPassword) {
        return ['REQUIRED']
      }

      if (this.userData.email !== this.userData.confirmPassword) {
        return ['WRONG_PASSWORD_COMBINATION']
      }

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
