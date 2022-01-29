<template>
  <div class="auth-main__content reset-password">
    <template v-if="state === 'BEFORE'">
      <h1>Zmiana hasła</h1>

      <Form :validation-schema="schema" @submit="resetPassword($event)">
        <BaseInput class="form-row" label="E-mail" type="text" :value="email" :disabled="true" />
        <Field v-slot="{ field, errors }" name="password" type="password">
          <BaseInput class="form-row" label="Hasło" type="password" v-bind="field" :errors="errors" />
        </Field>
        <Field v-slot="{ field, errors }" name="confirmPassword" type="password">
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
        <router-link v-slot="{ href, navigate }" :to="{ name: 'login' }" custom>
          <BaseButton tag="a" class="login-button" :href="href" raised color="primary" @click="navigate($event)">
            Zaloguj się
          </BaseButton>
        </router-link>
      </div>
    </template>

    <template v-else>
      <h1>Wystąpił błąd</h1>

      <div>
        <router-link v-slot="{ href, navigate }" :to="{ name: 'login' }" custom>
          <BaseButton tag="a" class="login-button" :href="href" stroked @click="navigate($event)">
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
import { onBeforeMount, reactive, toRefs } from 'vue'
import { useMeta } from 'vue-meta'
import { useRoute } from 'vue-router'
import * as Yup from 'yup'

import identityApi from '@/api/identityApi'

import { ERROR_ACTION_TAG_NAME } from '@/configs/error'
import { RECAPTCHA_ACTIONS } from '@/configs/recaptcha'
import { confirmNewPasswordSchema, newPasswordSchema } from '@/configs/schemas'
import { BASE_URL } from '@/configs/url'

import { useErrorHandler } from '@/error'

import { AUTH_RESET_PASSWORD } from '@/router/paths'

import recaptcha from '@/services/recaptcha'

import Spinner from '@/components/Spinner.vue'

export default {
  components: {
    Field,
    Form,
    Spinner
  },
  setup() {
    useMeta({
      title: 'Resetowanie hasła',
      link: [{ rel: 'canonical', href: `${BASE_URL}${AUTH_RESET_PASSWORD}` }]
    })

    // usings
    const errorHandler = useErrorHandler()

    // data
    const data = reactive({
      state: 'BEFORE',
      email: null,
      token: null
    })

    const schema = Yup.object({
      password: newPasswordSchema(),
      confirmPassword: confirmNewPasswordSchema()
    })

    // methods
    const resetPassword = ({ password, confirmPassword }) => {
      data.state = 'SENDING'

      recaptcha
        .execute(RECAPTCHA_ACTIONS.RESET_PASSWORD)
        .then(recaptchaToken => {
          identityApi
            .resetPassword({
              email: data.email,
              token: data.token,
              password: password,
              confirmPassword: confirmPassword,
              recaptchaToken: recaptchaToken
            })
            .then(resp => {
              if (resp.data.success) {
                data.state = 'SUCCESS'
              } else {
                data.state = 'ERROR'
              }
            })
            .catch(error => {
              data.state = 'ERROR'
              errorHandler.captureError(error, {
                [ERROR_ACTION_TAG_NAME]: 'auth.resetPassword'
              })
            })
        })
        .catch(error => {
          data.state = 'ERROR'
          errorHandler.captureError(error, {
            [ERROR_ACTION_TAG_NAME]: 'auth.resetPassword.recaptcha'
          })
        })
    }

    // lifecycle hooks
    onBeforeMount(() => {
      const route = useRoute()

      data.state = 'BEFORE'

      const { email, token } = route.query
      data.email = email
      data.token = token

      if (!email || !token) {
        data.state = 'ERROR'
      }
    })

    return {
      // data
      ...toRefs(data),
      schema,
      // methodss
      resetPassword
    }
  }
}
</script>

<style lang="scss" scoped>
.reset-password {
  .wait {
    display: flex;
    align-items: center;
  }

  .wait-spinner {
    margin-right: 0.75rem;
    color: var(--color-primary);
  }

  h1 {
    margin-bottom: 1.5rem;
  }

  .login-button {
    margin-top: 1.5rem;
  }

  .login-button-icon {
    font-size: 0.875rem;
    margin-right: 0.5rem;
  }
}
</style>
