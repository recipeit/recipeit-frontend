<template>
  <div class="auth-page__content">
    <h1>Zaloguj się</h1>
    <p>
      lub
      <router-link :to="{ name: 'register' }" v-slot="{ href, navigate }" custom>
        <BaseLink :href="href" @click="navigate" color="primary">
          utwórz konto
        </BaseLink>
      </router-link>
    </p>

    <!-- <p>lub za pomocą adresu email</p> -->

    <form @submit.prevent="login()">
      <BaseInput
        class="form-row"
        label="Email"
        type="email"
        v-model="userData.email"
        :errors="userDataErrors.email"
        :disabled="anySending"
      ></BaseInput>
      <BaseInput
        class="form-row"
        label="Hasło"
        type="password"
        v-model="userData.password"
        :errors="userDataErrors.password"
        :disabled="anySending"
      ></BaseInput>
      <BaseButton class="form-row auth-page__content__submit" raised color="contrast" type="submit" :disabled="anySending">
        <Spinner :show="sending" />
        Zaloguj się
      </BaseButton>
    </form>

    <ul v-if="errors" class="auth-page__content__errors">
      <li v-for="(error, index) in errors" :key="index">{{ $t(`errorCode.${error}`) }}</li>
    </ul>

    <router-link :to="{ name: 'request-password-reset' }" v-slot="{ href, navigate }" custom>
      <BaseLink class="auth-page__content__request-password-reset" :href="href" @click="navigate" color="primary">
        Nie pamiętasz hasła?
      </BaseLink>
    </router-link>

    <AuthSocialList buttonPrefix="Zaloguj się z" @lockInputs="socialSending = true" @unlockInputs="socialSending = false" />
  </div>
</template>

<script>
import Spinner from '@/components/Spinner'
import AuthSocialList from './AuthSocialList'
import { validateEmail } from '@/functions/validators'

export default {
  components: {
    AuthSocialList,
    Spinner
  },
  data: () => ({
    userData: {
      email: '',
      password: ''
    },
    userDataErrors: {
      email: null,
      password: null
    },
    errors: null,
    sending: false,
    socialSending: false
  }),
  methods: {
    login() {
      this.errors = null
      this.userDataErrors.email = this.validateEmail()
      this.userDataErrors.password = this.validatePassword()

      if (Object.values(this.userDataErrors).some(v => v !== null)) return

      this.sending = true
      this.$store
        .dispatch('user/login', this.userData)
        .catch(errors => {
          this.errors = errors
        })
        .finally(() => {
          this.sending = null
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
  },
  computed: {
    anySending() {
      return this.sending || this.socialSending
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

// p {
//   margin: 8px 0;
// }
</style>
