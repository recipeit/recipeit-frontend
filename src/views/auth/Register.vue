<template>
  <div class="auth-main__content">
    <h1>Zarejestruj się</h1>

    <p class="subtitle">
      lub
      <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
        <BaseLink :href="href" @click="navigate($event)" color="primary">
          zaloguj na swoje konto
        </BaseLink>
      </router-link>
    </p>

    <template v-if="enableRegister">
      <Form @submit="register($event)" :validation-schema="schema">
        <Field name="email" v-slot="{ field, errors }">
          <BaseInput class="form-row" label="E-mail" type="text" v-bind="field" :errors="errors" :disabled="anySending" />
        </Field>
        <Field name="password" v-slot="{ field, errors }">
          <BaseInput class="form-row" label="Hasło" type="password" v-bind="field" :errors="errors" :disabled="anySending" />
        </Field>
        <Field name="confirmPassword" v-slot="{ field, errors }">
          <BaseInput class="form-row" label="Potwierdź hasło" type="password" v-bind="field" :errors="errors" :disabled="anySending" />
        </Field>
        <BaseButton
          class="form-row auth-main__content__submit"
          raised
          color="primary"
          type="submit"
          :disabled="anySending"
          :loading="sending"
        >
          Zarejestruj się
        </BaseButton>
      </Form>

      <ul v-if="errors" class="auth-main__content__errors">
        <li v-for="(error, index) in errors" :key="index">{{ $t(`errorCode.${error}`) }}</li>
      </ul>

      <AuthSocialList @lockInputs="socialSending = true" @unlockInputs="socialSending = false" />

      <div class="auth-main__content__terms">
        Rejestrując się akceptujesz
        <router-link :to="{ name: 'terms' }" v-slot="{ href, navigate }" custom>
          <BaseLink class="auth-main__content__terms__link" :href="href" @click="navigate($event)" color="text-secondary">
            regulamin
          </BaseLink>
        </router-link>
        oraz
        <router-link :to="{ name: 'privacy-policy' }" v-slot="{ href, navigate }" custom>
          <BaseLink class="auth-main__content__terms__link" :href="href" @click="navigate($event)" color="text-secondary">
            politykę prywatności
          </BaseLink>
        </router-link>
      </div>

      <RecaptchaBranding class="recaptcha-branding" />
    </template>
    <p v-else>
      Rejestracja tymczasowo niedostępna
    </p>
  </div>
</template>

<script>
import { Field, Form } from 'vee-validate'
import AuthSocialList from './AuthSocialList'
import { emailSchema, newPasswordSchema, confirmNewPasswordSchema } from '@/configs/schemas'
import * as yup from 'yup'
import recaptcha from '@/services/recaptcha'
import RecaptchaBranding from '@/components/RecaptchaBranding'
import { RECAPTCHA_ACTIONS } from '@/configs/recaptcha'
import { useMeta } from 'vue-meta'
import { ERROR_ACTION_TAG_NAME } from '@/configs/error'

export default {
  components: {
    RecaptchaBranding,
    AuthSocialList,
    Field,
    Form
  },
  setup() {
    useMeta({
      title: 'Zarejestruj się'
    })

    const schema = yup.object({
      email: emailSchema(),
      password: newPasswordSchema(),
      confirmPassword: confirmNewPasswordSchema('password')
    })

    return {
      schema
    }
  },
  data: () => ({
    errors: null,
    sending: false,
    socialSending: false,
    enableRegister: false
  }),
  methods: {
    register(valus) {
      this.sending = true
      this.errors = null

      recaptcha
        .execute(RECAPTCHA_ACTIONS.REGISTER)
        .then(recaptchaToken => {
          this.$store
            .dispatch('user/register', {
              ...valus,
              recaptchaToken
            })
            .catch(errors => {
              this.errors = errors
              this.$errorHandler.captureError(errors, {
                [ERROR_ACTION_TAG_NAME]: 'auth.register'
              })
            })
            .finally(() => {
              this.sending = false
            })
        })
        .catch(error => {
          this.sending = false
          this.$errorHandler.captureError(error, {
            [ERROR_ACTION_TAG_NAME]: 'auth.register.recaptcha'
          })
        })
    }
  },
  computed: {
    anySending() {
      return this.sending || this.socialSending
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 8px;
}

.subtitle {
  margin-bottom: 1.5rem;
}

.recaptcha-branding {
  margin-top: 0.75rem;
}
</style>
