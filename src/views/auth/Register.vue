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
      <BaseInput class="form-row" label="Email" type="text" v-model="userData.email"></BaseInput>
      <BaseInput class="form-row" label="Hasło" type="password" v-model="userData.password"></BaseInput>
      <BaseInput class="form-row" label="Potwierdź hasło" type="password" v-model="userData.confirmPassword"></BaseInput>
      <BaseButton class="form-row auth-page__content__submit" raised color="contrast" type="submit">Zarejestruj się</BaseButton>
    </form>

    <AuthSocialList buttonPrefix="Zarejestruj się z" />

    <div class="auth-page__content__terms">
      Rejestrując się akceptujesz
      <BaseLink class="auth-page__content__terms__link" color="primary">warunki korzystania z Recipeit</BaseLink>
    </div>
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
      password: '',
      confirmPassword: ''
    }
  }),
  methods: {
    register() {
      this.$store.dispatch('user/register', this.userData)
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
