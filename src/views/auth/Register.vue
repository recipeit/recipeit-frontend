<template>
  <div class="auth-page__content">
    <h1>Zarejestruj się</h1>

    <p>
      lub
      <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
        <BaseLink :href="href" @click="navigate" color="primary">
          zaloguj na swoje konto
        </BaseLink>
      </router-link>
    </p>
    <!-- <AuthSocialList /> -->

    <!-- <p>lub za pomocą adresu email</p> -->

    <form @submit.prevent="register()">
      <BaseInput class="form-row" label="Email" type="email" v-model="userData.email" :errors="userDataErrors.email"></BaseInput>
      <BaseInput class="form-row" label="Hasło" type="password" v-model="userData.password" :errors="userDataErrors.password"></BaseInput>
      <BaseInput
        class="form-row"
        label="Potwierdź hasło"
        type="password"
        v-model="userData.confirmPassword"
        :errors="userDataErrors.confirmPassword"
      ></BaseInput>
      <BaseButton class="form-row auth-page__content__submit" raised color="contrast" type="submit">Zarejestruj się</BaseButton>
    </form>

    <ul v-if="errors" class="auth-page__content__errors">
      <li v-for="(error, index) in errors" :key="index">{{ $t(`identityErrorCode.${error}`) }}</li>
    </ul>

    <AuthSocialList buttonPrefix="Zarejestruj się z" />

    <div class="auth-page__content__terms">
      Rejestrując się akceptujesz
      <BaseLink class="auth-page__content__terms__link" color="primary">warunki korzystania z Recipeit</BaseLink>
    </div>
  </div>
</template>

<script>
import { validateEmail } from '@/functions/validators'
import AuthSocialList from './AuthSocialList'

export default {
  components: {
    AuthSocialList
  },
  data: () => ({
    userData: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    userDataErrors: {
      email: null,
      password: null,
      confirmPassword: null
    },
    errors: null
  }),
  methods: {
    validateEmail() {
      const { email } = this.userData
      if (!email) return ['REQUIRED']
      if (!validateEmail(email)) return ['INVALID_EMAIL']
      return null
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
    },
    register() {
      this.errors = null
      Object.keys(this.userDataErrors).map(key => {
        this.userDataErrors[key] = null
      })

      this.userDataErrors.email = this.validateEmail()
      this.userDataErrors.password = this.validatePassword()
      this.userDataErrors.confirmPassword = this.validateConfirmPassword()

      if (Object.values(this.userDataErrors).some(v => v !== null)) return

      this.$store.dispatch('user/register', this.userData).catch(errors => {
        this.errors = errors
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
