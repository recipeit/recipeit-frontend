<template>
  <div class="auth-main__content register">
    <h1>Zarejestruj się</h1>

    <p class="subtitle">
      lub
      <router-link v-slot="{ href, navigate }" :to="{ name: 'login' }" custom>
        <BaseLink :href="href" color="primary" @click="navigate($event)"> zaloguj na swoje konto </BaseLink>
      </router-link>
    </p>

    <form @submit="onSubmit($event)">
      <BaseInputField name="email" class="form-row" label="E-mail" type="text" :disabled="anySending" />
      <BaseInputField name="password" class="form-row" label="Hasło" type="password" :disabled="anySending" />
      <BaseInputField name="confirmPassword" class="form-row" label="Potwierdź hasło" type="password" :disabled="anySending" />
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
    </form>

    <ul v-if="errorList" class="auth-main__content__errors">
      <li v-for="(error, index) in errorList" :key="index">{{ $t(`errorCode.${error}`) }}</li>
    </ul>

    <AuthSocialList @lock-inputs="socialSending = true" @unlock-inputs="socialSending = false" />

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

<script lang="ts">
import { useForm } from 'vee-validate'
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { useMeta } from 'vue-meta'
import { object as yupObject } from 'yup'

import { ERROR_ACTION_TAG_NAME } from '@/configs/error'
import { RECAPTCHA_ACTIONS } from '@/configs/recaptcha'
import { emailSchema, newPasswordSchema, confirmNewPasswordSchema } from '@/configs/schemas'
import { BASE_URL } from '@/configs/url'

import { useErrorHandler } from '@/error'

import { AUTH_REGISTER } from '@/router/paths'

import recaptcha from '@/services/recaptcha'

import { useUserStore } from '@/stores/user'

import AuthSocialList from '@/views/auth/AuthSocialList.vue'

import RecaptchaBranding from '@/components/RecaptchaBranding.vue'

type RegisterForm = {
  email: string
  password: string
  confirmPassword: string
}

export default defineComponent({
  components: {
    RecaptchaBranding,
    AuthSocialList
  },

  setup() {
    useMeta({
      title: 'Zarejestruj się',
      link: [{ rel: 'canonical', href: `${BASE_URL}${AUTH_REGISTER}` }]
    })

    // usings
    const userStore = useUserStore()
    const errorHandler = useErrorHandler()

    const { handleSubmit } = useForm<RegisterForm>({
      validationSchema: yupObject().shape({
        email: emailSchema(),
        password: newPasswordSchema(),
        confirmPassword: confirmNewPasswordSchema('password')
      })
    })

    // data
    const data = reactive({
      errorList: null,
      sending: false,
      socialSending: false
    })

    // computed
    const anySending = computed(() => {
      return data.sending || data.socialSending
    })

    // methods
    const onSubmit = handleSubmit(value => {
      data.sending = true
      data.errorList = null

      recaptcha
        .execute(RECAPTCHA_ACTIONS.REGISTER)
        .then(recaptchaToken => {
          userStore
            .register({
              ...value,
              recaptchaToken
            })
            .catch(errors => {
              data.errorList = errors
              errorHandler.captureError(errors, {
                [ERROR_ACTION_TAG_NAME]: 'auth.register'
              })
            })
            .finally(() => {
              data.sending = false
            })
        })
        .catch(error => {
          data.sending = false
          errorHandler.captureError(error, {
            [ERROR_ACTION_TAG_NAME]: 'auth.register.recaptcha'
          })
        })
    })

    return {
      // data
      ...toRefs(data),
      // computed
      anySending,
      // methods
      onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.register {
  h1 {
    margin-bottom: 8px;
  }

  .subtitle {
    margin-bottom: 1.5rem;
  }

  .recaptcha-branding {
    margin-top: 0.75rem;
  }
}
</style>
