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
      <BaseInput class="form-row" label="Email" type="email" v-model="userData.email"></BaseInput>
      <BaseInput class="form-row" label="Hasło" type="password" v-model="userData.password"></BaseInput>
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
    errors: null
  }),
  methods: {
    login() {
      this.errors = null
      this.$store.dispatch('user/login', this.userData).catch(errors => {
        this.errors = errors
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

// p {
//   margin: 8px 0;
// }
</style>
