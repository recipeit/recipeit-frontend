<template>
  <div class="auth-main__content request-password-reset">
    <h1>Nie pamiętasz hasła?</h1>

    <template v-if="state === 'BEFORE' || state === 'SENDING'">
      <p class="subtitle">Wprowadź adres e-mail, aby zresetować hasło. Może być konieczne sprawdzenie folderu ze spamem.</p>

      <Form :validation-schema="schema" :initial-values="initialValues" @submit="requestPasswordReset($event)">
        <Field v-slot="{ field, errors }" name="email">
          <BaseInput class="form-row" label="E-mail" v-bind="field" :errors="errors" :disabled="state === 'SENDING'" />
        </Field>

        <div class="buttons">
          <BaseButton class="form-row auth-main__content__submit" raised color="primary" type="submit" :loading="state === 'SENDING'">
            Prześlij
          </BaseButton>
          <router-link v-slot="{ href, navigate }" :to="{ name: 'login' }" custom>
            <BaseButton tag="a" class="return-button" :href="href" stroked @click="navigate($event)">
              <BaseIcon class="return-button-icon" icon="arrow-left" weight="semi-bold" />
              Wróć
            </BaseButton>
          </router-link>
        </div>
      </Form>

      <RecaptchaBranding class="recaptcha-branding" />
    </template>

    <template v-else-if="state === 'SUCCESS'">
      Sprawdź swoją skrzynkę pocztową!
      <div class="buttons">
        <router-link v-slot="{ href, navigate }" :to="{ name: 'login' }" custom>
          <BaseButton tag="a" class="return-button-only" :href="href" stroked @click="navigate($event)">
            <BaseIcon class="return-button-icon" icon="arrow-left" weight="semi-bold" />
            Wróć
          </BaseButton>
        </router-link>
      </div>
    </template>

    <template v-else>
      Wystąpił błąd
      <div class="buttons">
        <router-link v-slot="{ href, navigate }" :to="{ name: 'login' }" custom>
          <BaseButton tag="a" class="return-button-only" :href="href" stroked @click="navigate($event)">
            <BaseIcon class="return-button-icon" icon="arrow-left" weight="semi-bold" />
            Wróć
          </BaseButton>
        </router-link>
      </div>
    </template>
  </div>
</template>

<script>
import { Field, Form } from 'vee-validate'
import { useMeta } from 'vue-meta'
import * as yup from 'yup'

import identityApi from '@/api/identityApi'

import { ERROR_ACTION_TAG_NAME } from '@/configs/error'
import { RECAPTCHA_ACTIONS } from '@/configs/recaptcha'
import { emailSchema } from '@/configs/schemas'
import { BASE_URL } from '@/configs/url'

import { AUTH_REQUEST_PASSWORD_RESET } from '@/router/paths'

import recaptcha from '@/services/recaptcha'

import RecaptchaBranding from '@/components/RecaptchaBranding.vue'

export default {
  components: {
    RecaptchaBranding,
    Field,
    Form
  },
  props: {
    initialEmail: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    useMeta({
      title: 'Zapomniałem hasła',
      link: [{ rel: 'canonical', href: `${BASE_URL}${AUTH_REQUEST_PASSWORD_RESET}` }]
    })

    const schema = yup.object({
      email: emailSchema()
    })
    const initialValues = {
      email: props.initialEmail
    }

    return { schema, initialValues }
  },
  data: () => ({
    state: 'BEFORE'
  }),
  beforeMount() {
    this.state = 'BEFORE'
  },
  methods: {
    async requestPasswordReset({ email }) {
      this.state = 'SENDING'

      recaptcha
        .execute(RECAPTCHA_ACTIONS.REQUEST_PASSWORD_RESET)
        .then(recaptchaToken => {
          identityApi
            .requestPasswordReset({
              email,
              recaptchaToken
            })
            .then(() => {
              this.state = 'SUCCESS'
            })
            .catch(error => {
              this.state = 'ERROR'
              this.$errorHandler.captureError(error, {
                [ERROR_ACTION_TAG_NAME]: 'auth.requestPasswordReset'
              })
            })
        })
        .catch(error => {
          this.state = 'ERROR'
          this.$errorHandler.captureError(error, {
            [ERROR_ACTION_TAG_NAME]: 'auth.requestPasswordReset.recaptcha'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.request-password-reset {
  h1 {
    margin-bottom: 8px;
  }

  .subtitle {
    color: var(--color-text-secondary);
    margin-bottom: 1.5rem;
  }

  .buttons {
    display: flex;
    flex-direction: row-reverse;
    margin-top: 1.5rem;
  }

  .return-button {
    width: 100%;
    margin-right: 1rem;

    &-icon {
      font-size: 0.875rem;
      margin-right: 0.5rem;
    }
  }

  .return-button-only {
    margin-right: auto;
  }

  .recaptcha-branding {
    margin-top: 1rem;
  }
}
</style>
