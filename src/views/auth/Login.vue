<template>
  <div class="auth-main__content login">
    <h1>Zaloguj się</h1>
    <p class="subtitle">
      lub
      <router-link v-slot="{ href, navigate }" :to="{ name: 'register' }" custom>
        <BaseLink :href="href" color="primary" @click="navigate($event)">
          utwórz konto
        </BaseLink>
      </router-link>
    </p>

    <!-- <p>lub za pomocą adresu email</p> -->

    <Form v-slot="{ values }" :validation-schema="schema" :initial-values="initialValues" @submit="login($event)">
      <Field v-slot="{ field, errors }" name="email">
        <BaseInput class="form-row" label="E-mail" type="text" v-bind="field" :errors="errors" :disabled="anySending" />
      </Field>
      <Field v-slot="{ field, errors }" name="password">
        <BaseInput
          class="form-row"
          label="Hasło"
          type="password"
          v-bind="field"
          :errors="errors"
          :disabled="anySending"
          :autofocus="hasInitialEmail"
        />
      </Field>
      <BaseButton
        class="form-row auth-main__content__submit"
        raised
        color="primary"
        type="submit"
        :disabled="anySending"
        :loading="sending"
      >
        Zaloguj się
      </BaseButton>

      <ul v-if="errorList" class="auth-main__content__errors">
        <li v-for="(error, index) in errorList" :key="index">{{ $t(`errorCode.${error}`) }}</li>
      </ul>

      <BaseLink
        tag="button"
        color="primary"
        class="auth-main__content__request-password-reset"
        @click.prevent="goToRequestPasswordReset(values.email)"
      >
        nie pamiętasz hasła?
      </BaseLink>
    </Form>

    <AuthSocialList @lockInputs="socialSending = true" @unlockInputs="socialSending = false" />

    <RecaptchaBranding class="recaptcha-branding" />
  </div>
</template>

<script>
import { Field, Form } from 'vee-validate'
import { useMeta } from 'vue-meta'
import * as yup from 'yup'

import { ERROR_ACTION_TAG_NAME } from '@/configs/error'
import { RECAPTCHA_ACTIONS } from '@/configs/recaptcha'
import { emailSchema, passwordSchema } from '@/configs/schemas'
import { BASE_URL } from '@/configs/url'

import { AUTH_LOGIN } from '@/router/paths'

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
  props: {
    email: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    useMeta({
      title: 'Zaloguj się',
      link: [{ rel: 'canonical', href: `${BASE_URL}${AUTH_LOGIN}` }]
    })

    const schema = yup.object({
      email: emailSchema(),
      password: passwordSchema()
    })

    const initialValues = {
      email: props.email
    }

    const hasInitialEmail = !!props.email

    return {
      schema,
      initialValues,
      hasInitialEmail
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
    login(values) {
      this.errorList = null
      this.sending = true

      recaptcha
        .execute(RECAPTCHA_ACTIONS.LOGIN)
        .then(recaptchaToken => {
          this.$store
            .dispatch('user/login', { ...values, recaptchaToken })
            .catch(errors => {
              this.errorList = errors
              this.$errorHandler.captureError(errors, {
                [ERROR_ACTION_TAG_NAME]: 'auth.login'
              })
            })
            .finally(() => {
              this.sending = false
            })
        })
        .catch(error => {
          this.sending = false
          this.$errorHandler.captureError(error, {
            [ERROR_ACTION_TAG_NAME]: 'auth.login.recaptcha'
          })
        })
    },
    goToRequestPasswordReset(email) {
      this.$router.push({ name: 'request-password-reset', params: { initialEmail: email || '' } })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  h1 {
    margin-bottom: 8px;
  }

  .subtitle {
    margin-bottom: 1.5rem;
  }

  .recaptcha-branding {
    margin-top: 1rem;
  }
}
</style>
