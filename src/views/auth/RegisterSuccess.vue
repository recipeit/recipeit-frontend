<template>
  <div class="auth-main__content">
    <template v-if="secondEmailSent">
      <h1>Wysłaliśmy wiadomość jeszcze raz</h1>

      Sprawdź swoją skrzynkę pocztową. Może być konieczne sprawdzenie folderu ze spamem.

      <div>
        <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
          <BaseButton tag="a" class="login-button" :href="href" @click="navigate($event)" stroked>
            <BaseIcon class="login-button-icon" icon="arrow-left" weight="semi-bold" />
            Wróć do logowania
          </BaseButton>
        </router-link>
      </div>
    </template>
    <template v-else>
      <h1>Potwierdź swoje konto</h1>

      Sprawdź swoją skrzynkę pocztową. Może być konieczne sprawdzenie folderu ze spamem.

      <div>
        <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
          <BaseButton tag="a" class="login-button" :href="href" @click="navigate($event)" stroked>
            <BaseIcon class="login-button-icon" icon="arrow-left" weight="semi-bold" />
            Wróć do logowania
          </BaseButton>
        </router-link>
      </div>

      <div class="no-email-section">
        <span>
          Nie otrzymałeś wiadomości?
        </span>
        <BaseLink tag="button" color="primary" @click="sendConfirmationEmail()" :disabled="sendingSecondEmail">Wyślij jeszcze raz</BaseLink>

        <ul v-if="errors" class="auth-main__content__errors">
          <li v-for="(error, index) in errors" :key="index">{{ $t(`errorCode.${error}`) }}</li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import identityApi from '@/api/identityApi'
import recaptcha from '@/services/recaptcha'
import { RECAPTCHA_ACTIONS } from '@/configs/recaptcha'
import { reactive, toRefs } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { AUTH_LOGIN } from '@/router/names'

export default {
  props: {
    email: {
      type: String,
      required: true
    }
  },
  setup(props) {
    if (!props.email) {
      const router = useRouter()
      router.push({ name: AUTH_LOGIN })
    }

    const data = reactive({
      sendingSecondEmail: false,
      secondEmailSent: false,
      errors: null
    })

    const sendConfirmationEmail = async () => {
      data.errors = null
      data.sendingSecondEmail = true

      try {
        const recaptchaToken = await recaptcha.execute(RECAPTCHA_ACTIONS.SEND_CONFIRMATION_EMAIL)

        try {
          await identityApi.sendConfirmationEmail({ email: props.email, recaptchaToken })
          data.secondEmailSent = true
        } catch (err) {
          data.errors = err?.response?.data?.errors
        }
      } catch (e) {
        data.errors = ['ERROR']
      } finally {
        data.sendingSecondEmail = false
      }
    }

    return {
      ...toRefs(data),
      sendConfirmationEmail
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 0.875rem;
  line-height: 1.25;
}

.login-button {
  margin-top: 1.5rem;

  .login-button-icon {
    font-size: 0.875rem;
    margin-right: 0.5rem;
  }
}

.no-email-section {
  margin-top: 1.5rem;
}
</style>
