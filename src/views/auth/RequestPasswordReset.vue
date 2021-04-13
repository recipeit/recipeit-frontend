<template>
  <div class="auth-page__content">
    <h1>Nie pamiętasz hasła?</h1>

    <template v-if="state === 'BEFORE'">
      <p>Wpisz adres e-mail, aby zresetować hasło. Może być konieczne sprawdzenie folderu ze spamem.</p>

      <Form @submit="requestPasswordReset($event)" :validation-schema="schema">
        <Field name="email" v-slot="{ field, errors }">
          <BaseInput class="form-row" label="E-mail" type="email" v-bind="field" :errors="errors" />
        </Field>
        <BaseButton class="form-row auth-page__content__submit" raised color="contrast" type="submit">Prześlij</BaseButton>
      </Form>
    </template>

    <template v-else-if="state === 'SENDING'">
      ...czekaj
    </template>

    <template v-else-if="state === 'SUCCESS'">
      Sprawdź swoją skrzynkę pocztową!
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

export default {
  components: {
    Field,
    Form
  },
  data: () => ({
    schema: Yup.object().shape({
      email: Yup.string()
        .required('REQUIRED')
        .email('INVALID_EMAIL')
    }),
    state: 'BEFORE'
  }),
  beforeMount() {
    this.state = 'BEFORE'
  },
  methods: {
    requestPasswordReset({ email }) {
      this.state = 'SENDING'
      identityApi
        .requestPasswordReset(email)
        .then(() => {
          this.state = 'SUCCESS'
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
  margin-bottom: 8px;
}
</style>
