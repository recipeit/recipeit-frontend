<template>
  <div class="auth-page__content">
    <h1>Zarejestruj się</h1>

    <p>
      lub
      <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
        <BaseLink :href="href" @click="navigate" color="primary">
          zaloguj na swoje konto
        </BaseLink>
      </router-link>
    </p>
    <!-- <AuthSocialList /> -->

    <!-- <p>lub za pomocą adresu email</p> -->

    <Form @submit="register($event)" :validation-schema="schema">
      <Field type="text" name="email" v-slot="{ field, errors }">
        <BaseInput class="form-row" label="E-mail" type="email" v-bind="field" :errors="errors" />
      </Field>
      <Field type="text" name="password" v-slot="{ field, errors }">
        <BaseInput class="form-row" label="Hasło" type="password" v-bind="field" :errors="errors" />
      </Field>
      <Field type="text" name="confirmPassword" v-slot="{ field, errors }">
        <BaseInput class="form-row" label="Potwierdź hasło" type="password" v-bind="field" :errors="errors" />
      </Field>
      <BaseButton class="form-row auth-page__content__submit" raised color="contrast" type="submit">Zarejestruj się</BaseButton>
    </Form>

    <ul v-if="errors" class="auth-page__content__errors">
      <li v-for="(error, index) in errors" :key="index">{{ $t(`errorCode.${error}`) }}</li>
    </ul>

    <AuthSocialList buttonPrefix="Kontynuuj z" />

    <div class="auth-page__content__terms">
      Rejestrując się akceptujesz
      <router-link :to="{ name: 'terms' }" v-slot="{ href, navigate }" custom>
        <BaseLink class="auth-page__content__terms__link" :href="href" @click="navigate" color="primary">
          warunki korzystania z Recipeit
        </BaseLink>
      </router-link>
    </div>
  </div>
</template>

<script>
import { Field, Form } from 'vee-validate'
import AuthSocialList from './AuthSocialList'
import * as Yup from 'yup'

export default {
  components: {
    AuthSocialList,
    Field,
    Form
  },
  data: () => ({
    schema: Yup.object().shape({
      email: Yup.string()
        .required('REQUIRED')
        .email('INVALID_EMAIL'),
      password: Yup.string()
        .min(6, 'REQUIRED_AT_LEAST_6_CHAR')
        .matches(/^(?=.*[a-z])/, 'REQUIRED_AT_LEAST_ONE_LOWER')
        .matches(/^(?=.*[A-Z])/, 'REQUIRED_AT_LEAST_ONE_UPPER')
        .matches(/^(?=.*[0-9])/, 'REQUIRED_AT_LEAST_ONE_DIGIT')
        .matches(/^(?=.*[!@#$%^&*])/, 'REQUIRED_AT_LEAST_ONE_NON_ALPHANUM')
        .required('REQUIRED'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'WRONG_PASSWORD_COMBINATION')
        .required('REQUIRED')
    }),
    errors: null
  }),
  methods: {
    register(valus) {
      this.errors = null
      this.$store.dispatch('user/register', valus).catch(errors => {
        this.errors = errors
      })
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 8px;
}
</style>
