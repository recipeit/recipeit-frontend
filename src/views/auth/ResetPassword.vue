<template>
  <div class="auth-main__content">
    <template v-if="state === 'BEFORE'">
      <h1>Zmiana hasła</h1>

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
      <h1>Zmiana hasła</h1>

      <div class="wait">
        <Spinner class="wait-spinner" :show="true" />
        czekaj
      </div>
    </template>

    <template v-else-if="state === 'SUCCESS'">
      <h1>Hasło zostało zmienione</h1>

      <div>
        <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
          <BaseButton tag="a" class="login-button" :href="href" @click="navigate($event)" raised color="primary">
            Zaloguj się
          </BaseButton>
        </router-link>
      </div>
    </template>

    <template v-else>
      <h1>Wystąpił błąd</h1>

      <div>
        <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
          <BaseButton tag="a" class="login-button" :href="href" @click="navigate($event)" stroked>
            <BaseIcon class="login-button-icon" icon="arrow-left" weight="semi-bold" />
            Wróć do logowania
          </BaseButton>
        </router-link>
      </div>
    </template>
  </div>
</template>

<script>
import { Field, Form } from 'vee-validate'
import * as Yup from 'yup'
import identityApi from '@/api/identityApi'
import { confirmNewPasswordSchema, newPasswordSchema } from '@/configs/schemas'
import recaptcha from '@/services/recaptcha'
import { RECAPTCHA_ACTIONS } from '@/configs/recaptcha'
import Spinner from '@/components/Spinner'

export default {
  components: {
    Field,
    Form,
    Spinner
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

      recaptcha
        .execute(RECAPTCHA_ACTIONS.RESET_PASSWORD)
        .then(recaptchaToken => {
          identityApi
            .resetPassword({
              email: this.email,
              token: this.token,
              password: password,
              confirmPassword: confirmPassword,
              recaptchaToken: recaptchaToken
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
        })
        .catch(() => {
          this.state = 'ERROR'
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.wait {
  display: flex;
  align-items: center;

  .wait-spinner {
    margin-right: 0.75rem;
    color: var(--color-primary);
  }
}
// form {
// margin-bottom: 16px;
// }
h1 {
  margin-bottom: 1.5rem;
}

.login-button {
  margin-top: 1.5rem;

  .login-button-icon {
    font-size: 0.875rem;
    margin-right: 0.5rem;
  }
}
</style>
