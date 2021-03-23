<template>
  <div class="auth-page__content">
    <h1>Potwierdź adres email</h1>

    <div v-if="state === 'LOADING'">
      ...czekaj
    </div>
    <div v-else-if="state === 'SUCCESS'">
      Udało się! Teraz możesz się
      <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
        <BaseLink :href="href" @click="navigate" color="primary">
          zalogować
        </BaseLink>
      </router-link>
    </div>
    <div v-else>
      Coś poszło nie tak
    </div>

    <!-- <p>Wpisz adres e-mail, aby zresetować hasło. Może być konieczne sprawdzenie folderu ze spamem.</p>

    <form @submit.prevent="register()">
      <BaseInput class="form-row" label="Email" type="text" v-model="userData.email"></BaseInput>
      <BaseButton class="form-row auth-page__content__submit" raised color="contrast" type="submit">Prześlij</BaseButton>
    </form> -->
  </div>
</template>

<script>
import identityApi from '@/api/identityApi'

export default {
  data: () => ({
    state: 'LOADING'
  }),
  mounted() {
    this.state = 'LOADING'
    const { email, token } = this.$route.query

    if (email && token) {
      identityApi
        .confirmEmail({
          email,
          token
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
    } else {
      this.state = 'ERROR'
    }
  }
}
</script>

<style lang="scss" scoped>
// form {
// margin-bottom: 16px;
// }
// h1 {
//   margin-bottom: 8px;
// }
</style>
