<template>
  <div class="auth-main__content">
    <h1>Zarejestruj się</h1>

    <p class="subtitle">
      lub
      <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
        <BaseLink :href="href" @click="navigate" color="primary">
          zaloguj na swoje konto
        </BaseLink>
      </router-link>
    </p>

    <Form @submit="register($event)" :validation-schema="schema">
      <Field name="email" v-slot="{ field, errors }">
        <BaseInput class="form-row" label="E-mail" type="text" v-bind="field" :errors="errors" />
      </Field>
      <Field name="password" v-slot="{ field, errors }">
        <BaseInput class="form-row" label="Hasło" type="password" v-bind="field" :errors="errors" />
      </Field>
      <Field name="confirmPassword" v-slot="{ field, errors }">
        <BaseInput class="form-row" label="Potwierdź hasło" type="password" v-bind="field" :errors="errors" />
      </Field>
      <BaseButton class="form-row auth-main__content__submit" raised color="contrast" type="submit">Zarejestruj się</BaseButton>
    </Form>

    <ul v-if="errors" class="auth-main__content__errors">
      <li v-for="(error, index) in errors" :key="index">{{ $t(`errorCode.${error}`) }}</li>
    </ul>

    <AuthSocialList buttonPrefix="Kontynuuj z" />

    <div class="auth-main__content__terms">
      Rejestrując się akceptujesz
      <router-link :to="{ name: 'terms' }" v-slot="{ href, navigate }" custom>
        <BaseLink class="auth-main__content__terms__link" :href="href" @click="navigate" color="primary">
          regulamin
        </BaseLink>
      </router-link>
      oraz
      <router-link :to="{ name: 'privacy-policy' }" v-slot="{ href, navigate }" custom>
        <BaseLink class="auth-main__content__terms__link" :href="href" @click="navigate" color="primary">
          politykę prywatności
        </BaseLink>
      </router-link>
    </div>
  </div>
</template>

<script>
import { Field, Form } from 'vee-validate'
import AuthSocialList from './AuthSocialList'
import { emailSchema, newPasswordSchema, confirmNewPasswordSchema } from '@/configs/schemas'
import * as yup from 'yup'

export default {
  components: {
    AuthSocialList,
    Field,
    Form
  },
  setup() {
    const schema = yup.object({
      email: emailSchema(),
      password: newPasswordSchema(),
      confirmPassword: confirmNewPasswordSchema('password')
    })

    return {
      schema
    }
  },
  data: () => ({
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

.subtitle {
  margin-bottom: 1.5rem;
}
</style>
