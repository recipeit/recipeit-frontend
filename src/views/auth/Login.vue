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
      <BaseInput class="form-row" label="Email" type="email" v-model="userData.email" :errors="userDataErrors.email"></BaseInput>
      <BaseInput class="form-row" label="Hasło" type="password" v-model="userData.password" :errors="userDataErrors.password"></BaseInput>
      <BaseButton class="form-row auth-page__content__submit" raised color="contrast" type="submit">Zaloguj się</BaseButton>
    </form>

    <ul v-if="errors" class="auth-page__content__errors">
      <li v-for="(error, index) in errors" :key="index">{{ $t(`identityErrorCode.${error}`) }}</li>
    </ul>

    <router-link :to="{ name: 'request-password-reset' }" v-slot="{ href, navigate }" custom>
      <BaseLink class="auth-page__content__request-password-reset" :href="href" @click="navigate" color="primary">
        Nie pamiętasz hasła?
      </BaseLink>
    </router-link>

    <AuthSocialList buttonPrefix="Zaloguj się z" />
  </div>
</template>

<script>
import AuthSocialList from './AuthSocialList'

export default {
  components: {
    AuthSocialList
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
    errors: null
  }),
  methods: {
    login() {
      this.errors = null
      Object.keys(this.userDataErrors).map(key => {
        this.userDataErrors[key] = null
      })

      this.userDataErrors.email = this.validateEmail()
      this.userDataErrors.password = this.validatePassword()

      if (Object.values(this.userDataErrors).some(v => v !== null)) return

      this.$store.dispatch('user/login', this.userData).catch(errors => {
        this.errors = errors
      })
    },
    validateEmail() {
      if (!this.userData.email) return ['REQUIRED']
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

// p {
//   margin: 8px 0;
// }
</style>
