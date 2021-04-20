<template>
  <div class="auth-main__content">
    <h1>Zmiana hasła</h1>

    <template v-if="state === 'BEFORE'">
      <Form @submit="resetPassword($event)" :validation-schema="schema">
        <BaseInput class="form-row" label="E-mail" type="text" :value="email" :disabled="true" />
        <Field name="password" type="password" v-slot="{ field, errors }">
          <BaseInput class="form-row" label="Hasło" type="password" v-bind="field" :errors="errors" />
        </Field>
        <Field name="confirmPassword" type="password" v-slot="{ field, errors }">
          <BaseInput class="form-row" label="Potwierdź hasło" type="password" v-bind="field" :errors="errors" />
        </Field>
        <BaseButton class="form-row auth-main__content__submit" raised color="primary" type="submit">Zmień hasło</BaseButton>
      </Form>
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
import { Field, Form } from 'vee-validate'
import * as Yup from 'yup'
import identityApi from '@/api/identityApi'
import { confirmNewPasswordSchema, newPasswordSchema } from '@/configs/schemas'

export default {
  components: {
    Field,
    Form
  },
  setup() {
    const schema = Yup.object({
      password: newPasswordSchema(),
      confirmPassword: confirmNewPasswordSchema()
    })

    return {
      schema
    }
  },
  data: () => ({
    state: 'BEFORE',
    email: null,
    token: null
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
    resetPassword({ password, confirmPassword }) {
      this.state = 'SENDING'
      identityApi
        .resetPassword({
          email: this.email,
          token: this.token,
          password: password,
          confirmPassword: confirmPassword
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
    }
  }
}
</script>

<style lang="scss" scoped>
// form {
// margin-bottom: 16px;
// }
h1 {
  margin-bottom: 1.5rem;
}
</style>
