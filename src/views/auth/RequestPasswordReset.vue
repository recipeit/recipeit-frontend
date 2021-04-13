<template>
  <div class="auth-page__content">
    <h1>Nie pamiętasz hasła?</h1>

    <template v-if="state === 'BEFORE'">
      <p class="subtitle">Wpisz adres e-mail, aby zresetować hasło. Może być konieczne sprawdzenie folderu ze spamem.</p>

      <Form @submit="requestPasswordReset($event)" :validation-schema="schema">
        <Field name="email" v-slot="{ field, errors }">
          <BaseInput class="form-row" label="E-mail" type="email" v-bind="field" :errors="errors" />
        </Field>

        <div class="buttons">
          <BaseButton class="form-row auth-page__content__submit" raised color="contrast" type="submit">Prześlij</BaseButton>
          <!-- <router-link :to="{ name: 'login' }" v-slot="{ href, nagivate }" custom>
            <BaseButton :anchorTag="true" :href="href" @click="nagivate" class="return-button" stroked>
              <BaseIcon class="return-button-icon" icon="arrow-left" weight="semi-bold" />
              Wróć
            </BaseButton>
          </router-link> -->
          <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
            <BaseLink class="auth-page__content__request-password-reset" :href="href" @click="navigate" color="primary">
              Nie pamiętasz hasła?
            </BaseLink>
          </router-link>
        </div>
      </Form>
    </template>

    <template v-else-if="state === 'SENDING'">
      ...czekaj
    </template>

    <template v-else-if="state === 'SUCCESS'">
      Sprawdź swoją skrzynkę pocztową!
    </template>

    <template v-else>
      Wystąpił błąd
    </template>
  </div>
</template>

<script>
import { Field, Form } from 'vee-validate'
import * as Yup from 'yup'
import identityApi from '@/api/identityApi'

export default {
  components: {
    Field,
    Form
  },
  data: () => ({
    schema: Yup.object().shape({
      email: Yup.string()
        .required('REQUIRED')
        .email('INVALID_EMAIL')
    }),
    state: 'BEFORE'
  }),
  beforeMount() {
    this.state = 'BEFORE'
  },
  methods: {
    requestPasswordReset({ email }) {
      this.state = 'SENDING'
      identityApi
        .requestPasswordReset(email)
        .then(() => {
          this.state = 'SUCCESS'
        })
        .catch(() => {
          this.state = 'ERROR'
        })
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
</style>
