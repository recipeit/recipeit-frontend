<template>
  <div class="auth-main__content">
    <h1>Nie pamiętasz hasła?</h1>

    <template v-if="state === 'BEFORE'">
      <p class="subtitle">Wprowadź adres e-mail, aby zresetować hasło. Może być konieczne sprawdzenie folderu ze spamem.</p>

      <Form @submit="requestPasswordReset($event)" :validation-schema="schema" :initial-values="initialValues">
        <Field name="email" v-slot="{ field, errors }">
          <BaseInput class="form-row" label="E-mail" v-bind="field" :errors="errors" />
        </Field>

        <div class="buttons">
          <BaseButton class="form-row auth-main__content__submit" raised color="contrast" type="submit">Prześlij</BaseButton>
          <router-link :to="{ name: 'login' }" v-slot="{ href, navigate }" custom>
            <BaseButton :anchorTag="true" class="return-button" :href="href" @click="navigate" stroked>
              <BaseIcon class="return-button-icon" icon="arrow-left" weight="semi-bold" />
              Wróć
            </BaseButton>
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
import * as yup from 'yup'
import identityApi from '@/api/identityApi'
import { emailSchema } from '@/configs/schemas'

export default {
  components: {
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
