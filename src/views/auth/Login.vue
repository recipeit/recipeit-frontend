<template>
  <div class="auth-page__content">
    <h1>Zaloguj się</h1>
    <p>
      lub
      <router-link :to="{ name: 'register' }" v-slot="{ href, navigate }" custom>
        <BaseLink :href="href" @click="navigate" color="primary">
          utwórz konto
        </BaseLink>
      </router-link>
    </p>

    <!-- <p>lub za pomocą adresu email</p> -->

    <Form @submit="login($event)" :validation-schema="schema">
      <Field type="text" name="email" v-slot="{ field, errors }">
        <BaseInput class="form-row" label="Email" type="email" v-bind="field" :errors="errors" :disabled="anySending" />
      </Field>
      <Field type="text" name="password" v-slot="{ field, errors }">
        <BaseInput class="form-row" label="Hasło" type="password" v-bind="field" :errors="errors" :disabled="anySending" />
      </Field>
      <BaseButton class="form-row auth-page__content__submit" raised color="contrast" type="submit" :disabled="anySending">
        <Spinner :show="sending" />
        Zaloguj się
      </BaseButton>
    </Form>

    <ul v-if="errors" class="auth-page__content__errors">
      <li v-for="(error, index) in errors" :key="index">{{ $t(`errorCode.${error}`) }}</li>
    </ul>

    <router-link :to="{ name: 'request-password-reset' }" v-slot="{ href, navigate }" custom>
      <BaseLink class="auth-page__content__request-password-reset" :href="href" @click="navigate" color="primary">
        Nie pamiętasz hasła?
      </BaseLink>
    </router-link>

    <AuthSocialList buttonPrefix="Kontynuuj z" @lockInputs="socialSending = true" @unlockInputs="socialSending = false" />
  </div>
</template>

<script>
import { Field, Form } from 'vee-validate'
import Spinner from '@/components/Spinner'
import AuthSocialList from './AuthSocialList'
import * as Yup from 'yup'

export default {
  components: {
    AuthSocialList,
    Spinner,
    Field,
    Form
  },
  data: () => ({
    schema: Yup.object().shape({
      email: Yup.string()
        .required('REQUIRED')
        .email('INVALID_EMAIL'),
      password: Yup.string().required('REQUIRED')
    }),
    errors: null,
    sending: false,
    socialSending: false
  }),
  methods: {
    login() {
      this.errors = null
      this.sending = true
      this.$store
        .dispatch('user/login', this.userData)
        .catch(errors => {
          this.errors = errors
        })
        .finally(() => {
          this.sending = null
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
// form {
// margin-bottom: 16px;
// }
h1 {
  margin-bottom: 8px;
}

// p {
//   margin: 8px 0;
// }
</style>
