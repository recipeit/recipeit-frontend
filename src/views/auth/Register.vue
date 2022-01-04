<template>
  <div class="auth-main__content">
    <h1>Zarejestruj się</h1>

    <p class="subtitle">
      lub
      <router-link v-slot="{ href, navigate }" :to="{ name: 'login' }" custom>
        <BaseLink :href="href" color="primary" @click="navigate($event)">
          zaloguj na swoje konto
        </BaseLink>
      </router-link>
    </p>

    <Form :validation-schema="schema" @submit="register($event)">
      <Field v-slot="{ field, errors }" name="email">
        <BaseInput class="form-row" label="E-mail" type="text" v-bind="field" :errors="errors" :disabled="anySending" />
      </Field>
      <Field v-slot="{ field, errors }" name="password">
        <BaseInput class="form-row" label="Hasło" type="password" v-bind="field" :errors="errors" :disabled="anySending" />
      </Field>
      <Field v-slot="{ field, errors }" name="confirmPassword">
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

    <ul v-if="errorList" class="auth-main__content__errors">
      <li v-for="(error, index) in errorList" :key="index">{{ $t(`errorCode.${error}`) }}</li>
    </ul>

    <AuthSocialList @lockInputs="socialSending = true" @unlockInputs="socialSending = false" />

    <div class="auth-main__content__terms">
      Rejestrując się akceptujesz
      <router-link v-slot="{ href, navigate }" :to="{ name: 'terms' }" custom>
        <BaseLink class="auth-main__content__terms__link" :href="href" color="text-secondary" @click="navigate($event)">
          regulamin
        </BaseLink>
      </router-link>
      oraz
      <router-link v-slot="{ href, navigate }" :to="{ name: 'privacy-policy' }" custom>
        <BaseLink class="auth-main__content__terms__link" :href="href" color="text-secondary" @click="navigate($event)">
          politykę prywatności
        </BaseLink>
      </router-link>
    </div>

    <RecaptchaBranding class="recaptcha-branding" />
  </div>
</template>

<script>
import { Field, Form } from 'vee-validate'
import { useMeta } from 'vue-meta'
import * as yup from 'yup'

import { ERROR_ACTION_TAG_NAME } from '@/configs/error'
import { RECAPTCHA_ACTIONS } from '@/configs/recaptcha'
import { emailSchema, newPasswordSchema, confirmNewPasswordSchema } from '@/configs/schemas'
import { BASE_URL } from '@/configs/url'

import { AUTH_REGISTER } from '@/router/paths'

import recaptcha from '@/services/recaptcha'

import AuthSocialList from '@/views/auth/AuthSocialList.vue'

import RecaptchaBranding from '@/components/RecaptchaBranding.vue'

export default {
  components: {
    RecaptchaBranding,
    AuthSocialList,
    Field,
    Form
  },
  setup() {
    useMeta({
      title: 'Zarejestruj się',
      link: [{ rel: 'canonical', href: `${BASE_URL}${AUTH_REGISTER}` }]
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
    errorList: null,
    sending: false,
    socialSending: false
  }),
  computed: {
    anySending() {
      return this.sending || this.socialSending
    }
  },
  methods: {
    register(valus) {
      this.sending = true
      this.errorList = null

      recaptcha
        .execute(RECAPTCHA_ACTIONS.REGISTER)
        .then(recaptchaToken => {
          this.$store
            .dispatch('user/register', {
              ...valus,
              recaptchaToken
            })
            .catch(errors => {
              this.errorList = errors
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
