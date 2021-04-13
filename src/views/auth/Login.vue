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

    <Form @submit="login($event)" :validation-schema="schema" v-slot="{ values }">
      <Field name="email" v-slot="{ field, errors }">
        <BaseInput class="form-row" label="E-mail" type="text" v-bind="field" :errors="errors" :disabled="anySending" />
      </Field>
      <Field name="password" v-slot="{ field, errors }">
        <BaseInput class="form-row" label="Hasło" type="password" v-bind="field" :errors="errors" :disabled="anySending" />
      </Field>
      <BaseButton
        class="form-row auth-main__content__submit"
        raised
        color="contrast"
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
  </div>
</template>

<script>
import { Field, Form } from 'vee-validate'
import AuthSocialList from './AuthSocialList'
import * as yup from 'yup'
import { emailSchema, passwordSchema } from '@/configs/schemas'

export default {
  components: {
    AuthSocialList,
    Field,
    Form
  },
  setup() {
    const schema = yup.object({
      email: emailSchema(),
      password: passwordSchema()
    })

    return {
      schema
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
      this.$store
        .dispatch('user/login', values)
        .catch(errors => {
          this.errors = errors
        })
        .finally(() => {
          this.sending = false
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

// p {
//   margin: 8px 0;
// }
</style>
