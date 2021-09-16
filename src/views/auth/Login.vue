<template>
  <div class="auth-main__content">
    <h1>Zaloguj się</h1>
    <p class="subtitle">
      lub
      <router-link :to="{ name: 'register' }" v-slot="{ href, navigate }" custom>
        <BaseLink :href="href" @click="navigate($event)" color="primary">
          utwórz konto
        </BaseLink>
      </router-link>
    </p>

    <!-- <p>lub za pomocą adresu email</p> -->

    <Form @submit="login($event)" :validation-schema="schema" :initial-values="initialValues" v-slot="{ values }">
      <Field name="email" v-slot="{ field, errors }">
        <BaseInput class="form-row" label="E-mail" type="text" v-bind="field" :errors="errors" :disabled="anySending" />
      </Field>
      <Field name="password" v-slot="{ field, errors }">
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

      <ul v-if="errors" class="auth-main__content__errors">
        <li v-for="(error, index) in errors" :key="index">{{ $t(`errorCode.${error}`) }}</li>
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
import AuthSocialList from './AuthSocialList'
import * as yup from 'yup'
import { emailSchema, passwordSchema } from '@/configs/schemas'
import RecaptchaBranding from '@/components/RecaptchaBranding'
import recaptcha from '@/services/recaptcha'
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
  props: {
    email: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    useMeta({
      title: 'Zaloguj się'
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
    errors: null,
    sending: false,
    socialSending: false
  }),
  methods: {
    login(values) {
      this.errors = null
      this.sending = true

      recaptcha
        .execute(RECAPTCHA_ACTIONS.LOGIN)
        .then(recaptchaToken => {
          this.$store
            .dispatch('user/login', { ...values, recaptchaToken })
            .catch(errors => {
              this.errors = errors
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
  },
  computed: {
    anySending() {
      return this.sending || this.socialSending
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
.subtitle {
  margin-bottom: 1.5rem;
}

.recaptcha-branding {
  margin-top: 1rem;
}

// p {
//   margin: 8px 0;
// }
</style>
