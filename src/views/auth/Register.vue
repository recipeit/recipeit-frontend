<template>
  <div class="auth-page__content">
    <h1>Zarejestruj się w RecipeIt</h1>

    <AuthSocialList />

    <p>lub za pomocą adresu email</p>

    <form @submit.prevent="register()">
      <div>
        <input type="text" v-model="userData.email" placeholder="email" />
      </div>
      <div>
        <input type="password" v-model="userData.password" placeholder="hasło" />
      </div>
      <div>
        <input type="password" v-model="userData.confirmPassword" placeholder="potwierdź hasło" />
      </div>

      <BaseButton class="auth-page__content__submit" raised color="black" type="submit">Zarejestruj się</BaseButton>
    </form>

    <p>
      Masz już konto?
      <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
        <BaseLink :href="href" @click="navigate" color="primary">
          Zaloguj się
        </BaseLink>
      </router-link>
    </p>
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
