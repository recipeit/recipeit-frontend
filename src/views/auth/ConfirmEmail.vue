<template>
  <div class="auth-main__content">
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
