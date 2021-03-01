<template>
  <div class="auth-page__content">
    <h1>Zaloguj się w RecipeIt</h1>

    <AuthSocialList />

    <p>lub za pomocą adresu email</p>

    <form @submit.prevent="login()">
      <div>
        <input type="text" v-model="userData.email" placeholder="email" />
      </div>
      <div>
        <input type="password" v-model="userData.password" placeholder="hasło" />
      </div>

      <BaseButton class="auth-page__content__submit" raised color="black" type="submit">Zaloguj się</BaseButton>
    </form>

    <p>
      Nie masz jeszcze konta?
      <router-link :to="{ name: 'register' }" v-slot="{ href, navigate }" custom>
        <BaseLink :href="href" @click="navigate" color="primary">
          Zarejestruj się
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
      password: ''
    }
  }),
  methods: {
    login() {
      this.$store.dispatch('user/login', this.userData)
    }
  }
}
</script>

<style lang="scss" scoped></style>
