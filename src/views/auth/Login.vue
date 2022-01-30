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

    <AuthSocialList @lock-inputs="socialSending = true" @unlock-inputs="socialSending = false" />

    <RecaptchaBranding class="recaptcha-branding" />
  </div>
</template>

<script lang="ts">
import { Field, Form } from 'vee-validate'
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { useMeta } from 'vue-meta'
import { useRouter } from 'vue-router'
import * as yup from 'yup'

import { ERROR_ACTION_TAG_NAME } from '@/configs/error'
import { RECAPTCHA_ACTIONS } from '@/configs/recaptcha'
import { emailSchema, passwordSchema } from '@/configs/schemas'
import { BASE_URL } from '@/configs/url'

import { useErrorHandler } from '@/error'

import { AUTH_LOGIN } from '@/router/paths'

import recaptcha from '@/services/recaptcha'

import { useUserStore } from '@/stores/user'

import AuthSocialList from '@/views/auth/AuthSocialList.vue'

import RecaptchaBranding from '@/components/RecaptchaBranding.vue'

export default defineComponent({
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

    // usings
    const userStore = useUserStore()
    const router = useRouter()
    const errorHandler = useErrorHandler()

    // consts
    const hasInitialEmail = !!props.email

    const initialValues = {
      email: props.email
    }

    // data
    const data = reactive({
      errorList: null,
      sending: false,
      socialSending: false
    })

    const schema = yup.object({
      email: emailSchema(),
      password: passwordSchema()
    })

    // computed
    const anySending = computed(() => {
      return data.sending || data.socialSending
    })

    // methods
    const login = values => {
      data.errorList = null
      data.sending = true

      recaptcha
        .execute(RECAPTCHA_ACTIONS.LOGIN)
        .then(recaptchaToken => {
          userStore
            .login({ ...values, recaptchaToken })
            .catch(errors => {
              data.errorList = errors
              errorHandler.captureError(errors, {
                [ERROR_ACTION_TAG_NAME]: 'auth.login'
              })
            })
            .finally(() => {
              data.sending = false
            })
        })
        .catch(error => {
          data.sending = false
          errorHandler.captureError(error, {
            [ERROR_ACTION_TAG_NAME]: 'auth.login.recaptcha'
          })
        })
    }

    const goToRequestPasswordReset = email => {
      router.push({ name: 'request-password-reset', params: { initialEmail: email || '' } })
    }

    return {
      // consts
      hasInitialEmail,
      initialValues,
      //data
      ...toRefs(data),
      schema,
      // computed
      anySending,
      // methods
      login,
      goToRequestPasswordReset
    }
  }
})
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
